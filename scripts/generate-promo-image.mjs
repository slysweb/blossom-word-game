/**
 * Generate 1200×630 promo image: hive (left) + fully bloomed daily challenge (right).
 * Output: public/images/blossom-promo-1200x630.png (+ .svg)
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "../public/images");
const ogPath = join(__dirname, "../public/og.png");
mkdirSync(outDir, { recursive: true });

const W = 1200;
const H = 630;

const PETAL_PALETTE = [
  "#FF6B6B",
  "#FF8E53",
  "#FFC107",
  "#6BCB77",
  "#4ECDC4",
  "#4D96FF",
  "#C77DFF",
];

const GROUPS = [
  { label: "4-LETTER", count: 5, petals: 4, center: ["#fff8e7", "#6d4c2a"] },
  { label: "5-LETTER", count: 4, petals: 5, center: ["#fff8e7", "#6d4c2a"] },
  { label: "6-LETTER", count: 3, petals: 6, center: ["#fff8e7", "#6d4c2a"] },
  { label: "7-LETTER", count: 2, petals: 7, center: ["#fff8e7", "#6d4c2a"] },
  { label: "PANGRAM", count: 1, petals: 7, center: ["#fff3a8", "#b8860b"] },
];

function flowerMarkup(petalCount, colors, centerFill, centerStroke) {
  const step = 360 / petalCount;
  const rx = petalCount >= 7 ? 4 : 5;
  const ry = petalCount >= 7 ? 6 : 7;
  const petals = colors
    .slice(0, petalCount)
    .map(
      (color, i) =>
        `<ellipse cx="16" cy="8" rx="${rx}" ry="${ry}" fill="${color}" transform="rotate(${step * i} 16 16)"/>`,
    )
    .join("");
  return `<g filter="url(#flowerShadow)">${petals}<circle cx="16" cy="16" r="3.5" fill="${centerFill}" stroke="${centerStroke}" stroke-width="1.2"/></g>`;
}

function flowerAt(x, y, size, petalCount, center) {
  const colors = PETAL_PALETTE.slice(0, petalCount);
  return `<g transform="translate(${x},${y}) scale(${size / 32})">${flowerMarkup(petalCount, colors, center[0], center[1])}</g>`;
}

function hexAt(x, y, scale, letter, fill, stroke = "#ffffff") {
  const pts = "0,52 30,0 90,0 120,52 90,104 30,104";
  return `<g transform="translate(${x},${y}) scale(${scale})" filter="url(#hexShadow)">
    <polygon points="${pts}" fill="${fill}" stroke="${stroke}" stroke-width="7.5"/>
    <text x="60" y="58" text-anchor="middle" font-family="Fredoka, Nunito, Arial, sans-serif" font-size="32" font-weight="600" fill="#1a1a22">${letter}</text>
  </g>`;
}

// Hive letters from reference screenshot
const hiveLetters = [
  { letter: "H", x: 248, y: 248, fill: "#fce303" },
  { letter: "E", x: 248, y: 118, fill: "#e6e6e6" },
  { letter: "I", x: 378, y: 183, fill: "#e6e6e6" },
  { letter: "K", x: 378, y: 313, fill: "#e6e6e6" },
  { letter: "S", x: 248, y: 378, fill: "#e6e6e6" },
  { letter: "T", x: 118, y: 313, fill: "#e6e6e6" },
  { letter: "A", x: 118, y: 183, fill: "#e6e6e6" },
];

const hexScale = 1.35;
const hexes = hiveLetters
  .map(({ letter, x, y, fill }) => hexAt(x, y, hexScale, letter, fill))
  .join("\n");

const flowerSize = 52;
const flowerGap = 8;
const panelX = 640;
const panelY = 72;
const panelW = 520;
const panelH = 486;

let y = panelY + 88;
const challengeRows = GROUPS.map((group) => {
  const rowWidth = group.count * flowerSize + (group.count - 1) * flowerGap;
  const startX = panelX + (panelW - rowWidth) / 2;
  const flowers = Array.from({ length: group.count }, (_, i) =>
    flowerAt(
      startX + i * (flowerSize + flowerGap),
      y + 28,
      flowerSize,
      group.petals,
      group.center,
    ),
  ).join("");
  const row = `
    <text x="${panelX + panelW / 2}" y="${y}" text-anchor="middle" font-family="Nunito, Arial, sans-serif" font-size="15" font-weight="700" letter-spacing="0.08em" fill="#6b6b76">${group.label}</text>
    ${flowers}
  `;
  y += 28 + flowerSize + 36;
  return row;
}).join("");

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <filter id="hexShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="3" stdDeviation="3" flood-opacity="0.12"/>
    </filter>
    <filter id="flowerShadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.14"/>
    </filter>
    <filter id="cardShadow" x="-5%" y="-5%" width="110%" height="115%">
      <feDropShadow dx="0" dy="12" stdDeviation="18" flood-opacity="0.1"/>
    </filter>
  </defs>

  <rect width="${W}" height="${H}" fill="#fffef8"/>

  <!-- Left card: hive -->
  <g filter="url(#cardShadow)">
    <rect x="48" y="48" width="544" height="534" rx="16" fill="#ffffff" stroke="rgba(20,20,30,0.08)"/>
  </g>
  ${hexes}

  <!-- Right card: Today's Challenge (all bloomed) -->
  <g filter="url(#cardShadow)">
    <rect x="${panelX}" y="${panelY}" width="${panelW}" height="${panelH}" rx="16" fill="#ffffff" stroke="rgba(20,20,30,0.08)"/>
  </g>
  <text x="${panelX + panelW / 2}" y="${panelY + 42}" text-anchor="middle" font-family="Fredoka, Nunito, Arial, sans-serif" font-size="28" font-weight="600" fill="#23232b">Today's Challenge</text>
  <text x="${panelX + panelW / 2}" y="${panelY + 68}" text-anchor="middle" font-family="Nunito, Arial, sans-serif" font-size="13" fill="#6b6b76">15 / 15 bloomed</text>
  ${challengeRows}
  <text x="${panelX + panelW / 2}" y="${panelY + panelH - 28}" text-anchor="middle" font-family="Nunito, Arial, sans-serif" font-size="16" font-weight="700" fill="#e0ca00">Challenge complete! 🌸</text>

  <!-- Brand -->
  <text x="${W / 2}" y="${H - 24}" text-anchor="middle" font-family="Fredoka, Nunito, Arial, sans-serif" font-size="22" font-weight="600" fill="#23232b">Blossom Word Game · blossomword.com</text>
</svg>`;

const svgPath = join(outDir, "blossom-promo-1200x630.svg");
const pngPath = join(outDir, "blossom-promo-1200x630.png");

writeFileSync(svgPath, svg, "utf8");

const resvg = new Resvg(svg, {
  fitTo: { mode: "width", value: W },
  font: { loadSystemFonts: true },
});
const pngData = resvg.render();
const pngBuffer = pngData.asPng();
writeFileSync(pngPath, pngBuffer);
writeFileSync(ogPath, pngBuffer);

console.log(`Wrote ${svgPath}`);
console.log(`Wrote ${pngPath}`);
console.log(`Wrote ${ogPath}`);
