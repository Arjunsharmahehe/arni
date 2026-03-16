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
  /** Raw source of the component file */
  code: string;
  /** Copyable usage snippet */
  usage: string;
  /** Props for root component */
  props: PropDef[];
  /** Compound sub-components */
  subComponents?: SubComponent[];
};

// ---------------------------------------------------------------------------
// Linear Card — Source
// ---------------------------------------------------------------------------

const linearCardSource = `export const LinearCard = ({
  children,
  isLast = false,
}: {
  children: React.ReactNode;
  isLast?: boolean;
}) => {
  return (
    <div
      className={\`
        flex flex-col items-center gap-12 w-96 px-8 py-6
        border border-neutral-900 rounded-md
        md:border-t-0 md:border-b-0 md:border-l-0 md:rounded-none md:py-0
        \${isLast ? "md:border-r-0" : "md:border-r md:border-neutral-900"}
      \`}
    >
      {children}
    </div>
  );
};

export const LinearCardHeading = ({ children }: { children: React.ReactNode }) => {
  return <h3 className="font-medium">{children}</h3>;
};

export const LinearCardSubheading = ({ children }: { children: React.ReactNode }) => {
  return <p className="text-neutral-500 text-balance">{children}</p>;
};

export const LinearCardBody = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col text-neutral-50 text-[12px] gap-2">
      {children}
    </div>
  );
};

export const LinearCardHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <p className="hidden md:block text-neutral-600 text-[8px] font-mono w-full">
      {children}
    </p>
  );
};

export const LinearCardSVGContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className="overflow-hidden w-72 h-56">{children}</div>;
};

export const LinearCardImageContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className="overflow-hidden w-72 h-56 relative">{children}</div>;
};`;

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
// Registry
// ---------------------------------------------------------------------------

export const componentRegistry: ComponentMeta[] = [
  {
    slug: "linear-card",
    name: "Linear Card",
    description:
      "A compound feature card inspired by Linear's design language. Supports image and reactive SVG content variants with a minimal, editorial layout.",
    code: linearCardSource,
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
];

export function getComponent(slug: string): ComponentMeta | undefined {
  return componentRegistry.find((c) => c.slug === slug);
}
