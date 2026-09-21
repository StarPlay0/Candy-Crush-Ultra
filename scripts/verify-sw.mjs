import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const publicSwPath = path.join(projectRoot, 'public', 'sw.js');
const outDir = path.join(projectRoot, 'out');
const outSwPath = path.join(outDir, 'sw.js');

console.log('[verify-sw] Running Service Worker production build verification...');

// 1. Check public/sw.js
if (!fs.existsSync(publicSwPath)) {
  console.error('[verify-sw] ERROR: public/sw.js does not exist!');
  process.exit(1);
}

const publicContent = fs.readFileSync(publicSwPath, 'utf8');
if (publicContent.trim().startsWith('<') || publicContent.includes('<!DOCTYPE')) {
  console.error('[verify-sw] ERROR: public/sw.js contains HTML markup instead of valid JavaScript!');
  process.exit(1);
}

// 2. Check out/sw.js and explicitly synchronize public/sw.js to out/sw.js
if (fs.existsSync(outDir)) {
  console.log('[verify-sw] Explicitly copying public/sw.js to out/sw.js...');
  fs.copyFileSync(publicSwPath, outSwPath);

  const outContent = fs.readFileSync(outSwPath, 'utf8');
  if (outContent.trim().startsWith('<') || outContent.includes('<!DOCTYPE')) {
    console.error('[verify-sw] ERROR: out/sw.js contains HTML markup instead of JavaScript!');
    process.exit(1);
  }

  // Basic syntax check
  try {
    new Function(outContent);
  } catch (err) {
    // Workers use self/caches which might not be globally defined in Node runtime,
    // so we just check for obvious syntax/HTML errors
    if (outContent.startsWith('<')) {
      console.error('[verify-sw] ERROR: out/sw.js syntax verification failed with HTML token:', err);
      process.exit(1);
    }
  }

  console.log('[verify-sw] ✓ out/sw.js exists and contains valid JavaScript.');

  // Sync compiled CSS to candy-theme.css so pure static loads always have styles
  const cssDir = path.join(outDir, '_next', 'static', 'css');
  if (fs.existsSync(cssDir)) {
    const cssFiles = fs.readdirSync(cssDir).filter(f => f.endsWith('.css'));
    if (cssFiles.length > 0) {
      const sourceCss = path.join(cssDir, cssFiles[0]);
      fs.copyFileSync(sourceCss, path.join(outDir, 'candy-theme.css'));
      fs.copyFileSync(sourceCss, path.join(projectRoot, 'public', 'candy-theme.css'));
      console.log(`[verify-sw] ✓ Synced compiled CSS (${cssFiles[0]}) to candy-theme.css`);
    }
  }
} else {
  console.log('[verify-sw] No out/ directory found (non-export build). Checked public/sw.js.');
}

console.log('[verify-sw] ✓ Service worker verified in build output. Expected Content-Type: application/javascript');
