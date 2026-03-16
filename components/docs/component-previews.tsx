import { LinearCardPreview } from "@/components/examples/linear-card-preview";

// ---------------------------------------------------------------------------
// Slug → Preview map
// ---------------------------------------------------------------------------

const previews: Record<string, React.ComponentType> = {
  "linear-card": LinearCardPreview,
};

export function ComponentPreviewRenderer({ slug }: { slug: string }) {
  const Preview = previews[slug];
  if (!Preview) return null;
  return <Preview />;
}
