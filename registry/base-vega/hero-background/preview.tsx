"use client";

import Link from "next/link";
import { HeroBackground } from "@/registry/base-vega/hero-background/hero-background";

export function HeroBackgroundPreview() {
  return (
    <div className="mx-auto w-full max-w-5xl">
      <section className="relative isolate min-h-[32rem] overflow-hidden rounded-md border border-white/10 bg-[#020308] px-6 py-10 text-white sm:px-10 sm:py-14 lg:px-14">
        <HeroBackground
          glowColor="#38bdf8"
          glowOpacity={0.8}
          starOpacity={0.1}
          starSize={20}
        />

        <div className="relative z-10 mx-auto flex min-h-[24rem] max-w-4xl flex-col items-center justify-center text-center">
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.32em] text-white/72 backdrop-blur-md">
            Built with HeroBackground
          </div>

          <div className="mt-8 space-y-5">
            <h2 className="text-balance text-4xl font-semibold tracking-[-0.06em] text-white sm:text-6xl">
              The component is the backdrop, not the hero chrome.
            </h2>
            <p className="mx-auto max-w-2xl text-balance text-sm leading-7 text-slate-300 sm:text-lg sm:leading-8">
              This preview uses the glow-and-stars background inside a custom
              landing hero so the docs show what the background enables without
              turning the hero wrapper into the product.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/docs"
              className="inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-medium text-slate-950 transition-[transform,background-color] duration-200 ease-out hover:bg-white/92 active:scale-[0.98]"
            >
              Browse components
            </Link>
            <div className="inline-flex h-11 items-center justify-center rounded-full border border-white/14 bg-white/6 px-5 text-sm font-medium text-white">
              Ambient background demo
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
