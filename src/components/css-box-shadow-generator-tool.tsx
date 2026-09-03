"use client";

import { useState, useCallback } from "react";
import { Plus, Trash2, Copy, Check, RefreshCw, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ToolEvents } from "@/lib/analytics";

interface ShadowLayer {
  id: string;
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
  inset: boolean;
  visible: boolean;
}

const PRESETS: { name: string; layers: Omit<ShadowLayer, "id" | "visible">[] }[] = [
  {
    name: "Material",
    layers: [
      { x: 0, y: 4, blur: 6, spread: -1, color: "#000000", opacity: 10, inset: false },
      { x: 0, y: 2, blur: 4, spread: -1, color: "#000000", opacity: 6, inset: false },
    ],
  },
  {
    name: "Neon Glow",
    layers: [
      { x: 0, y: 0, blur: 10, spread: 0, color: "#3b82f6", opacity: 100, inset: false },
      { x: 0, y: 0, blur: 30, spread: 0, color: "#6366f1", opacity: 70, inset: false },
      { x: 0, y: 0, blur: 60, spread: 10, color: "#3b82f6", opacity: 30, inset: false },
    ],
  },
  {
    name: "Neumorphism",
    layers: [
      { x: 8, y: 8, blur: 16, spread: 0, color: "#bebebe", opacity: 100, inset: false },
      { x: -8, y: -8, blur: 16, spread: 0, color: "#ffffff", opacity: 100, inset: false },
    ],
  },
  {
    name: "Soft Shadow",
    layers: [
      { x: 0, y: 20, blur: 60, spread: -10, color: "#000000", opacity: 20, inset: false },
    ],
  },
  {
    name: "Sharp Drop",
    layers: [
      { x: 4, y: 4, blur: 0, spread: 0, color: "#000000", opacity: 100, inset: false },
    ],
  },
  {
    name: "Inner Shadow",
    layers: [
      { x: 0, y: 4, blur: 6, spread: 0, color: "#000000", opacity: 20, inset: true },
    ],
  },
];

function hexToRgba(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${(opacity / 100).toFixed(2)})`;
}

function layerToCSS(layer: ShadowLayer): string {
  const color = hexToRgba(layer.color, layer.opacity);
  const inset = layer.inset ? "inset " : "";
  return `${inset}${layer.x}px ${layer.y}px ${layer.blur}px ${layer.spread}px ${color}`;
}

function generateCSS(layers: ShadowLayer[]): string {
  const visible = layers.filter((l) => l.visible);
  if (visible.length === 0) return "none";
  return visible.map(layerToCSS).join(",\n    ");
}

let layerCount = 0;
function createId() {
  return `layer-${++layerCount}-${Math.random().toString(36).slice(2, 6)}`;
}

const DEFAULT_LAYER: Omit<ShadowLayer, "id"> = {
  x: 0,
  y: 4,
  blur: 16,
  spread: 0,
  color: "#000000",
  opacity: 20,
  inset: false,
  visible: true,
};

function SliderRow({
  label,
  value,
  min,
  max,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <label className="w-16 text-xs text-muted-foreground shrink-0">{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 h-1.5 appearance-none rounded-full cursor-pointer accent-brand"
        style={{ accentColor: "var(--brand)" }}
      />
      <span className="w-16 text-right text-xs font-mono tabular-nums">
        {value}
        {unit}
      </span>
    </div>
  );
}

export function CssBoxShadowGeneratorTool() {
  const [layers, setLayers] = useState<ShadowLayer[]>([
    {
      ...DEFAULT_LAYER,
      id: createId(),
      x: 0,
      y: 8,
      blur: 24,
      spread: 0,
      color: "#000000",
      opacity: 15,
    },
  ]);
  const [bgDark, setBgDark] = useState(false);
  const [copied, setCopied] = useState(false);

  const addLayer = useCallback(() => {
    setLayers((prev) => [...prev, { ...DEFAULT_LAYER, id: createId() }]);
  }, []);

  const removeLayer = useCallback((id: string) => {
    setLayers((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const toggleVisibility = useCallback((id: string) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l))
    );
  }, []);

  const updateLayer = useCallback((id: string, patch: Partial<ShadowLayer>) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...patch } : l))
    );
  }, []);

  const applyPreset = useCallback(
    (preset: (typeof PRESETS)[number]) => {
      setLayers(
        preset.layers.map((l) => ({ ...l, id: createId(), visible: true }))
      );
      ToolEvents.toolUsed(
        `preset-${preset.name.toLowerCase().replace(/\s+/g, "-")}`
      );
    },
    []
  );

  const cssValue = generateCSS(layers);
  const fullCSS = `box-shadow: ${cssValue};`;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(fullCSS);
      setCopied(true);
      toast.success("CSS copied to clipboard!");
      ToolEvents.resultCopied();
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy — please copy manually.");
    }
  }, [fullCSS]);

  const handleReset = useCallback(() => {
    setLayers([
      {
        ...DEFAULT_LAYER,
        id: createId(),
        x: 0,
        y: 8,
        blur: 24,
        spread: 0,
        color: "#000000",
        opacity: 15,
      },
    ]);
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Presets row */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm text-muted-foreground font-medium mr-1">
          Presets:
        </span>
        {PRESETS.map((p) => (
          <button
            key={p.name}
            onClick={() => applyPreset(p)}
            className="px-3 py-1 text-xs rounded-full border border-border/60 bg-muted/40 hover:bg-brand/10 hover:border-brand/40 hover:text-brand transition-colors"
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Shadow Layers Panel */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Shadow Layers</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="gap-1.5 text-xs h-7"
              >
                <RefreshCw className="h-3 w-3" />
                Reset
              </Button>
              <Button
                size="sm"
                onClick={addLayer}
                className="gap-1.5 text-xs h-7 bg-brand hover:bg-brand/90 text-white"
              >
                <Plus className="h-3 w-3" />
                Add Layer
              </Button>
            </div>
          </div>

          {layers.length === 0 && (
            <div className="rounded-xl border border-dashed border-border/60 p-10 text-center text-sm text-muted-foreground">
              No shadow layers.{" "}
              <button
                onClick={addLayer}
                className="text-brand underline underline-offset-2"
              >
                Add a layer
              </button>{" "}
              to get started.
            </div>
          )}

          <div className="space-y-3">
            {layers.map((layer, i) => (
              <Card
                key={layer.id}
                className={cn(
                  "p-4 space-y-3 border transition-opacity",
                  !layer.visible && "opacity-50"
                )}
              >
                {/* Layer header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Layer {i + 1}</span>
                    {layer.inset && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-brand/10 text-brand border border-brand/20">
                        inset
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <label className="flex items-center gap-1 cursor-pointer mr-2">
                      <input
                        type="checkbox"
                        checked={layer.inset}
                        onChange={(e) =>
                          updateLayer(layer.id, { inset: e.target.checked })
                        }
                        className="w-3.5 h-3.5 cursor-pointer"
                        style={{ accentColor: "var(--brand)" }}
                      />
                      <span className="text-xs text-muted-foreground">
                        Inset
                      </span>
                    </label>
                    <button
                      onClick={() => toggleVisibility(layer.id)}
                      className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      title={layer.visible ? "Hide layer" : "Show layer"}
                    >
                      {layer.visible ? (
                        <Eye className="h-3.5 w-3.5" />
                      ) : (
                        <EyeOff className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => removeLayer(layer.id)}
                      className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      title="Remove layer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Sliders */}
                <div className="space-y-2.5">
                  <SliderRow
                    label="X Offset"
                    value={layer.x}
                    min={-100}
                    max={100}
                    unit="px"
                    onChange={(v) => updateLayer(layer.id, { x: v })}
                  />
                  <SliderRow
                    label="Y Offset"
                    value={layer.y}
                    min={-100}
                    max={100}
                    unit="px"
                    onChange={(v) => updateLayer(layer.id, { y: v })}
                  />
                  <SliderRow
                    label="Blur"
                    value={layer.blur}
                    min={0}
                    max={100}
                    unit="px"
                    onChange={(v) => updateLayer(layer.id, { blur: v })}
                  />
                  <SliderRow
                    label="Spread"
                    value={layer.spread}
                    min={-50}
                    max={50}
                    unit="px"
                    onChange={(v) => updateLayer(layer.id, { spread: v })}
                  />
                  <SliderRow
                    label="Opacity"
                    value={layer.opacity}
                    min={0}
                    max={100}
                    unit="%"
                    onChange={(v) => updateLayer(layer.id, { opacity: v })}
                  />
                </div>

                {/* Color picker */}
                <div className="flex items-center gap-3 pt-1">
                  <label className="w-16 text-xs text-muted-foreground shrink-0">
                    Color
                  </label>
                  <input
                    type="color"
                    value={layer.color}
                    onChange={(e) =>
                      updateLayer(layer.id, { color: e.target.value })
                    }
                    className="w-8 h-8 rounded cursor-pointer border border-border/60 bg-transparent p-0.5"
                  />
                  <span className="text-xs font-mono text-muted-foreground">
                    {layer.color.toUpperCase()}
                  </span>
                  <span className="text-xs text-muted-foreground ml-auto font-mono">
                    {hexToRgba(layer.color, layer.opacity)}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Preview + CSS Panel */}
        <div className="lg:col-span-2 space-y-4">
          {/* Preview Box */}
          <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Preview</h3>
              <button
                onClick={() => setBgDark((d) => !d)}
                className="text-xs px-2 py-1 rounded border border-border/60 bg-muted/40 hover:bg-muted transition-colors"
              >
                {bgDark ? "☀ Light bg" : "☾ Dark bg"}
              </button>
            </div>
            <div
              className={cn(
                "flex items-center justify-center rounded-xl h-52 transition-colors duration-300",
                bgDark ? "bg-zinc-900" : "bg-zinc-100"
              )}
            >
              <div
                className={cn(
                  "w-24 h-24 rounded-xl transition-all duration-150",
                  bgDark ? "bg-zinc-700" : "bg-white"
                )}
                style={{ boxShadow: cssValue }}
              />
            </div>
          </Card>

          {/* CSS Output */}
          <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">CSS Output</h3>
              <Button
                size="sm"
                onClick={handleCopy}
                className={cn(
                  "gap-1.5 text-xs h-7 transition-all",
                  copied
                    ? "bg-green-600 hover:bg-green-600 text-white"
                    : "bg-brand hover:bg-brand/90 text-white"
                )}
              >
                {copied ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
                {copied ? "Copied!" : "Copy CSS"}
              </Button>
            </div>
            <div className="rounded-lg bg-muted/60 border border-border/40 p-3 overflow-x-auto">
              <pre className="text-xs font-mono text-foreground/80 whitespace-pre-wrap break-all">
                <span className="text-brand">box-shadow</span>
                <span className="text-foreground/50">: </span>
                <span>{cssValue}</span>
                <span className="text-foreground/50">;</span>
              </pre>
            </div>
          </Card>

          {/* Quick Tips */}
          <div className="rounded-xl border border-border/40 bg-muted/30 p-4 text-xs text-muted-foreground space-y-1.5">
            <p className="font-medium text-foreground/70 mb-2">Quick tips</p>
            <p>• Multiple layers are comma-separated in CSS</p>
            <p>• Negative spread shrinks the shadow</p>
            <p>• Inset moves the shadow inside the element</p>
            <p>• Zero blur = hard edge shadow</p>
          </div>
        </div>
      </div>
    </div>
  );
}
