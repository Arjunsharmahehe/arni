import Link from "next/link";
import { HeroBackground } from "@/registry/base-vega/hero-background/hero-background";

<section className="relative isolate overflow-hidden rounded-[2rem] bg-[#020308] px-6 py-10 text-white sm:px-10 sm:py-14 lg:px-14">
  <HeroBackground
    glowColor="#38bdf8"
    glowOpacity={0.8}
    starOpacity={0.1}
    starSize={20}
  />

  <div className="relative z-10 mx-auto flex min-h-[36rem] max-w-5xl flex-col items-center justify-center text-center">
    <div className="inline-flex items-center rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.32em] text-white/72 backdrop-blur-md">
      Built with HeroBackground
    </div>

    <div className="mt-8 space-y-5">
      <h1 className="text-balance text-4xl font-semibold tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">
        Use the background to build your own hero composition.
      </h1>
      <p className="mx-auto max-w-2xl text-balance text-sm leading-7 text-slate-300 sm:text-lg sm:leading-8">
        The component only owns the animated glow and star field. The layout,
        copy, calls to action, and any foreground media stay entirely up to you.
      </p>
    </div>

    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
      <Link
        href="/signup"
        className="inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-medium text-slate-950"
      >
        Start building
      </Link>
      <Link
        href="/docs"
        className="inline-flex h-11 items-center justify-center rounded-full border border-white/14 bg-white/6 px-5 text-sm font-medium text-white"
      >
        Explore docs
      </Link>
    </div>
  </div>
</section>;
