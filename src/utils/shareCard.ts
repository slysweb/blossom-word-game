import QRCode from "qrcode";
import type { DailyChallengeState } from "@/utils/dailyChallenge";
import { PETAL_PALETTE } from "@/utils/dailyChallenge";

export interface ShareCardInput {
  puzzleNo: number;
  dateString: string;
  middleLetter: string;
  outerLetters: string[];
  challenge: DailyChallengeState;
  shareLines: string[];
  shareUrl: string;
}

const CARD_W = 720;
const CARD_H = 500;
const MARGIN = 14;

const FONT_DISPLAY = "Fredoka, Nunito, Arial, sans-serif";
const FONT_BODY = "Nunito, Arial, sans-serif";

const HIVE_POSITIONS = [
  { dx: 0, dy: 0, center: true },
  { dx: -0.75, dy: -0.5 },
  { dx: 0, dy: -1 },
  { dx: 0.75, dy: -0.5 },
  { dx: 0.75, dy: 0.5 },
  { dx: 0, dy: 1 },
  { dx: -0.75, dy: 0.5 },
];

async function loadFonts(): Promise<void> {
  if (typeof document === "undefined" || !document.fonts) return;
  await Promise.all([
    document.fonts.load("600 32px Fredoka"),
    document.fonts.load("700 16px Nunito"),
    document.fonts.load("700 14px Nunito"),
    document.fonts.load("600 14px Nunito"),
    document.fonts.load("600 13px Nunito"),
    document.fonts.load("600 12px Nunito"),
  ]).catch(() => undefined);
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawHex(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
  letter: string,
  fill: string,
): void {
  const pts = [
    [0, 52],
    [30, 0],
    [90, 0],
    [120, 52],
    [90, 104],
    [30, 104],
  ].map(([px, py]) => [x + px * scale, y + py * scale]);

  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.12)";
  ctx.shadowBlur = 4 * scale;
  ctx.shadowOffsetY = 2 * scale;

  ctx.beginPath();
  ctx.moveTo(pts[0]![0]!, pts[0]![1]!);
  for (let i = 1; i < pts.length; i++) {
    ctx.lineTo(pts[i]![0]!, pts[i]![1]!);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 7.5 * scale;
  ctx.stroke();
  ctx.shadowColor = "transparent";

  ctx.fillStyle = "#1a1a22";
  ctx.font = `600 ${32 * scale}px ${FONT_DISPLAY}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(letter.toUpperCase(), x + 60 * scale, y + 54 * scale);
  ctx.restore();
}

function drawFlower(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  petalCount: number,
  lit: boolean,
  isPangram: boolean,
  petalColors: string[],
): void {
  const scale = size / 32;
  const rx = (petalCount >= 7 ? 4 : 5) * scale;
  const ry = (petalCount >= 7 ? 6 : 7) * scale;
  const step = (Math.PI * 2) / petalCount;

  ctx.save();
  ctx.translate(cx, cy);

  if (lit) {
    ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
    ctx.shadowBlur = 2;
    ctx.shadowOffsetY = 1;
  }

  for (let i = 0; i < petalCount; i++) {
    ctx.save();
    ctx.rotate(step * i);
    ctx.beginPath();
    ctx.ellipse(0, -8 * scale, rx, ry, 0, 0, Math.PI * 2);
    ctx.fillStyle = lit ? petalColors[i]! : "#d8d8de";
    ctx.globalAlpha = lit ? 1 : 0.42;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  ctx.shadowColor = "transparent";

  const r = 3.5 * scale;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  if (lit) {
    ctx.fillStyle = isPangram ? "#fff3a8" : "#fff8e7";
    ctx.fill();
    ctx.strokeStyle = isPangram ? "#b8860b" : "#6d4c2a";
    ctx.lineWidth = 1.2 * scale;
    ctx.stroke();
  } else {
    ctx.fillStyle = "#ccc";
    ctx.globalAlpha = 0.55;
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  ctx.restore();
}

function drawHive(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  scale: number,
  middleLetter: string,
  outerLetters: string[],
): void {
  const hexW = 120 * scale;
  const hexH = 104 * scale;
  const bx = centerX - hexW / 2;
  const by = centerY - hexH / 2;
  const letters = [middleLetter, ...outerLetters.slice(0, 6)];

  HIVE_POSITIONS.forEach((pos, index) => {
    const letter = letters[index] ?? "";
    const fill = pos.center ? "#fce303" : "#e6e6e6";
    drawHex(ctx, bx + pos.dx * hexW, by + pos.dy * hexH, scale, letter, fill);
  });
}

/** Approximate hive height for a given scale (3 hex rows). */
function hiveHeight(scale: number): number {
  return 104 * scale * 3;
}

function challengeLayout(
  topY: number,
  bottomY: number,
  challenge: DailyChallengeState,
): { flowerSize: number; gap: number; rowGap: number; maxRowWidth: number; totalH: number } {
  const rows = Math.max(challenge.groups.length, 1);
  const areaH = bottomY - topY;
  const rowGap = 8;
  const flowerSize = Math.min(
    42,
    Math.max(34, (areaH - (rows - 1) * rowGap) / rows),
  );
  const gap = 7;
  const totalH = rows * flowerSize + (rows - 1) * rowGap;
  let maxRowWidth = 0;
  for (const group of challenge.groups) {
    const rowWidth =
      group.slots.length * flowerSize +
      Math.max(0, group.slots.length - 1) * gap;
    maxRowWidth = Math.max(maxRowWidth, rowWidth);
  }
  return { flowerSize, gap, rowGap, maxRowWidth, totalH };
}

function drawChallenge(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  topY: number,
  bottomY: number,
  challenge: DailyChallengeState,
): void {
  const { flowerSize, gap, rowGap, totalH } = challengeLayout(
    topY,
    bottomY,
    challenge,
  );
  const areaH = bottomY - topY;
  let rowY = topY + (areaH - totalH) / 2 + flowerSize / 2;

  for (const group of challenge.groups) {
    const rowWidth =
      group.slots.length * flowerSize +
      Math.max(0, group.slots.length - 1) * gap;
    let fx = centerX - rowWidth / 2 + flowerSize / 2;

    for (const slot of group.slots) {
      drawFlower(
        ctx,
        fx,
        rowY,
        flowerSize,
        group.petalCount,
        slot.lit,
        group.category === "pangram",
        group.petalColors.length
          ? group.petalColors
          : PETAL_PALETTE.slice(0, group.petalCount),
      );
      fx += flowerSize + gap;
    }

    rowY += flowerSize + rowGap;
  }
}

/** Date / puzzle number — plain text, no pill background. */
function drawMetaLabel(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  y: number,
): number {
  const h = 34;
  ctx.font = `700 16px ${FONT_BODY}`;
  ctx.fillStyle = "#4a4a56";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, centerX, y + h / 2);
  return y + h;
}

function drawShareLines(
  ctx: CanvasRenderingContext2D,
  lines: string[],
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
): void {
  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  let textY = y;
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index]!;
    const isUrl = line.startsWith("http");
    const isTitle = index === 0;
    // Stats + URL sit slightly inset from the title/rank lines.
    const lineX = index >= 2 ? x + 5 : x;

    if (isTitle) {
      ctx.font = `700 14px ${FONT_BODY}`;
      ctx.fillStyle = "#1a1a22";
    } else if (isUrl) {
      ctx.font = `600 12px ${FONT_BODY}`;
      ctx.fillStyle = "#404048";
    } else {
      ctx.font = `600 13px ${FONT_BODY}`;
      ctx.fillStyle = "#1a1a22";
    }

    ctx.fillText(line, lineX, textY, maxWidth);
    textY += lineHeight;
  }
}

async function drawFooterContent(
  ctx: CanvasRenderingContext2D,
  lines: string[],
  url: string,
  cardX: number,
  cardW: number,
  footerY: number,
  footerH: number,
): Promise<void> {
  const lineCount = Math.max(lines.length, 1);
  const qrPad = 8;
  const qrBox = Math.min(96, Math.max(76, footerH - 28));
  const lineHeight = qrBox / lineCount;
  const qrSize = qrBox - qrPad * 2;
  const gap = 20;

  // Measure text block width so the text+QR group can be centered.
  let textW = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    const isUrl = line.startsWith("http");
    const isTitle = i === 0;
    ctx.font = isTitle
      ? `700 14px ${FONT_BODY}`
      : isUrl
        ? `600 12px ${FONT_BODY}`
        : `600 13px ${FONT_BODY}`;
    textW = Math.max(textW, ctx.measureText(line).width);
  }

  const groupW = textW + gap + qrBox;
  const groupLeft = cardX + (cardW - groupW) / 2;
  // Sit lower in the footer band (closer to the bottom edge).
  const blockTop = footerY + footerH - qrBox - 18;

  drawShareLines(ctx, lines, groupLeft, blockTop + 9, textW + 4, lineHeight);

  const qrX = groupLeft + textW + gap;
  const qrY = blockTop;

  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
  ctx.shadowBlur = 5;
  ctx.shadowOffsetY = 2;
  roundRect(ctx, qrX, qrY, qrBox, qrBox, 10);
  ctx.fill();
  ctx.shadowColor = "transparent";

  const qrCanvas = document.createElement("canvas");
  await QRCode.toCanvas(qrCanvas, url, {
    width: qrSize,
    margin: 0,
    color: { dark: "#1a1a22", light: "#ffffff" },
  });
  ctx.drawImage(qrCanvas, qrX + qrPad, qrY + qrPad, qrSize, qrSize);
}

export async function renderShareCard(input: ShareCardInput): Promise<Blob> {
  await loadFonts();

  const canvas = document.createElement("canvas");
  canvas.width = CARD_W;
  canvas.height = CARD_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  const cardX = MARGIN;
  const cardY = MARGIN;
  const cardW = CARD_W - MARGIN * 2;
  const cardH = CARD_H - MARGIN * 2;
  const radius = 22;
  const footerH = 132;

  // Full-card vertical gradient: light on top → soft yellow at bottom.
  ctx.save();
  roundRect(ctx, cardX, cardY, cardW, cardH, radius);
  ctx.clip();
  const bg = ctx.createLinearGradient(cardX, cardY, cardX, cardY + cardH);
  bg.addColorStop(0, "#ffffff");
  bg.addColorStop(0.4, "#fffcef");
  bg.addColorStop(0.75, "#fff6c8");
  bg.addColorStop(1, "#ffe566");
  ctx.fillStyle = bg;
  ctx.fillRect(cardX, cardY, cardW, cardH);
  ctx.restore();

  ctx.strokeStyle = "rgba(0, 0, 0, 0.08)";
  ctx.lineWidth = 1;
  roundRect(ctx, cardX, cardY, cardW, cardH, radius);
  ctx.stroke();

  const labelBottom = drawMetaLabel(
    ctx,
    `#${input.puzzleNo} · ${input.dateString}`,
    cardX + cardW / 2,
    cardY + 18,
  );

  const footerY = cardY + cardH - footerH;
  // Keep hive fully above the footer so text never overlaps.
  const mainTop = labelBottom + 22;
  const mainBottom = footerY - 16;
  const midY = (mainTop + mainBottom) / 2;

  const hiveScale = 0.92;
  const maxHiveH = mainBottom - mainTop;
  const scale =
    hiveHeight(hiveScale) > maxHiveH
      ? maxHiveH / (104 * 3)
      : hiveScale;

  const hiveCenterX = cardX + cardW * 0.28;
  const flowerCenterX = cardX + cardW * 0.72;

  ctx.strokeStyle = "rgba(0, 0, 0, 0.06)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cardX + cardW / 2, mainTop + 4);
  ctx.lineTo(cardX + cardW / 2, mainBottom - 4);
  ctx.stroke();

  drawHive(
    ctx,
    hiveCenterX,
    midY,
    scale,
    input.middleLetter,
    input.outerLetters,
  );
  drawChallenge(
    ctx,
    flowerCenterX,
    mainTop,
    mainBottom,
    input.challenge,
  );

  await drawFooterContent(
    ctx,
    input.shareLines,
    input.shareUrl,
    cardX,
    cardW,
    footerY,
    footerH,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("Failed to export PNG")),
      "image/png",
    );
  });
}

export { CARD_W, CARD_H };
