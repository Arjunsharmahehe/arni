import type { ComponentNavMeta } from "@/lib/component-registry-schema";

export const componentNavigation: ComponentNavMeta[] = [
  {
    slug: "card-wave",
    name: "Card Wave",
    description:
      "A tastefull svg with interactive hover effects to make the boring cards interesting",
    categories: ["svg", "motion"],
  },
  {
    slug: "diff-viewer",
    name: "Diff Viewer",
    description:
      "A lightweight compound diff code block for landing pages with responsive before/after panels, inherited inline marks, and customizable syntax highlighting rules.",
    categories: ["code", "marketing"],
  },
  {
    slug: "editable-heading",
    name: "Editable Heading",
    description:
      "An interactive heading styled as a text field that reveals a formatting toolbar on click. Supports bold, italic, underline, alignment, and font size controls. Inspired by Kree8's landing page design.",
    categories: ["text"],
  },
  {
    slug: "floating-navbar",
    name: "Floating Navbar",
    description:
      "A reusable floating navigation bar with preserved motion behavior, array-driven links, and flexible brand configuration for logo or text.",
    categories: ["navigation", "marketing"],
  },
  {
    slug: "hero-background",
    name: "Hero Background",
    description:
      "An animated glow-and-stars backdrop you can drop into any relative container to build cinematic landing sections.",
    categories: ["background", "marketing"],
  },
  {
    slug: "linear-card",
    name: "Linear Card",
    description:
      "A compound feature card inspired by Linear's design language. Supports image and reactive SVG content variants with a minimal, editorial layout.",
    categories: ["card", "marketing"],
  },
  {
    slug: "terminal",
    name: "Terminal",
    description:
      "A procedural terminal playback component with typed commands, line-by-line output reveals, optional in-view start, and macOS, Windows, and Linux window variants.",
    categories: ["code", "marketing"],
  },
];
