import { EditableHeading } from "@/registry/base-vega/editable-heading/editable-heading";

// Basic usage
<EditableHeading />;

// Custom text
<EditableHeading text="Welcome to the Future" />;

// With default styling
<EditableHeading
  text="Styled Heading"
  defaultBold
  defaultAlign="left"
  defaultFontSize="xl"
/>;

// Full customization
<EditableHeading
  text="Get Started"
  defaultBold
  defaultItalic
  defaultUnderline
  defaultAlign="center"
  defaultFontSize="2xl"
  className="font-mono"
/>;
