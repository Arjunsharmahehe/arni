import React, { MouseEventHandler, useRef } from "react";
import {
  motion,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";

// ─── constants ────────────────────────────────────────────────────────────────
const BASE_W = 223; // SVG width of one card at scale 1
const BASE_DX = -20; // horizontal offset per card index  (scales with width)
const BASE_DY = 4; // vertical  offset per card index   (fixed)
const BASE_H = 32; // collapsed card height
const MAX_H = 100; // maximum additional height on hover
const VB_W = 420; // SVG viewBox width
const VB_H = 260; // SVG viewBox height

// ─── wave math ────────────────────────────────────────────────────────────────
/**
 * Asymmetric exponential falloff.
 * Leading edge (card ahead of cursor): rate 0.75 — rises gradually.
 * Trailing edge (card behind cursor):  rate 2.6  — snaps back quickly.
 */
function expWave(dist: number) {
  const d = Math.abs(dist) / 45;
  const rate = dist > 0 ? 0.75 : 2.6;
  return Math.exp(-d * rate);
}

// ─── path builders ────────────────────────────────────────────────────────────
// All x-offsets from the original Figma path are multiplied by `s` (= cardWidth / BASE_W)
// so the card shape scales proportionally. Y-offsets are tied to `h` and stay fixed.

function buildOutline(x: number, y: number, h: number, s: number) {
  return [
    `M ${x + 212.875 * s} ${y + h + 108}`,
    `C ${x + 210.875 * s} ${y + h + 107} ${x + 166.375 * s} ${y + h + 84.8} ${x + 4.375 * s} ${y + h + 4}`,
    `C ${x + 4.375 * s} ${y + h + 4} ${x + 1.375 * s} ${y + h + 2.245} ${x + 0.875 * s} ${y + h + 0.122}`,
    `C ${x + 0.375 * s} ${y + h - 2} ${x + 0.375 * s} ${y + 6.5} ${x + 0.875 * s} ${y + 4.5}`,
    `C ${x + 1.375 * s} ${y + 2.5} ${x + 3.875 * s} ${y + 0.5} ${x + 5.375 * s} ${y + 0.5}`,
    `H ${x + 7.875 * s}`,
    `C ${x + 8.375 * s} ${y + 0.5} ${x + 220.875 * s} ${y + 106} ${x + 220.875 * s} ${y + 108}`,
    `C ${x + 220.875 * s} ${y + 110} ${x + 222.375 * s} ${y + h + 103.5} ${x + 221.375 * s} ${y + h + 105}`,
    `C ${x + 220.375 * s} ${y + h + 106.5} ${x + 220.075 * s} ${y + h + 106.95} ${x + 217.875 * s} ${y + h + 108}`,
    `C ${x + 215.675 * s} ${y + h + 109.05} ${x + 212.875 * s} ${y + h + 108} ${x + 212.875 * s} ${y + h + 108} Z`,
  ].join(" ");
}

function buildInner(x: number, y: number, h: number, s: number) {
  return [
    `M ${x + 7.375 * s} ${y + 6.5}`,
    `C ${x + 7.375 * s} ${y + 6.5} ${x + 132.013 * s} ${y + 68.667} ${x + 211.875 * s} ${y + 108.5}`,
    `C ${x + 211.875 * s} ${y + 108.5} ${x + 215.375 * s} ${y + 110.5} ${x + 215.375 * s} ${y + 112.5}`,
    `C ${x + 215.375 * s} ${y + 114.5} ${x + 215.375 * s} ${y + h + 103.5} ${x + 215.375 * s} ${y + h + 103.5}`,
  ].join(" ");
}

type CardProps = {
  index: number;
  mouseX: MotionValue<number>;
  startX: number;
  startY: number;
  s: number;
  dx: number;
};

// ─── Card ─────────────────────────────────────────────────────────────────────
const Card = ({ index, mouseX, startX, startY, s, dx }: CardProps) => {
  const x = startX + index * dx;
  const cardCenterX = x + (BASE_W * s) / 2;

  const height = useTransform(mouseX, (val) => {
    const dist = cardCenterX - val;
    return BASE_H + expWave(dist) * MAX_H;
  });

  const outlinePath = useTransform(height, (h) => {
    const y = startY + index * BASE_DY - h;
    return buildOutline(x, y, h, s);
  });

  const innerPath = useTransform(height, (h) => {
    const y = startY + index * BASE_DY - h;
    return buildInner(x, y, h, s);
  });

  // Outline: near-invisible grey at rest → bright white at peak
  const strokeColor = useTransform(mouseX, (val) => {
    const intensity = expWave(cardCenterX - val);
    const v = Math.round(40 + intensity * 215);
    return `rgb(${v},${v},${v})`;
  });

  // Inner highlight: very subtle at rest, slightly more visible at peak
  const innerStroke = useTransform(mouseX, (val) => {
    const intensity = expWave(cardCenterX - val);
    const v = Math.round(20 + intensity * 30);
    return `rgb(${v},${v},${v})`;
  });

  return (
    <g>
      <motion.path
        d={outlinePath}
        fill="#0a0a0a"
        stroke={strokeColor}
        strokeWidth="0.5"
      />
      <motion.path
        d={innerPath}
        fill="none"
        stroke={innerStroke}
        strokeWidth="1"
      />
    </g>
  );
};

// ─── CardWave ─────────────────────────────────────────────────────────────────
/**
 * Drop into any dark container with a defined size:
 *
 *   <div className="rounded-2xl bg-[#0a0a0a] overflow-hidden w-72 h-52">
 *     <CardWave cardWidth={140} defaultHoverIndex={5} />
 *   </div>
 *
 * Props
 * ─────
 * cardWidth          Width of each card in SVG units. Default 223.
 *                    Scales the entire card geometry proportionally.
 *
 * defaultHoverIndex  Which card index acts as the resting hover point.
 *                    The wave sits here when the mouse is away and springs
 *                    back here after the cursor leaves. Default 6.
 *
 * numCards           Total number of cards. Default 18.
 *
 * startX / startY    Manual overrides for the stack anchor in SVG coords.
 *                    Auto-computed from cardWidth when omitted — the right
 *                    edge of card 0 lands at ~75% of the viewBox width.
 */
export default function CardWave({
  cardWidth = 223,
  defaultHoverIndex = 6,
  numCards = 18,
  startX: _startX = undefined,
  startY: _startY = undefined,
}: {
  cardWidth?: number;
  defaultHoverIndex?: number;
  numCards?: number;
  startX?: number | undefined;
  startY?: number | undefined;
}) {
  const containerRef = useRef<SVGSVGElement | null>(null);

  const s = cardWidth / BASE_W; // uniform scale factor
  const dx = BASE_DX * s; // per-card horizontal step, scaled

  // Auto-anchor: right edge of card 0 at ~75% of viewBox width.
  // Override with startX / startY props for fine-tuning.
  const startX = _startX ?? Math.round(VB_W * 0.75 - cardWidth);
  const startY = _startY ?? Math.round(VB_H * 0.71);

  // SVG-space X position of the default hover card's centre
  const defaultX = startX + defaultHoverIndex * dx + (BASE_W * s) / 2;

  // mouseX is already in SVG-coordinate space
  const mouseX = useMotionValue(defaultX);
  const smoothMouseX = useSpring(mouseX, { stiffness: 150, damping: 50 });

  const handleMouseMove: MouseEventHandler<SVGSVGElement> = (e) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();

    const scaleX = VB_W / rect.width;
    mouseX.set((e.clientX - rect.left) * scaleX);
  };

  const handleMouseLeave = () => {
    // Spring back to the resting wave position
    mouseX.set(defaultX);
  };

  return (
    <svg
      ref={containerRef}
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      style={{ width: "100%", height: "100%", display: "block" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {Array.from({ length: numCards }).map((_, i) => (
        <Card
          key={i}
          index={i}
          mouseX={smoothMouseX}
          startX={startX}
          startY={startY}
          s={s}
          dx={dx}
        />
      ))}
    </svg>
  );
}
