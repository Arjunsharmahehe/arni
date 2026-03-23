"use client";

import { EditableHeadingPreview } from "@/registry/base-vega/editable-heading/preview";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <div className="w-full max-w-md">
        <EditableHeadingPreview />
      </div>
    </div>
  );
}
