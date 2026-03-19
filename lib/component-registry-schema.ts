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

export type InstallCommandSet = {
  npx: string;
  pnpm: string;
  bun: string;
};

export type HighlightedCodeSet = {
  usage: string;
  source: string;
  install: InstallCommandSet;
};

export type ComponentNavMeta = {
  slug: string;
  name: string;
  description: string;
  categories?: string[];
};

export type ComponentMeta = {
  slug: string;
  name: string;
  description: string;
  categories?: string[];
  sourcePath?: string;
  sourceCode?: string;
  code?: string;
  installCommands?: InstallCommandSet;
  highlighted?: HighlightedCodeSet;
  usage: string;
  props: PropDef[];
  subComponents?: SubComponent[];
};
