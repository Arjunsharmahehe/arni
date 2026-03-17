"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export type HeroBackgroundProps = {
  glowColor?: string;
  glowOpacity?: number;
  starOpacity?: number;
  starSize?: number;
  motionSpeed?: number;
  animated?: boolean;
  className?: string;
};

const glowLayers = [
  {
    size: "h-[70vh] w-[108vw] sm:h-[74vh]",
    duration: 18,
    delay: 0,
    x: ["-18%", "-6%", "-12%"],
    y: ["18%", "-14%", "6%"],
    scale: [1, 1.14, 1.02],
  },
  {
    size: "h-[66vh] w-[92vw] sm:h-[70vh]",
    duration: 22,
    delay: 1.4,
    x: ["12%", "26%", "16%"],
    y: ["14%", "-20%", "2%"],
    scale: [0.94, 1.2, 1],
  },
  {
    size: "h-[58vh] w-[78vw] sm:h-[62vh]",
    duration: 26,
    delay: 2.8,
    x: ["-2%", "10%", "0%"],
    y: ["20%", "-8%", "10%"],
    scale: [0.9, 1.08, 0.96],
  },
];

function withAlpha(color: string, alpha: number) {
  const normalized = color.trim();

  if (normalized.startsWith("#")) {
    let hex = normalized.slice(1);

    if (hex.length === 3 || hex.length === 4) {
      hex = hex
        .split("")
        .map((value) => value + value)
        .join("");
    }

    if (hex.length === 6 || hex.length === 8) {
      const red = Number.parseInt(hex.slice(0, 2), 16);
      const green = Number.parseInt(hex.slice(2, 4), 16);
      const blue = Number.parseInt(hex.slice(4, 6), 16);

      return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
    }
  }

  return `color-mix(in srgb, ${normalized} ${alpha * 100}%, transparent)`;
}

export function HeroBackground({
  glowColor = "#2563eb",
  glowOpacity = 0.72,
  starOpacity = 0.08,
  starSize = 22,
  motionSpeed = 1,
  animated = true,
  className,
}: HeroBackgroundProps) {
  const shouldReduceMotion = useReducedMotion();
  const shouldAnimate = animated && !shouldReduceMotion;
  const clampedMotionSpeed = Math.max(motionSpeed, 0.15);
  const primaryGlow = withAlpha(glowColor, glowOpacity);
  const secondaryGlow = withAlpha(glowColor, Math.max(glowOpacity * 0.7, 0.18));
  const haloGlow = withAlpha(glowColor, Math.max(glowOpacity * 0.48, 0.12));

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_16%,rgba(255,255,255,0.08),transparent_30%),linear-gradient(180deg,#030712_0%,#060b1f_56%,#020308_100%)]" />

      <div className="absolute inset-x-[-12%] bottom-[14%] top-[-10%] mix-blend-screen">
        {glowLayers.map((layer, index) => (
          <motion.div
            key={layer.duration}
            animate={
              shouldAnimate
                ? {
                    x: layer.x,
                    y: layer.y,
                    scale: layer.scale,
                    opacity: [0.16, 0.38, 0.2],
                  }
                : {
                    x: layer.x[1],
                    y: layer.y[1],
                    scale: 1,
                    opacity: 0.24,
                  }
            }
            transition={
              shouldAnimate
                ? {
                    duration: layer.duration / clampedMotionSpeed,
                    delay: layer.delay / clampedMotionSpeed,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "mirror",
                    ease: [0.23, 1, 0.32, 1],
                  }
                : { duration: 0.2 }
            }
            className={cn(
              "absolute left-1/2 top-1/2 rounded-full blur-3xl will-change-transform",
              layer.size,
            )}
            style={{
              translateX: "-50%",
              translateY: "-50%",
              background:
                index === 1
                  ? `radial-gradient(circle at 50% 100%, ${primaryGlow} 0%, transparent 72%)`
                  : `radial-gradient(circle at 50% 100%, ${secondaryGlow} 0%, transparent 74%)`,
            }}
          />
        ))}
      </div>

      <motion.div
        animate={
          shouldAnimate
            ? {
                opacity: [0.45, 0.78, 0.52],
                scale: [0.96, 1.04, 0.98],
              }
            : { opacity: 0.58, scale: 1 }
        }
        transition={
          shouldAnimate
            ? {
                duration: 9 / clampedMotionSpeed,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "mirror",
                ease: [0.23, 1, 0.32, 1],
              }
            : { duration: 0.2 }
        }
        className="absolute inset-x-[8%] bottom-[-12%] h-[44%] rounded-full blur-[90px] sm:inset-x-[16%] sm:h-[48%] sm:blur-[120px]"
        style={{
          background: `radial-gradient(circle at 50% 100%, ${haloGlow} 0%, transparent 64%)`,
        }}
      />

      <div className="absolute inset-x-0 bottom-0 h-[28svh] bg-gradient-to-t from-[#020308] via-[#020308]/72 to-transparent" />

      <div
        className="absolute inset-0"
        style={{
          opacity: starOpacity,
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.9) 1px, transparent 0)",
          backgroundSize: `${starSize}px ${starSize}px`,
        }}
      />
    </div>
  );
}
