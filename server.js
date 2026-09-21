// Custom Production Static Server for Next.js Static Export
// Serves the 'out' directory with strict MIME type enforcement for all .js files,
// completely eliminating the fatal "Unexpected token '<'" error caused by HTML fallbacks.

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const handler = require('serve-handler');

const PORT = parseInt(process.env.PORT || '3000', 10);
const OUT_DIR = path.resolve(__dirname, 'out');

// MIME type definitions to guarantee correct headers
const MIME_TYPES = {
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

const server = http.createServer(async (req, res) => {
  const host = req.headers.host || `localhost:${PORT}`;
  const parsedUrl = new URL(req.url, `http://${host}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Normalize path
  if (pathname === '/') {
    pathname = '/index.html';
  }

  const ext = path.extname(pathname).toLowerCase();
  const isJavaScript = ext === '.js' || ext === '.mjs';

  // --------------------------------------------------------------------------
  // STRICT JAVASCRIPT & SERVICE WORKER PROTECTION
  // Prevents HTML fallback when a .js asset or chunk is requested.
  // Standard SPA rewrites return index.html (<!DOCTYPE html>) for missing .js
  // files, causing the browser to throw "Uncaught SyntaxError: Unexpected token '<'".
  // --------------------------------------------------------------------------
  if (isJavaScript) {
    const localFilePath = path.join(OUT_DIR, pathname);

    // Guard against directory traversal attacks
    if (!localFilePath.startsWith(OUT_DIR)) {
      res.statusCode = 403;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end('Forbidden');
      return;
    }

    // Force strict JavaScript headers
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    res.setHeader('X-Content-Type-Options', 'nosniff');

    // Specific rules for Service Worker (/sw.js)
    if (pathname === '/sw.js') {
      res.setHeader('Service-Worker-Allowed', '/');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }

    if (fs.existsSync(localFilePath) && fs.statSync(localFilePath).isFile()) {
      res.statusCode = 200;
      fs.createReadStream(localFilePath).pipe(res);
      return;
    }

    // CRITICAL: If a JS chunk is missing or stale, return a valid JS 404 response
    // NEVER fall back to index.html with HTML tags!
    res.statusCode = 404;
    res.end(
      `/* 404: JavaScript asset "${pathname}" not found */\n` +
      `console.warn("[Static Server 404] Missing JS asset: ${pathname}");\n`
    );
    return;
  }

  // --------------------------------------------------------------------------
  // General Static File Handling with 'serve-handler'
  // --------------------------------------------------------------------------
  try {
    return await handler(req, res, {
      public: OUT_DIR,
      cleanUrls: true,
      directoryListing: false,
      trailingSlash: false,
      headers: [
        {
          source: '**/*.@(js|mjs)',
          headers: [
            { key: 'Content-Type', value: 'application/javascript; charset=utf-8' },
            { key: 'X-Content-Type-Options', value: 'nosniff' },
          ],
        },
        {
          source: 'sw.js',
          headers: [
            { key: 'Content-Type', value: 'application/javascript; charset=utf-8' },
            { key: 'Service-Worker-Allowed', value: '/' },
            { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
            { key: 'X-Content-Type-Options', value: 'nosniff' },
          ],
        },
        {
          source: '**/*.css',
          headers: [
            { key: 'Content-Type', value: 'text/css; charset=utf-8' },
          ],
        },
        {
          source: '**/*.@(json|webmanifest)',
          headers: [
            { key: 'Content-Type', value: 'application/json; charset=utf-8' },
          ],
        },
        {
          source: '**/*.html',
          headers: [
            { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
          ],
        },
      ],
      // For general non-JS routes, rewrite to index.html for SPA navigation
      rewrites: [
        { source: '!(**/*.@(js|mjs|css|png|jpg|jpeg|gif|svg|ico|json|webmanifest|txt|xml))', destination: '/index.html' },
      ],
    });
  } catch (err) {
    console.error('[server.js] Error handling request:', err);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end('Internal Server Error');
    }
  }
});

// Ensure 'out' directory exists before starting
if (!fs.existsSync(OUT_DIR)) {
  console.warn(`[server.js] Warning: 'out' directory not found at ${OUT_DIR}. Run 'npm run build' to generate static export.`);
}

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[server.js] Static production server listening on http://0.0.0.0:${PORT}`);
  console.log(`[server.js] Serving static export from: ${OUT_DIR}`);
  console.log(`[server.js] Strict 'application/javascript' headers forced for all .js and .mjs files.`);
});

// Handle graceful termination
process.on('SIGTERM', () => {
  console.log('[server.js] SIGTERM received. Closing HTTP server...');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('[server.js] SIGINT received. Closing HTTP server...');
  server.close(() => process.exit(0));
});

module.exports = server;
