"use client";

import dynamic from "next/dynamic";

const previews: Record<string, React.ComponentType> = {
  "card-wave": dynamic(() =>
    import("@/registry/base-vega/card-wave/preview").then((module) => ({
      default: module.CardWavePreview,
    })),
  ),
  "diff-viewer": dynamic(() =>
    import("@/registry/base-vega/diff-viewer/preview").then((module) => ({
      default: module.DiffViewerPreview,
    })),
  ),
  "floating-navbar": dynamic(() =>
    import("@/registry/base-vega/floating-navbar/preview").then((module) => ({
      default: module.FloatingNavbarPreview,
    })),
  ),
  "hero-background": dynamic(() =>
    import("@/registry/base-vega/hero-background/preview").then((module) => ({
      default: module.HeroBackgroundPreview,
    })),
  ),
  "linear-card": dynamic(() =>
    import("@/registry/base-vega/linear-card/preview").then((module) => ({
      default: module.LinearCardPreview,
    })),
  ),
};

export function ComponentPreviewRenderer({ slug }: { slug: string }) {
  const Preview = previews[slug];

  if (!Preview) {
    return null;
  }

  return <Preview />;
}
