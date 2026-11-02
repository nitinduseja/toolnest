/**
 * Generates official business document stamps (APPROVED, CONFIDENTIAL, PAID, DRAFT).
 */

export type StampType = 'APPROVED' | 'CONFIDENTIAL' | 'PAID' | 'DRAFT';

const STAMP_CONFIG: Record<StampType, { color: string; label: string }> = {
  APPROVED: { color: '#059669', label: 'APPROVED' },
  CONFIDENTIAL: { color: '#dc2626', label: 'CONFIDENTIAL' },
  PAID: { color: '#2563eb', label: 'PAID' },
  DRAFT: { color: '#d97706', label: 'DRAFT' },
};

function drawStampBorders(
  ctx: CanvasRenderingContext2D,
  color: string,
  box: { x: number; y: number; w: number; h: number }
): void {
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.strokeRect(box.x, box.y, box.w, box.h);

  ctx.lineWidth = 1.5;
  ctx.strokeRect(box.x + 4, box.y + 4, box.w - 8, box.h - 8);
}

function drawStampLabels(
  ctx: CanvasRenderingContext2D,
  color: string,
  text: { title: string; date: string; midX: number; midY: number }
): void {
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.font = 'bold 28px sans-serif';
  ctx.fillText(text.title, text.midX, text.midY - 10);

  ctx.font = 'bold 12px monospace';
  ctx.fillText(text.date, text.midX, text.midY + 18);
}

export function generateOfficialStamp(canvas: HTMLCanvasElement, type: StampType): void {
  canvas.width = 300;
  canvas.height = 120;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const cfg = STAMP_CONFIG[type];
  const dateStr = new Date().toISOString().slice(0, 10);

  // Slight tilt for authentic stamp appearance
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((-5 * Math.PI) / 180);
  ctx.translate(-canvas.width / 2, -canvas.height / 2);

  const box = { x: 12, y: 12, w: canvas.width - 24, h: canvas.height - 24 };
  drawStampBorders(ctx, cfg.color, box);
  drawStampLabels(ctx, cfg.color, {
    title: cfg.label,
    date: dateStr,
    midX: canvas.width / 2,
    midY: canvas.height / 2,
  });

  ctx.restore();
}
