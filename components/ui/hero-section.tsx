"use client";

import Link from "next/link";
import {
  HeroBackground,
  type HeroBackgroundProps,
} from "@/components/background/hero-background";
import { cn } from "@/lib/utils";

export type HeroAction = {
  label: string;
  href?: string;
};

export type HeroSectionProps = {
  eyebrow?: string;
  title: string;
  subtitle: string;
  primaryAction?: HeroAction;
  secondaryAction?: HeroAction;
  glowColor?: HeroBackgroundProps["glowColor"];
  backgroundProps?: Omit<HeroBackgroundProps, "glowColor">;
  className?: string;
};

function HeroButton({
  action,
  kind,
}: {
  action: HeroAction;
  kind: "primary" | "secondary";
}) {
  const className =
    kind === "primary"
      ? "bg-white text-slate-950 shadow-[0_12px_40px_rgba(255,255,255,0.18)] hover:bg-white/92"
      : "border border-white/14 bg-white/6 text-white hover:bg-white/10";

  if (action.href) {
    return (
      <Link
        href={action.href}
        className={cn(
          "inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-medium tracking-[0.02em] transition-[transform,background-color,color] duration-200 ease-out active:scale-[0.98]",
          className,
        )}
      >
        {action.label}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-medium tracking-[0.02em] transition-[transform,background-color,color] duration-200 ease-out active:scale-[0.98]",
        className,
      )}
    >
      {action.label}
    </button>
  );
}

export function HeroSection({
  eyebrow = "New release",
  title,
  subtitle,
  primaryAction,
  secondaryAction,
  glowColor = "#2563eb",
  backgroundProps,
  className,
}: HeroSectionProps) {
  return (
    <section
      className={cn(
        "relative isolate flex min-h-[34rem] w-full items-start overflow-hidden rounded-[2rem] bg-[#020308] px-6 py-10 text-white sm:min-h-[38rem] sm:px-10 sm:py-14 lg:min-h-[44rem] lg:px-14 lg:py-[4.5rem]",
        className,
      )}
    >
      <HeroBackground glowColor={glowColor} {...backgroundProps} />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center pt-6 text-center sm:pt-10 lg:pt-14">
        <div className="inline-flex items-center rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.32em] text-white/72 backdrop-blur-md sm:text-[0.7rem]">
          {eyebrow}
        </div>

        <div className="mt-6 max-w-4xl space-y-5 sm:mt-8 sm:space-y-6">
          <h1 className="text-balance text-4xl font-semibold tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">
            {title}
          </h1>
          <p className="mx-auto max-w-2xl text-balance text-sm leading-7 text-slate-300 sm:text-lg sm:leading-8">
            {subtitle}
          </p>
        </div>

        {(primaryAction || secondaryAction) && (
          <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:mt-10 sm:w-auto sm:flex-row">
            {primaryAction ? (
              <HeroButton action={primaryAction} kind="primary" />
            ) : null}
            {secondaryAction ? (
              <HeroButton action={secondaryAction} kind="secondary" />
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
