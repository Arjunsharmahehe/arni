import { EditableHeading } from "@/registry/base-vega/editable-heading/editable-heading";

export function EditableHeadingPreview() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <p className="mb-6 text-neutral-400">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut.
        </p>
        <EditableHeading
          text="Versatility"
          defaultAlign="left"
          defaultFontSize="2xl"
          defaultBold
        />
        <p className="mt-2 text-neutral-400">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut.
        </p>
      </div>
    </div>
  );
}
