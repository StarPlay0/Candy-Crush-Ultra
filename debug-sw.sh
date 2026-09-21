#!/usr/bin/env bash
set -e

# ANSI Color Codes
BOLD="\033[1m"
GREEN="\033[0;32m"
RED="\033[0;31m"
YELLOW="\033[1;33m"
CYAN="\033[0;36m"
RESET="\033[0m"

echo -e "${BOLD}${CYAN}======================================================${RESET}"
echo -e "${BOLD}${CYAN}   SERVICE WORKER & STATIC EXPORT DIAGNOSTIC SUITE    ${RESET}"
echo -e "${BOLD}${CYAN}======================================================${RESET}"
echo "Date: $(date)"
echo "Current directory: $(pwd)"
echo ""

# -----------------------------------------------------------------------------
# STEP 1: Inspect and list contents of 'out' directory
# -----------------------------------------------------------------------------
echo -e "${BOLD}[1/3] Checking 'out' Static Export Directory:${RESET}"

if [ ! -d "out" ]; then
  echo -e "${YELLOW}Notice: 'out/' directory does not exist yet. Running build first to generate static export...${RESET}"
  npm run build
fi

if [ -d "out" ]; then
  echo -e "${GREEN}✓ 'out/' directory found.${RESET}"
  echo "--- Contents of out/ (root level) ---"
  ls -lah out | grep -v "^total"
  echo "------------------------------------"

  # Specifically check out/sw.js
  if [ -f "out/sw.js" ]; then
    SW_SIZE=$(wc -c < "out/sw.js")
    echo -e "${GREEN}✓ out/sw.js is present (Size: ${SW_SIZE} bytes)${RESET}"
    
    # Check if out/sw.js starts with HTML (bad) or JS (good)
    FIRST_CHAR=$(head -c 1 "out/sw.js")
    if [ "$FIRST_CHAR" = "<" ]; then
      echo -e "${RED}✗ CRITICAL ERROR: out/sw.js starts with '<' - it appears to be HTML instead of JavaScript!${RESET}"
    else
      echo -e "${GREEN}✓ out/sw.js content validation passed (starts with JavaScript code).${RESET}"
    fi

    # Compare checksum with public/sw.js
    if [ -f "public/sw.js" ]; then
      PUB_MD5=$(md5sum public/sw.js | cut -d' ' -f1)
      OUT_MD5=$(md5sum out/sw.js | cut -d' ' -f1)
      if [ "$PUB_MD5" = "$OUT_MD5" ]; then
        echo -e "${GREEN}✓ out/sw.js matches public/sw.js exactly (MD5: ${PUB_MD5})${RESET}"
      else
        echo -e "${YELLOW}! out/sw.js differs from public/sw.js (Public: ${PUB_MD5}, Out: ${OUT_MD5})${RESET}"
      fi
    fi
  else
    echo -e "${RED}✗ ERROR: out/sw.js is missing from static export out directory!${RESET}"
  fi
else
  echo -e "${RED}✗ ERROR: 'out' directory not found even after build.${RESET}"
fi

echo ""

# -----------------------------------------------------------------------------
# STEP 2: Verify Content-Type header of 'sw.js' using curl
# -----------------------------------------------------------------------------
echo -e "${BOLD}[2/3] Verifying /sw.js HTTP Headers and Content via curl:${RESET}"

# Determine target server URL (default localhost:3000)
SERVER_URL="http://localhost:3000"

# Fetch headers and capture output
HTTP_RESPONSE=$(curl -s -i "${SERVER_URL}/sw.js" 2>&1 || true)

if [ -z "$HTTP_RESPONSE" ] || echo "$HTTP_RESPONSE" | grep -q "Failed to connect"; then
  echo -e "${RED}✗ Could not connect to dev server at ${SERVER_URL}.${RESET}"
  echo "Make sure the dev server is active on port 3000."
else
  HTTP_STATUS=$(echo "$HTTP_RESPONSE" | grep -m1 "^HTTP" | tr -d '\r')
  CONTENT_TYPE=$(echo "$HTTP_RESPONSE" | grep -i "^content-type:" | tr -d '\r')
  CACHE_CONTROL=$(echo "$HTTP_RESPONSE" | grep -i "^cache-control:" | tr -d '\r')

  echo -e "HTTP Status Line : ${BOLD}${HTTP_STATUS}${RESET}"
  echo -e "Content-Type     : ${BOLD}${CONTENT_TYPE:-Not provided}${RESET}"
  echo -e "Cache-Control    : ${BOLD}${CACHE_CONTROL:-Not provided}${RESET}"

  # Status Code Evaluation
  if echo "$HTTP_STATUS" | grep -q "200"; then
    echo -e "${GREEN}✓ HTTP Status 200 OK received for /sw.js.${RESET}"
  else
    echo -e "${YELLOW}! Unexpected HTTP status code for /sw.js: ${HTTP_STATUS}${RESET}"
  fi

  # Content-Type Evaluation
  if echo "$CONTENT_TYPE" | grep -qiE "javascript|ecmascript"; then
    echo -e "${GREEN}✓ Content-Type is valid JavaScript: ${CONTENT_TYPE}${RESET}"
  elif echo "$CONTENT_TYPE" | grep -qi "html"; then
    echo -e "${RED}✗ CRITICAL MISCONFIGURATION: Server returned text/html for /sw.js!${RESET}"
  else
    echo -e "${YELLOW}! Content-Type is: ${CONTENT_TYPE:-None}${RESET}"
  fi

  # First 5 lines of body inspection
  echo ""
  echo "--- First 5 lines of /sw.js response body ---"
  curl -s "${SERVER_URL}/sw.js" | head -n 5
  echo "---------------------------------------------"
fi

echo ""

# -----------------------------------------------------------------------------
# STEP 3: Check for potential MIME type conflicts in server configuration
# -----------------------------------------------------------------------------
echo -e "${BOLD}[3/3] Checking Server & System MIME Type Configurations:${RESET}"

# Check system /etc/mime.types if present
if [ -f "/etc/mime.types" ]; then
  echo -e "${CYAN}Checking /etc/mime.types for JavaScript mappings:${RESET}"
  grep -E "(\.js\b|\bjavascript\b)" /etc/mime.types | head -n 5 || echo "No direct match in /etc/mime.types"
else
  echo "System /etc/mime.types not present (containerized environment)."
fi

# Check nginx mime.types if present
if [ -f "/etc/nginx/mime.types" ]; then
  echo -e "${CYAN}Checking /etc/nginx/mime.types:${RESET}"
  grep -E "(\bjs\b|\bjavascript\b)" /etc/nginx/mime.types || echo "No js mapping found in /etc/nginx/mime.types"
fi

# Check public/_headers and out/_headers (Cloudflare Pages headers specification)
if [ -f "public/_headers" ]; then
  echo -e "${GREEN}✓ public/_headers exists. Inspecting rules for sw.js and .js files:${RESET}"
  grep -A 4 -B 1 "sw.js" public/_headers || echo "No specific /sw.js rule in public/_headers"
fi

# Test static asset MIME types for comparison
echo ""
echo -e "${CYAN}Testing related static asset MIME types on ${SERVER_URL}:${RESET}"
for ASSET in "/sw.js" "/manifest.json" "/candy-theme.css"; do
  TYPE_HEADER=$(curl -s -I "${SERVER_URL}${ASSET}" | grep -i "^content-type:" | tr -d '\r')
  CODE_HEADER=$(curl -s -I "${SERVER_URL}${ASSET}" | grep -m1 "^HTTP" | tr -d '\r')
  echo -e "  ${BOLD}${ASSET}${RESET} -> ${CODE_HEADER} | ${TYPE_HEADER:-No Content-Type}"
done

echo ""
echo -e "${BOLD}${GREEN}======================================================${RESET}"
echo -e "${BOLD}${GREEN}   DIAGNOSTIC COMPLETED SUCCESSFULLY                  ${RESET}"
echo -e "${BOLD}${GREEN}======================================================${RESET}"
