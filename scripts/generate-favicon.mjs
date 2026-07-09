/**
 * Generate favicon assets: seven-petal bloom with yellow center (pangram flower).
 * Output: public/favicon.svg, favicon-32.png, apple-touch-icon.png
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "../public");

const PETAL_PALETTE = [
  "#FF6B6B",
  "#FF8E53",
  "#FFC107",
  "#6BCB77",
  "#4ECDC4",
  "#4D96FF",
  "#C77DFF",
];

const CENTER_FILL = "#fff3a8";
const CENTER_STROKE = "#b8860b";
const BG = "#fffef8";

function flowerSvg(size, { rounded = true } = {}) {
  const rx = 4;
  const ry = 6;
  const petals = PETAL_PALETTE.map((color, i) => {
    const angle = (360 / 7) * i;
    return `<ellipse cx="16" cy="8" rx="${rx}" ry="${ry}" fill="${color}" transform="rotate(${angle} 16 16)"/>`;
  }).join("\n    ");

  const bg = rounded
    ? `<rect width="${size}" height="${size}" rx="${size * 0.1875}" fill="${BG}"/>`
    : "";

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
  <defs>
    <filter id="shadow" x="-25%" y="-25%" width="150%" height="150%">
      <feDropShadow dx="0" dy="1" stdDeviation="1.2" flood-opacity="0.18"/>
    </filter>
  </defs>
  ${bg}
  <g transform="scale(${size / 32})" filter="url(#shadow)">
    ${petals}
    <circle cx="16" cy="16" r="3.5" fill="${CENTER_FILL}" stroke="${CENTER_STROKE}" stroke-width="1.2"/>
  </g>
</svg>`;
}

function writePng(svg, outPath, size) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: size },
    font: { loadSystemFonts: true },
  });
  writeFileSync(outPath, resvg.render().asPng());
}

const svg32 = flowerSvg(32);
writeFileSync(join(publicDir, "favicon.svg"), svg32, "utf8");

const svg180 = flowerSvg(180);
writePng(svg180, join(publicDir, "favicon-32.png"), 32);
writePng(svg180, join(publicDir, "apple-touch-icon.png"), 180);
writePng(svg180, join(publicDir, "icon-192.png"), 192);

console.log("Wrote public/favicon.svg");
console.log("Wrote public/favicon-32.png");
console.log("Wrote public/apple-touch-icon.png");
console.log("Wrote public/icon-192.png");
