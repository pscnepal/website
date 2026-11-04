import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import sharp from 'sharp';

const PUBLIC_DIR = path.resolve('public');

// Master High-Resolution Vector SVG for PSC Nepal (512x512 viewBox)
const MASTER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <!-- Outer Nepal Constitutional Royal Blue Border Tile -->
  <rect width="512" height="512" rx="112" fill="#003893" />
  
  <!-- Inner Nepal Flag Crimson Tile with Subtle Inset Rim -->
  <rect x="36" y="36" width="440" height="440" rx="84" fill="#DC143C" stroke="#FFFFFF" stroke-opacity="0.32" stroke-width="10" />
  
  <!-- Left Page of Study Tome (Pristine White) -->
  <path
    d="M128 160C128 148.954 136.954 140 148 140H228C243.464 140 256 152.536 256 168V364C244.8 354.4 229.6 348 212 348H148C136.954 348 128 339.046 128 328V160Z"
    fill="#FFFFFF"
  />
  
  <!-- Right Page of Study Tome (Slight Blue-White Paper Tint) -->
  <path
    d="M384 160C384 148.954 375.046 140 364 140H284C268.536 140 256 152.536 256 168V364C267.2 354.4 282.4 348 300 348H364C375.046 348 384 339.046 384 328V160Z"
    fill="#EEF4FF"
  />
  
  <!-- Spine Shadow & Binding Split -->
  <path d="M256 168V364" stroke="#D0DCF2" stroke-width="4" stroke-linecap="round" />

  <!-- Left Page Syllabus / Content Lines (Blue) -->
  <path d="M160 196H224" stroke="#003893" stroke-width="16" stroke-linecap="round" />
  <path d="M160 236H224" stroke="#003893" stroke-width="16" stroke-linecap="round" />
  <path d="M160 276H208" stroke="#003893" stroke-width="16" stroke-linecap="round" />

  <!-- Right Page Knowledge / Constitution Lines (Crimson) -->
  <path d="M288 196H352" stroke="#C01033" stroke-width="16" stroke-linecap="round" />
  <path d="M288 236H352" stroke="#C01033" stroke-width="16" stroke-linecap="round" />
  <path d="M288 276H336" stroke="#C01033" stroke-width="16" stroke-linecap="round" />

  <!-- Base Foundation Pedestal Bar -->
  <path d="M176 396H336" stroke="#FFFFFF" stroke-width="20" stroke-linecap="round" />
</svg>`;

async function generateAllIcons() {
  console.log('Generating PSC Nepal icons in public directory...');
  const svgBuffer = Buffer.from(MASTER_SVG);

  // 1. Write master SVG to public/icon.svg
  fs.writeFileSync(path.join(PUBLIC_DIR, 'icon.svg'), MASTER_SVG, 'utf-8');
  console.log('✓ Created public/icon.svg');

  // List of required icon sizes and filenames
  const iconTargets = [
    { name: 'icon.png', size: 512 },
    { name: 'icon-512.png', size: 512 },
    { name: 'icon-512x512.png', size: 512 },
    { name: 'icon-384.png', size: 384 },
    { name: 'icon-256.png', size: 256 },
    { name: 'icon-192.png', size: 192 },
    { name: 'icon-192x192.png', size: 192 },
    { name: 'icon-128.png', size: 128 },
    { name: 'icon-128x128.png', size: 128 },
    { name: 'icon-96.png', size: 96 },
    { name: 'icon-72.png', size: 72 },
    { name: 'icon-48.png', size: 48 },
    { name: 'icon-32.png', size: 32 },
    { name: 'icon-16.png', size: 16 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'apple-touch-icon-180x180.png', size: 180 },
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'favicon-48x48.png', size: 48 },
  ];

  for (const target of iconTargets) {
    const dest = path.join(PUBLIC_DIR, target.name);
    await sharp(svgBuffer, { density: 300 })
      .resize(target.size, target.size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ compressionLevel: 9 })
      .toFile(dest);
    console.log(`✓ Created public/${target.name} (${target.size}x${target.size})`);
  }

  // Generate multi-size favicon.ico combining 16x16, 32x32, 48x48
  const icoTmp16 = path.join('/tmp', 'psc-ico-16.png');
  const icoTmp32 = path.join('/tmp', 'psc-ico-32.png');
  const icoTmp48 = path.join('/tmp', 'psc-ico-48.png');
  const icoDest = path.join(PUBLIC_DIR, 'favicon.ico');

  await sharp(svgBuffer).resize(16, 16).png().toFile(icoTmp16);
  await sharp(svgBuffer).resize(32, 32).png().toFile(icoTmp32);
  await sharp(svgBuffer).resize(48, 48).png().toFile(icoTmp48);

  execSync(`convert "${icoTmp16}" "${icoTmp32}" "${icoTmp48}" "${icoDest}"`);
  console.log('✓ Created public/favicon.ico (Multi-resolution Windows ICO)');

  // Clean up tmp files
  try {
    fs.unlinkSync(icoTmp16);
    fs.unlinkSync(icoTmp32);
    fs.unlinkSync(icoTmp48);
  } catch {
    // Ignore cleanup
  }

  // Generate PWA manifest.json & site.webmanifest
  const manifest = {
    name: 'PSC Nepal — Lok Sewa Preparation Hub',
    short_name: 'PSC Nepal',
    description:
      'Prepare for Nepal Lok Sewa Aayog exams with official syllabi, OMR & written simulations, timed MCQs, bilingual answers, and PDF flipbooks.',
    start_url: '/',
    display: 'standalone',
    background_color: '#060f22',
    theme_color: '#003893',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: '/icon-128.png',
        sizes: '128x128',
        type: 'image/png',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };

  fs.writeFileSync(
    path.join(PUBLIC_DIR, 'manifest.json'),
    JSON.stringify(manifest, null, 2),
    'utf-8'
  );
  fs.writeFileSync(
    path.join(PUBLIC_DIR, 'site.webmanifest'),
    JSON.stringify(manifest, null, 2),
    'utf-8'
  );
  console.log('✓ Created public/manifest.json and public/site.webmanifest');
  console.log('All icons generated successfully!');
}

generateAllIcons().catch((err) => {
  console.error('Failed to generate icons:', err);
  process.exit(1);
});
