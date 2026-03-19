import { CardWavePreview } from "@/registry/base-vega/card-wave/preview";
import { DiffViewerPreview } from "@/registry/base-vega/diff-viewer/preview";
import { FloatingNavbarPreview } from "@/registry/base-vega/floating-navbar/preview";
import { HeroBackgroundPreview } from "@/registry/base-vega/hero-background/preview";
import { LinearCardPreview } from "@/registry/base-vega/linear-card/preview";

const previews: Record<string, React.ComponentType> = {
  "card-wave": CardWavePreview,
  "diff-viewer": DiffViewerPreview,
  "floating-navbar": FloatingNavbarPreview,
  "hero-background": HeroBackgroundPreview,
  "linear-card": LinearCardPreview,
};

export function ComponentPreviewRenderer({ slug }: { slug: string }) {
  const Preview = previews[slug];

  if (!Preview) {
    return null;
  }

  return <Preview />;
}
