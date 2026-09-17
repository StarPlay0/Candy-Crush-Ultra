import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function generateAssets() {
  const publicDir = path.resolve(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // 1. icon-512.png (512x512)
  const iconSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0d0714"/>
          <stop offset="100%" stop-color="#2e1065"/>
        </linearGradient>
      </defs>
      <rect width="512" height="512" fill="url(#bg)"/>
      <circle cx="256" cy="256" r="179" fill="none" stroke="#a855f7" stroke-width="8.5"/>
      <text x="256" y="270" fill="#ffffff" font-size="42" font-family="sans-serif" font-weight="bold" text-anchor="middle">Candy Ultra</text>
    </svg>
  `;

  // 2. screenshot-mobile.png (1080x1920)
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

  // 3. screenshot-desktop.png (1920x1080)
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

  const iconBuffer = await sharp(Buffer.from(iconSvg)).png().toBuffer();
  const mobileBuffer = await sharp(Buffer.from(mobileSvg)).png().toBuffer();
  const desktopBuffer = await sharp(Buffer.from(desktopSvg)).png().toBuffer();

  // Write to public folder
  fs.writeFileSync(path.join(publicDir, 'icon-512.png'), iconBuffer);
  fs.writeFileSync(path.join(publicDir, 'screenshot-mobile.png'), mobileBuffer);
  fs.writeFileSync(path.join(publicDir, 'screenshot-desktop.png'), desktopBuffer);

  // Write to root folder
  fs.writeFileSync(path.resolve(process.cwd(), 'icon-512.png'), iconBuffer);
  fs.writeFileSync(path.resolve(process.cwd(), 'screenshot-mobile.png'), mobileBuffer);
  fs.writeFileSync(path.resolve(process.cwd(), 'screenshot-desktop.png'), desktopBuffer);

  console.log('PNG assets generated successfully!');
}

generateAssets().catch(console.error);
