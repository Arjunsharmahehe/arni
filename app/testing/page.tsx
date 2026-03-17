"use client";

import { useMemo, useState } from "react";
import { HeroBackground } from "@/components/background/hero-background";

type ControlSliderProps = {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
};

function ControlSlider({
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
}: ControlSliderProps) {
  return (
    <label className="space-y-2">
      <div className="flex items-center justify-between gap-4 text-sm">
        <span className="text-white/72">{label}</span>
        <span className="font-mono text-white/48">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-sky-400"
      />
    </label>
  );
}

export default function TestingPage() {
  const [glowColor, setGlowColor] = useState("#38bdf8");
  const [glowOpacity, setGlowOpacity] = useState(72);
  const [starOpacity, setStarOpacity] = useState(8);
  const [starSize, setStarSize] = useState(22);
  const [motionSpeed, setMotionSpeed] = useState(100);
  const [animated, setAnimated] = useState(true);

  const codeSample = useMemo(
    () => `<HeroBackground
  glowColor="${glowColor}"
  glowOpacity={${(glowOpacity / 100).toFixed(2)}}
  starOpacity={${(starOpacity / 100).toFixed(2)}}
  starSize={${starSize}}
  motionSpeed={${(motionSpeed / 100).toFixed(2)}}
  animated={${animated}}
/>`,
    [animated, glowColor, glowOpacity, motionSpeed, starOpacity, starSize],
  );

  return (
    <main className="min-h-screen bg-[#020308] p-4 text-white sm:p-6 lg:p-8">
      <div className="mx-auto grid w-full max-w-7xl gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <section className="relative isolate min-h-[72svh] overflow-hidden rounded-[2rem] border border-white/10 bg-[#020308] shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_30px_100px_rgba(0,0,0,0.45)]">
          <HeroBackground
            glowColor={glowColor}
            glowOpacity={glowOpacity / 100}
            starOpacity={starOpacity / 100}
            starSize={starSize}
            motionSpeed={motionSpeed / 100}
            animated={animated}
          />

          <div className="relative z-10 flex min-h-[72svh] flex-col justify-between p-6 sm:p-8 lg:p-12">
            <div className="max-w-xl space-y-4">
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-white/48">
                Background playground
              </p>
              <h1 className="text-balance text-4xl font-semibold tracking-[-0.06em] text-white sm:text-6xl">
                Tune the glow and star field live.
              </h1>
              <p className="max-w-lg text-sm leading-7 text-slate-300 sm:text-base">
                This page now isolates the background itself so you can judge
                the ambient glow, dot pattern, and motion without a hero arc
                getting in the way.
              </p>
            </div>

            <div className="max-w-xl rounded-2xl border border-white/10 bg-black/25 p-4 backdrop-blur-md">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.28em] text-white/40">
                Current config
              </p>
              <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-xs leading-6 text-sky-100/88">
                {codeSample}
              </pre>
            </div>
          </div>
        </section>

        <aside className="rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur-md sm:p-6">
          <div className="mb-6 space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-white/40">
              Control panel
            </p>
            <h2 className="text-2xl font-semibold tracking-[-0.04em] text-white">
              Shape the background live
            </h2>
          </div>

          <div className="space-y-5">
            <label className="space-y-2">
              <span className="block text-sm text-white/72">Glow color</span>
              <input
                type="color"
                value={glowColor}
                onChange={(event) => setGlowColor(event.target.value)}
                className="h-11 w-full cursor-pointer rounded-xl border border-white/10 bg-transparent"
              />
            </label>

            <ControlSlider
              label="Glow opacity"
              min={0}
              max={100}
              value={glowOpacity}
              onChange={setGlowOpacity}
            />
            <ControlSlider
              label="Star opacity"
              min={0}
              max={20}
              value={starOpacity}
              onChange={setStarOpacity}
            />
            <ControlSlider
              label="Star size"
              min={10}
              max={40}
              value={starSize}
              onChange={setStarSize}
            />
            <ControlSlider
              label="Motion speed"
              min={20}
              max={220}
              value={motionSpeed}
              onChange={setMotionSpeed}
            />

            <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/72">
              <span>Animated glow</span>
              <input
                type="checkbox"
                checked={animated}
                onChange={(event) => setAnimated(event.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-transparent accent-sky-400"
              />
            </label>
          </div>
        </aside>
      </div>
    </main>
  );
}
