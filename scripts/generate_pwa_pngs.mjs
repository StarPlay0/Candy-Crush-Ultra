import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function generateAssets() {
  const publicDir = path.resolve(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // 1. icon-192.png (192x192)
  const icon192Svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192" width="192" height="192">
      <defs>
        <linearGradient id="bg192" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0d0714"/>
          <stop offset="100%" stop-color="#2e1065"/>
        </linearGradient>
      </defs>
      <rect width="192" height="192" fill="url(#bg192)"/>
      <circle cx="96" cy="96" r="67" fill="none" stroke="#a855f7" stroke-width="4"/>
      <circle cx="96" cy="96" r="48" fill="#a855f7" fill-opacity="0.2"/>
      <text x="96" y="103" fill="#ffffff" font-size="18" font-family="sans-serif" font-weight="bold" text-anchor="middle">Candy Ultra</text>
    </svg>
  `;

  // 2. icon-512.png (512x512)
  const icon512Svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
      <defs>
        <linearGradient id="bg512" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0d0714"/>
          <stop offset="100%" stop-color="#2e1065"/>
        </linearGradient>
      </defs>
      <rect width="512" height="512" fill="url(#bg512)"/>
      <circle cx="256" cy="256" r="179" fill="none" stroke="#a855f7" stroke-width="9"/>
      <circle cx="256" cy="256" r="130" fill="#a855f7" fill-opacity="0.2"/>
      <text x="256" y="270" fill="#ffffff" font-size="44" font-family="sans-serif" font-weight="bold" text-anchor="middle">Candy Ultra</text>
    </svg>
  `;

  // 3. screenshot-mobile.png (1080x1920)
  const mobileSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
      <defs>
        <linearGradient id="mbg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0d0714"/>
          <stop offset="100%" stop-color="#2e1065"/>
        </linearGradient>
      </defs>
      <rect width="1080" height="1920" fill="url(#mbg)"/>
      <circle cx="540" cy="960" r="378" fill="none" stroke="#a855f7" stroke-width="18"/>
      <text x="540" y="980" fill="#ffffff" font-size="75" font-family="sans-serif" font-weight="bold" text-anchor="middle">Candy Ultra Mobile View</text>
    </svg>
  `;

  // 4. screenshot-desktop.png (1920x1080)
  const desktopSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
      <defs>
        <linearGradient id="dbg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0d0714"/>
          <stop offset="100%" stop-color="#2e1065"/>
        </linearGradient>
      </defs>
      <rect width="1920" height="1080" fill="url(#dbg)"/>
      <circle cx="960" cy="540" r="378" fill="none" stroke="#a855f7" stroke-width="32"/>
      <text x="960" y="560" fill="#ffffff" font-size="120" font-family="sans-serif" font-weight="bold" text-anchor="middle">Candy Ultra Desktop View</text>
    </svg>
  `;

  const icon192Buf = await sharp(Buffer.from(icon192Svg)).resize(192, 192).png().toBuffer();
  const icon512Buf = await sharp(Buffer.from(icon512Svg)).resize(512, 512).png().toBuffer();
  const mobileBuf = await sharp(Buffer.from(mobileSvg)).resize(1080, 1920).png().toBuffer();
  const desktopBuf = await sharp(Buffer.from(desktopSvg)).resize(1920, 1080).png().toBuffer();

  // Write to public directory
  fs.writeFileSync(path.join(publicDir, 'icon-192.png'), icon192Buf);
  fs.writeFileSync(path.join(publicDir, 'icon-512.png'), icon512Buf);
  fs.writeFileSync(path.join(publicDir, 'screenshot-mobile.png'), mobileBuf);
  fs.writeFileSync(path.join(publicDir, 'screenshot-desktop.png'), desktopBuf);

  // Also write to root directory
  fs.writeFileSync(path.resolve(process.cwd(), 'icon-192.png'), icon192Buf);
  fs.writeFileSync(path.resolve(process.cwd(), 'icon-512.png'), icon512Buf);
  fs.writeFileSync(path.resolve(process.cwd(), 'screenshot-mobile.png'), mobileBuf);
  fs.writeFileSync(path.resolve(process.cwd(), 'screenshot-desktop.png'), desktopBuf);

  console.log('Successfully generated all 4 PNG assets (192x192, 512x512, 1080x1920, 1920x1080) in both root and public/!');
}

generateAssets().catch(console.error);
