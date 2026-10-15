import sharp from 'sharp';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
    </pattern>
    <radialGradient id="glow1" cx="80%" cy="20%" r="50%">
      <stop offset="0%" stop-color="#25D366" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#25D366" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="15%" cy="85%" r="40%">
      <stop offset="0%" stop-color="#1A3C6E" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#1A3C6E" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="#0A1628"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <rect width="1200" height="630" fill="url(#glow1)"/>
  <rect width="1200" height="630" fill="url(#glow2)"/>

  <!-- Left accent line -->
  <rect x="80" y="140" width="5" height="340" rx="3" fill="#25D366" opacity="0.9"/>

  <!-- WFixerX badge -->
  <rect x="105" y="100" width="190" height="42" rx="21" fill="rgba(37,211,102,0.12)"/>
  <rect x="105" y="100" width="190" height="42" rx="21" fill="none" stroke="#25D366" stroke-width="1.5" opacity="0.5"/>
  <text x="200" y="128" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="bold" fill="#25D366" text-anchor="middle" letter-spacing="1">WFixerX</text>

  <!-- Main headline (Arabic — RTL right side) -->
  <text x="1120" y="265" font-family="Tahoma, Arial Unicode MS, Arial, sans-serif" font-size="76" font-weight="bold" fill="#FFFFFF" text-anchor="end" direction="rtl">فك حظر واتساب</text>

  <!-- Subtitle -->
  <text x="1120" y="340" font-family="Tahoma, Arial Unicode MS, Arial, sans-serif" font-size="32" fill="rgba(255,255,255,0.6)" text-anchor="end" direction="rtl">مساعدة متخصصة — بدون كلمة مرور</text>

  <!-- Country chips (right-aligned) -->
  <rect x="990" y="382" width="130" height="36" rx="18" fill="rgba(37,211,102,0.15)"/>
  <rect x="990" y="382" width="130" height="36" rx="18" fill="none" stroke="#25D366" stroke-width="1" opacity="0.4"/>
  <text x="1055" y="406" font-family="Tahoma, Arial, sans-serif" font-size="17" fill="#25D366" text-anchor="middle" direction="rtl">السعودية</text>

  <rect x="850" y="382" width="120" height="36" rx="18" fill="rgba(255,255,255,0.05)"/>
  <rect x="850" y="382" width="120" height="36" rx="18" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
  <text x="910" y="406" font-family="Tahoma, Arial, sans-serif" font-size="17" fill="rgba(255,255,255,0.6)" text-anchor="middle" direction="rtl">مصر</text>

  <rect x="720" y="382" width="110" height="36" rx="18" fill="rgba(255,255,255,0.05)"/>
  <rect x="720" y="382" width="110" height="36" rx="18" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
  <text x="775" y="406" font-family="Tahoma, Arial, sans-serif" font-size="17" fill="rgba(255,255,255,0.6)" text-anchor="middle" direction="rtl">الخليج</text>

  <!-- Stats -->
  <text x="1120" y="480" font-family="Tahoma, Arial, sans-serif" font-size="18" fill="rgba(255,255,255,0.35)" text-anchor="end" direction="rtl">500+ حالة ناجحة · رد خلال ساعات · بدون بيانات سرية</text>

  <!-- Green circle with check (left side) -->
  <circle cx="220" cy="480" r="90" fill="rgba(37,211,102,0.06)"/>
  <circle cx="220" cy="480" r="60" fill="rgba(37,211,102,0.12)"/>
  <circle cx="220" cy="480" r="42" fill="#25D366" opacity="0.9"/>
  <path d="M 195 480 L 213 498 L 250 460" stroke="white" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>

  <!-- Bottom bar -->
  <rect x="0" y="595" width="1200" height="35" fill="rgba(0,0,0,0.35)"/>
  <text x="600" y="618" font-family="Arial, sans-serif" font-size="15" fill="rgba(255,255,255,0.35)" text-anchor="middle">wfixerx.com — خدمة مستقلة غير تابعة لواتساب أو Meta</text>
</svg>`;

const outPath = join(__dirname, '../public/og-default.jpg');

await sharp(Buffer.from(svg))
  .jpeg({ quality: 92, mozjpeg: true })
  .toFile(outPath);

console.log('✅ og-default.jpg created at public/og-default.jpg');
