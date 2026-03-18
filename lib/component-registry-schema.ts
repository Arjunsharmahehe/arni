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
  sourcePath?: string;
  code?: string;
  usage: string;
  props: PropDef[];
  subComponents?: SubComponent[];
};
