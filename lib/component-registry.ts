// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PropDef = {
  name: string;
  type: string;
  default?: string;
  description: string;
};

export type SubComponent = {
  name: string;
  description: string;
  props: PropDef[];
};

export type ComponentMeta = {
  slug: string;
  name: string;
  description: string;
  /** Relative file path used for the Source tab when available. */
  sourcePath?: string;
  /** Raw source fallback when sourcePath is not provided. */
  code?: string;
  /** Copyable usage snippet */
  usage: string;
  /** Props for root component */
  props: PropDef[];
  /** Compound sub-components */
  subComponents?: SubComponent[];
};

// ---------------------------------------------------------------------------
// Linear Card — Usage
// ---------------------------------------------------------------------------

const linearCardUsage = `import CardWave from "@/components/reactive-svg/card-wave";
import {
  LinearCard,
  LinearCardBody,
  LinearCardHeader,
  LinearCardHeading,
  LinearCardImageContainer,
  LinearCardSubheading,
  LinearCardSVGContainer,
} from "@/components/ui/linear-card";
import Image from "next/image";

{/* Image variant */}
<LinearCard>
  <LinearCardHeader>FIG 0.1</LinearCardHeader>
  <LinearCardImageContainer>
    <Image
      src="/your-image.png"
      alt="Card image"
      fill
      className="cover"
    />
  </LinearCardImageContainer>
  <LinearCardBody>
    <LinearCardHeading>Designed for speed</LinearCardHeading>
    <LinearCardSubheading>
      Reduces noise and restores momentum.
    </LinearCardSubheading>
  </LinearCardBody>
</LinearCard>

{/* SVG variant */}
<LinearCard isLast>
  <LinearCardHeader>FIG 0.2</LinearCardHeader>
  <LinearCardSVGContainer>
    <CardWave cardWidth={140} defaultHoverIndex={5} />
  </LinearCardSVGContainer>
  <LinearCardBody>
    <LinearCardHeading>Designed for speed</LinearCardHeading>
    <LinearCardSubheading>
      Reduces noise and restores momentum.
    </LinearCardSubheading>
  </LinearCardBody>
</LinearCard>`;

// ---------------------------------------------------------------------------
// Diff Viewer — Usage
// ---------------------------------------------------------------------------

const diffViewerUsage = `import {
  DiffLine,
  DiffMark,
  DiffPanel,
  DiffViewer,
} from "@/components/ui/diff-viewer";

const highlightRules = [
  {
    name: "keyword",
    pattern: /\\b(?:import|from|export|function|const|return)\\b/,
    style: { color: "#38bdf8" },
  },
  {
    name: "string",
    pattern: /"(?:[^"\\\\]|\\\\.)*"|'(?:[^'\\\\]|\\\\.)*'/,
    style: { color: "#fbbf24" },
  },
];

<DiffViewer filename="app/home-screen.tsx" highlightRules={highlightRules}>
  <DiffPanel side="before">
    <DiffLine type="del" number={1}>
      import { <DiffMark className="text-red-200">useVehicleState</DiffMark> } from "@/hooks/useVehicleState";
    </DiffLine>
    <DiffLine type="del" number={2}>
      const { <DiffMark className="text-red-200">selectedVehicle</DiffMark> } = <DiffMark className="text-red-200">useVehicleState</DiffMark>();
    </DiffLine>
  </DiffPanel>

  <DiffPanel side="after">
    <DiffLine type="add" number={1}>
      import { <DiffMark className="text-emerald-200">useVehicleStates</DiffMark> } from "@/hooks/useVehicleStates";
    </DiffLine>
    <DiffLine type="add" number={2}>
      const { <DiffMark className="text-emerald-200">activeVehicle</DiffMark> } = <DiffMark className="text-emerald-200">useVehicleStates</DiffMark>();
    </DiffLine>
  </DiffPanel>
</DiffViewer>`;

// ---------------------------------------------------------------------------
// Hero Background - Usage
// ---------------------------------------------------------------------------

const heroBackgroundUsage = `import Link from "next/link";
import { HeroBackground } from "@/components/background/hero-background";

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
</section>`;

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

export const componentRegistry: ComponentMeta[] = [
  {
    slug: "hero-background",
    name: "Hero Background",
    description:
      "An animated glow-and-stars backdrop you can drop into any relative container to build cinematic landing sections.",
    sourcePath: "components/background/hero-background.tsx",
    usage: heroBackgroundUsage,
    props: [
      {
        name: "glowColor",
        type: "string",
        default: '"#2563eb"',
        description: "Accent color used across the ambient glow layers.",
      },
      {
        name: "glowOpacity",
        type: "number",
        default: "0.72",
        description: "Controls the intensity of the moving glow bloom.",
      },
      {
        name: "starOpacity",
        type: "number",
        default: "0.08",
        description: "Sets the visibility of the dotted star field overlay.",
      },
      {
        name: "starSize",
        type: "number",
        default: "22",
        description: "Adjusts the spacing of the dot pattern used as stars.",
      },
      {
        name: "motionSpeed",
        type: "number",
        default: "1",
        description: "Speeds up or slows down the ambient glow animation.",
      },
      {
        name: "animated",
        type: "boolean",
        default: "true",
        description:
          "Disables motion while keeping the static background visible.",
      },
      {
        name: "className",
        type: "string",
        description:
          "Optional classes for the absolutely positioned background wrapper.",
      },
    ],
  },
  {
    slug: "linear-card",
    name: "Linear Card",
    description:
      "A compound feature card inspired by Linear's design language. Supports image and reactive SVG content variants with a minimal, editorial layout.",
    sourcePath: "components/ui/linear-card.tsx",
    usage: linearCardUsage,
    props: [
      {
        name: "children",
        type: "React.ReactNode",
        description: "Card content - compose with the sub-components below",
      },
      {
        name: "isLast",
        type: "boolean",
        default: "false",
        description:
          "When true, removes the right border so the last card in a row sits flush",
      },
    ],
    subComponents: [
      {
        name: "LinearCardHeader",
        description:
          "Mono micro-label displayed above the card media. Hidden on mobile",
        props: [
          {
            name: "children",
            type: "React.ReactNode",
            description: 'Header label text, e.g. "FIG 0.1"',
          },
        ],
      },
      {
        name: "LinearCardHeading",
        description: "Primary heading inside the card body",
        props: [
          {
            name: "children",
            type: "React.ReactNode",
            description: "Heading text",
          },
        ],
      },
      {
        name: "LinearCardSubheading",
        description: "Muted description text inside the card body",
        props: [
          {
            name: "children",
            type: "React.ReactNode",
            description: "Subheading text",
          },
        ],
      },
      {
        name: "LinearCardBody",
        description:
          "Wrapper for heading + subheading. Provides vertical flex layout and small text size",
        props: [
          {
            name: "children",
            type: "React.ReactNode",
            description: "Body content - typically heading and subheading",
          },
        ],
      },
      {
        name: "LinearCardImageContainer",
        description:
          "Fixed-size container for an image (relative positioned for next/image fill)",
        props: [
          {
            name: "children",
            type: "React.ReactNode",
            description: "An <Image /> or <img /> element",
          },
        ],
      },
      {
        name: "LinearCardSVGContainer",
        description:
          "Fixed-size container for an SVG graphic with overflow hidden",
        props: [
          {
            name: "children",
            type: "React.ReactNode",
            description: "An SVG element or reactive SVG component",
          },
        ],
      },
    ],
  },
  {
    slug: "diff-viewer",
    name: "Diff Viewer",
    description:
      "A lightweight compound diff code block for landing pages with responsive before/after panels, inherited inline marks, and customizable syntax highlighting rules.",
    sourcePath: "components/ui/diff-viewer.tsx",
    usage: diffViewerUsage,
    props: [
      {
        name: "children",
        type: "React.ReactNode",
        description:
          "Compose with DiffPanel children to define the before and after panes",
      },
      {
        name: "filename",
        type: "string",
        description:
          "Optional file label rendered in the header, like a code block title",
      },
      {
        name: "highlightRules",
        type: "DiffHighlightRule[]",
        default: "DEFAULT_DIFF_HIGHLIGHT_RULES",
        description:
          "Tokenizer rules used to automatically syntax-highlight text children inside DiffLine",
      },
      {
        name: "panes",
        type: "1 | 2",
        default: "2",
        description:
          "The number of panes your diff will have. Useful when creating inline diff-view",
      },
      {
        name: "className",
        type: "string",
        description:
          "Custom classes applied to the outer diff viewer container",
      },
    ],
    subComponents: [
      {
        name: "DiffPanel",
        description:
          "One side of the diff. On mobile the panels stack vertically; from md upwards they render side by side.",
        props: [
          {
            name: "children",
            type: "React.ReactNode",
            description: "Diff lines for a single side of the comparison",
          },
          {
            name: "side",
            type: '"before" | "after"',
            description:
              "Logical panel side used for composition and semantics",
          },
          {
            name: "className",
            type: "string",
            description: "Custom classes for the panel wrapper",
          },
        ],
      },
      {
        name: "DiffLine",
        description:
          "A single diff row. Automatically highlights text children and provides add/del state to nested DiffMark elements.",
        props: [
          {
            name: "children",
            type: "React.ReactNode",
            description:
              "Line content. Plain text is tokenized automatically; nested DiffMark stays precise.",
          },
          {
            name: "type",
            type: '"add" | "del" | "context"',
            default: '"context"',
            description:
              "Controls line chrome, sign, and inherited mark styling",
          },
          {
            name: "number",
            type: "number",
            description: "Optional line number displayed in the gutter",
          },
          {
            name: "highlightRules",
            type: "DiffHighlightRule[]",
            description:
              "Optional per-line override for syntax highlighting rules",
          },
          {
            name: "disableHighlighting",
            type: "boolean",
            default: "false",
            description: "Disables automatic syntax highlighting for that line",
          },
          {
            name: "className",
            type: "string",
            description: "Custom classes for the line wrapper",
          },
        ],
      },
      {
        name: "DiffMark",
        description:
          "Inline changed fragment. Inherits add/del state from the parent DiffLine and lets you color the inner text directly with className.",
        props: [
          {
            name: "children",
            type: "React.ReactNode",
            description:
              "The exact changed text or nested content to emphasize",
          },
          {
            name: "className",
            type: "string",
            description:
              "Classes applied to the inner text inside the highlighted mark",
          },
          {
            name: "markClassName",
            type: "string",
            description: "Optional classes for the outer highlighted wrapper",
          },
        ],
      },
    ],
  },
];

export function getComponent(slug: string): ComponentMeta | undefined {
  return componentRegistry.find((component) => component.slug === slug);
}
