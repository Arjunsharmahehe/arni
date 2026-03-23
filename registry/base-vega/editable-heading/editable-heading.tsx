"use client";

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Underline,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

type EditableHeadingFontSize = "sm" | "base" | "lg" | "xl" | "2xl";
type EditableHeadingAlign = "left" | "center" | "right";

interface EditableHeadingProps {
  text?: string;
  defaultBold?: boolean;
  defaultItalic?: boolean;
  defaultUnderline?: boolean;
  defaultAlign?: EditableHeadingAlign;
  defaultFontSize?: EditableHeadingFontSize;
  className?: string;
}

const fontSizeMap: Record<EditableHeadingFontSize, string> = {
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
};

const fontSizeLabels: Record<EditableHeadingFontSize, string> = {
  sm: "S",
  base: "M",
  lg: "L",
  xl: "XL",
  "2xl": "2X",
};

export function EditableHeading({
  text = "Versatility",
  defaultBold = false,
  defaultItalic = false,
  defaultUnderline = false,
  defaultAlign = "center",
  defaultFontSize = "base",
  className,
}: EditableHeadingProps) {
  const [open, setOpen] = useState(false);
  const [bold, setBold] = useState(defaultBold);
  const [italic, setItalic] = useState(defaultItalic);
  const [underline, setUnderline] = useState(defaultUnderline);
  const [align, setAlign] = useState<EditableHeadingAlign>(defaultAlign);
  const [fontSize, setFontSize] =
    useState<EditableHeadingFontSize>(defaultFontSize);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(e.target as Node)
    ) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, handleClickOutside]);

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "w-full border border-dashed bg-transparent px-3 py-2 text-center shadow-xs transition-all outline-none",
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
          "hover:border-ring/50 cursor-pointer",
          fontSizeMap[fontSize],
          bold && "font-bold",
          italic && "italic",
          underline && "underline underline-offset-2",
          className,
        )}
        style={{ textAlign: align }}
      >
        {text}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute -top-15 left-9.5 -right-18 z-50 mt-1 flex flex-wrap items-center gap-2 rounded-xl border border-neutral-900 bg-background p-2 shadow-md"
          >
            <ToggleGroup
              multiple
              variant="outline"
              size="sm"
              value={[
                ...(bold ? (["bold"] as const) : []),
                ...(italic ? (["italic"] as const) : []),
                ...(underline ? (["underline"] as const) : []),
              ]}
              onValueChange={(values: string[]) => {
                setBold(values.includes("bold"));
                setItalic(values.includes("italic"));
                setUnderline(values.includes("underline"));
              }}
            >
              <ToggleGroupItem value="bold" aria-label="Toggle bold">
                <Bold />
              </ToggleGroupItem>
              <ToggleGroupItem value="italic" aria-label="Toggle italic">
                <Italic />
              </ToggleGroupItem>
              <ToggleGroupItem value="underline" aria-label="Toggle underline">
                <Underline />
              </ToggleGroupItem>
            </ToggleGroup>

            <div className="h-6 w-px bg-border" />

            <ToggleGroup
              variant="outline"
              size="sm"
              value={[align]}
              onValueChange={(values: string[]) => {
                if (values.length > 0) {
                  setAlign(values[values.length - 1] as EditableHeadingAlign);
                }
              }}
            >
              <ToggleGroupItem value="left" aria-label="Align left">
                <AlignLeft />
              </ToggleGroupItem>
              <ToggleGroupItem value="center" aria-label="Align center">
                <AlignCenter />
              </ToggleGroupItem>
              <ToggleGroupItem value="right" aria-label="Align right">
                <AlignRight />
              </ToggleGroupItem>
            </ToggleGroup>

            <div className="h-6 w-px bg-border" />

            <ToggleGroup
              variant="outline"
              size="sm"
              value={[fontSize]}
              onValueChange={(values: string[]) => {
                if (values.length > 0) {
                  setFontSize(
                    values[values.length - 1] as EditableHeadingFontSize,
                  );
                }
              }}
            >
              {(Object.keys(fontSizeLabels) as EditableHeadingFontSize[]).map(
                (size) => (
                  <ToggleGroupItem
                    key={size}
                    value={size}
                    aria-label={`Font size ${fontSizeLabels[size]}`}
                    className="min-w-8"
                  >
                    {fontSizeLabels[size]}
                  </ToggleGroupItem>
                ),
              )}
            </ToggleGroup>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export type { EditableHeadingFontSize, EditableHeadingAlign };
