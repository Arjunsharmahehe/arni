"use client";

import { Select as SelectPrimitive } from "@base-ui/react/select";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronDown,
  Italic,
  Underline,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useIsMobile } from "@/hooks/use-mobile";
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

  const isMobile = useIsMobile();

  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [toolbarPos, setToolbarPos] = useState({ left: 0, top: 0 });

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

  // Continuously measure toolbar position via rAF while open.
  useEffect(() => {
    if (!open) return;
    let rafId: number;
    const tick = () => {
      if (!buttonRef.current || !textRef.current || !toolbarRef.current) {
        rafId = requestAnimationFrame(tick);
        return;
      }

      const buttonRect = buttonRef.current.getBoundingClientRect();
      const textRect = textRef.current.getBoundingClientRect();
      const toolbarRect = toolbarRef.current.getBoundingClientRect();

      const pad = 8;
      const gap = 4;
      const viewportWidth = document.documentElement.clientWidth;

      // Desired center = text's center in viewport coords
      const desiredCenterX = textRect.left + textRect.width / 2;

      // Clamp so toolbar stays fully inside the viewport
      const clampedCenterX = Math.max(
        toolbarRect.width / 2 + pad,
        Math.min(viewportWidth - toolbarRect.width / 2 - pad, desiredCenterX),
      );

      setToolbarPos({
        left: clampedCenterX - toolbarRect.width / 2,
        top: buttonRect.top - toolbarRect.height - gap,
      });

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [open]);

  return (
    <div ref={containerRef} className="w-full">
      <button
        ref={buttonRef}
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
        <span ref={textRef}>{text}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              left: toolbarPos.left,
              top: toolbarPos.top,
            }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{
              opacity: { duration: 0.15, ease: "easeOut" },
              scale: { duration: 0.15, ease: "easeOut" },
              y: { duration: 0.15, ease: "easeOut" },
              left: { type: "spring", stiffness: 300, damping: 30 },
              top: { duration: 0 },
            }}
            style={{ position: "fixed", zIndex: 50 }}
          >
            <div
              ref={toolbarRef}
              className={cn(
                "w-fit flex items-center rounded-xl border border-neutral-900 bg-background shadow-md",
                isMobile ? "gap-1 p-1.5" : "gap-2 p-2",
              )}
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
                <ToggleGroupItem
                  value="underline"
                  aria-label="Toggle underline"
                >
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

              {isMobile ? (
                <SelectPrimitive.Root
                  value={fontSize}
                  onValueChange={(v) => {
                    if (v) setFontSize(v as EditableHeadingFontSize);
                  }}
                  items={fontSizeLabels}
                  modal={false}
                >
                  <SelectPrimitive.Trigger
                    className={cn(
                      "inline-flex items-center justify-center gap-1 rounded-md border border-input bg-transparent shadow-xs",
                      "hover:bg-muted cursor-pointer outline-none",
                      "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
                      "h-7 min-w-7 px-1.5 text-xs",
                    )}
                  >
                    <SelectPrimitive.Value />
                    <ChevronDown className="size-3 opacity-50" />
                  </SelectPrimitive.Trigger>
                  <SelectPrimitive.Portal>
                    <SelectPrimitive.Positioner>
                      <SelectPrimitive.Popup className="z-[100] min-w-[var(--anchor-width)] rounded-xl border border-neutral-900 bg-background p-1 shadow-md">
                        {(
                          Object.keys(
                            fontSizeLabels,
                          ) as EditableHeadingFontSize[]
                        ).map((size) => (
                          <SelectPrimitive.Item
                            key={size}
                            value={size}
                            className="flex items-center justify-center rounded-md px-2 py-1 text-xs cursor-pointer hover:bg-muted data-[highlighted]:bg-muted outline-none"
                          >
                            <SelectPrimitive.ItemText>
                              {fontSizeLabels[size]}
                            </SelectPrimitive.ItemText>
                          </SelectPrimitive.Item>
                        ))}
                      </SelectPrimitive.Popup>
                    </SelectPrimitive.Positioner>
                  </SelectPrimitive.Portal>
                </SelectPrimitive.Root>
              ) : (
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
                  {(
                    Object.keys(fontSizeLabels) as EditableHeadingFontSize[]
                  ).map((size) => (
                    <ToggleGroupItem
                      key={size}
                      value={size}
                      aria-label={`Font size ${fontSizeLabels[size]}`}
                      className="min-w-8"
                    >
                      {fontSizeLabels[size]}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export type { EditableHeadingFontSize, EditableHeadingAlign };
