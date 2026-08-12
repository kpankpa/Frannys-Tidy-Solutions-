"use client";

import { useCallback, useRef, useState } from "react";
import { Maximize2, Minus, Move, Plus, RotateCcw } from "lucide-react";
import { PromoFramedImage } from "@/components/promo/PromoFramedImage";
import {
  PROMO_SPOTLIGHT_ASPECT_CLASS,
  type PromoImageFit,
} from "@/lib/promotions";
import { cn } from "@/lib/utils";

const MIN_ZOOM = 50;
const MAX_ZOOM = 200;

type PromoImageFramingProps = {
  imageUrl: string;
  focusX: number;
  focusY: number;
  zoom: number;
  fit: PromoImageFit;
  onChange: (next: {
    focusX: number;
    focusY: number;
    zoom: number;
    fit: PromoImageFit;
  }) => void;
  className?: string;
};

function clampFocus(value: number) {
  return Math.min(100, Math.max(0, Math.round(value)));
}

function clampZoom(value: number) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round(value)));
}

export function PromoImageFraming({
  imageUrl,
  focusX,
  focusY,
  zoom,
  fit,
  onChange,
  className,
}: PromoImageFramingProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    pointerX: number;
    pointerY: number;
    focusX: number;
    focusY: number;
  } | null>(null);
  const [dragging, setDragging] = useState(false);

  const patch = useCallback(
    (partial: Partial<{
      focusX: number;
      focusY: number;
      zoom: number;
      fit: PromoImageFit;
    }>) => {
      onChange({
        focusX,
        focusY,
        zoom,
        fit,
        ...partial,
      });
    },
    [focusX, focusY, zoom, fit, onChange],
  );

  const panFromPointer = useCallback(
    (clientX: number, clientY: number) => {
      const start = dragRef.current;
      const frame = frameRef.current;
      if (!start || !frame) return;

      const rect = frame.getBoundingClientRect();
      const dx = clientX - start.pointerX;
      const dy = clientY - start.pointerY;
      const panStrength = (100 / (zoom / 100)) * 0.85;

      patch({
        focusX: clampFocus(start.focusX - (dx / rect.width) * panStrength),
        focusY: clampFocus(start.focusY - (dy / rect.height) * panStrength),
      });
    },
    [patch, zoom],
  );

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (!imageUrl.trim()) return;
    event.preventDefault();
    setDragging(true);
    dragRef.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      focusX,
      focusY,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    panFromPointer(event.clientX, event.clientY);
  }

  function onPointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    setDragging(false);
    dragRef.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
  }

  function onWheel(event: React.WheelEvent<HTMLDivElement>) {
    event.preventDefault();
    const delta = event.deltaY > 0 ? -5 : 5;
    patch({ zoom: clampZoom(zoom + delta) });
  }

  function resetFraming() {
    onChange({
      focusX: 50,
      focusY: 50,
      zoom: 100,
      fit: "cover",
    });
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium">Banner crop preview</p>
        <button
          type="button"
          onClick={resetFraming}
          className="inline-flex items-center gap-1 text-xs font-semibold text-muted hover:text-primary"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>

      <p className="text-xs text-muted">
        Drag to reposition, use the zoom slider or scroll wheel on the preview,
        and switch to &ldquo;Show full image&rdquo; for tall flyers. The preview
        matches the live home banner.
      </p>

      <div
        ref={frameRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
        className={cn(
          "relative overflow-hidden rounded-2xl border border-border bg-surface-muted soft-shadow",
          PROMO_SPOTLIGHT_ASPECT_CLASS,
          dragging ? "cursor-grabbing" : "cursor-grab",
        )}
      >
        <PromoFramedImage
          src={imageUrl}
          alt=""
          focusX={focusX}
          focusY={focusY}
          zoom={zoom}
          fit={fit}
          sizes="(max-width: 768px) 100vw, 720px"
        />

        <div
          className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-secondary shadow-md"
          style={{ left: `${focusX}%`, top: `${focusY}%` }}
          aria-hidden
        />

        <div className="pointer-events-none absolute inset-0 flex items-end justify-center bg-gradient-to-t from-primary/35 to-transparent p-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/80 px-3 py-1 text-[11px] font-semibold text-white">
            <Move className="h-3.5 w-3.5" />
            Drag to move · Scroll to zoom
          </span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <div className="flex items-center justify-between gap-2">
            <label htmlFor="promo-zoom" className="text-sm font-medium">
              Zoom
            </label>
            <span className="text-xs tabular-nums text-muted">{zoom}%</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              aria-label="Zoom out"
              onClick={() => patch({ zoom: clampZoom(zoom - 10) })}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] border border-border text-muted transition hover:border-primary hover:text-primary"
            >
              <Minus className="h-4 w-4" />
            </button>
            <input
              id="promo-zoom"
              type="range"
              min={MIN_ZOOM}
              max={MAX_ZOOM}
              step={5}
              value={zoom}
              onChange={(event) =>
                patch({ zoom: clampZoom(Number(event.target.value)) })
              }
              className="h-2 w-full cursor-pointer accent-primary"
            />
            <button
              type="button"
              aria-label="Zoom in"
              onClick={() => patch({ zoom: clampZoom(zoom + 10) })}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] border border-border text-muted transition hover:border-primary hover:text-primary"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium">Display mode</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => patch({ fit: "cover" })}
              className={cn(
                "inline-flex h-9 items-center rounded-[8px] border px-3 text-xs font-semibold transition",
                fit === "cover"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted hover:border-primary/40",
              )}
            >
              Fill banner
            </button>
            <button
              type="button"
              onClick={() => patch({ fit: "contain", zoom: 100 })}
              className={cn(
                "inline-flex h-9 items-center gap-1.5 rounded-[8px] border px-3 text-xs font-semibold transition",
                fit === "contain"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted hover:border-primary/40",
              )}
            >
              <Maximize2 className="h-3.5 w-3.5" />
              Show full image
            </button>
          </div>
          <p className="mt-2 text-xs text-muted">
            Use &ldquo;Show full image&rdquo; for portrait flyers. Empty sides
            are filled with a soft blur of the same image. Use zoom out below
            100% to reveal more in fill mode.
          </p>
        </div>
      </div>

      <input type="hidden" name="imageFocusX" value={focusX} />
      <input type="hidden" name="imageFocusY" value={focusY} />
      <input type="hidden" name="imageZoom" value={zoom} />
      <input type="hidden" name="imageFit" value={fit} />

      <p className="text-xs text-muted">
        Position {focusX}% / {focusY}% · Zoom {zoom}% ·{" "}
        {fit === "contain" ? "Full image" : "Fill banner"}
      </p>
    </div>
  );
}
