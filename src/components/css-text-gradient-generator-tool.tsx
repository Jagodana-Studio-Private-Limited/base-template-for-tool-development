"use client";

import { useState, useCallback, useRef } from "react";
import { Plus, Trash2, Copy, Check, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ToolEvents } from "@/lib/analytics";

type GradientType = "linear" | "radial";

interface ColorStop {
  id: string;
  color: string;
  position: number;
}

const DEFAULT_STOPS: ColorStop[] = [
  { id: "1", color: "#3b82f6", position: 0 },
  { id: "2", color: "#a855f7", position: 100 },
];

const PRESETS: { name: string; stops: { color: string; position: number }[] }[] = [
  {
    name: "Ocean",
    stops: [
      { color: "#06b6d4", position: 0 },
      { color: "#3b82f6", position: 100 },
    ],
  },
  {
    name: "Sunset",
    stops: [
      { color: "#f97316", position: 0 },
      { color: "#ec4899", position: 50 },
      { color: "#8b5cf6", position: 100 },
    ],
  },
  {
    name: "Forest",
    stops: [
      { color: "#10b981", position: 0 },
      { color: "#3b82f6", position: 100 },
    ],
  },
  {
    name: "Fire",
    stops: [
      { color: "#ef4444", position: 0 },
      { color: "#f97316", position: 50 },
      { color: "#eab308", position: 100 },
    ],
  },
  {
    name: "Aurora",
    stops: [
      { color: "#10b981", position: 0 },
      { color: "#3b82f6", position: 33 },
      { color: "#8b5cf6", position: 66 },
      { color: "#ec4899", position: 100 },
    ],
  },
  {
    name: "Rose Gold",
    stops: [
      { color: "#f43f5e", position: 0 },
      { color: "#fb923c", position: 100 },
    ],
  },
];

const FONT_WEIGHTS = [
  { label: "Normal", value: "400" },
  { label: "Medium", value: "500" },
  { label: "Semi Bold", value: "600" },
  { label: "Bold", value: "700" },
  { label: "Extra Bold", value: "800" },
  { label: "Black", value: "900" },
];

function buildGradient(
  type: GradientType,
  stops: ColorStop[],
  angle: number
): string {
  const sorted = [...stops].sort((a, b) => a.position - b.position);
  const stopsStr = sorted
    .map((s) => `${s.color} ${s.position}%`)
    .join(", ");
  if (type === "linear") {
    return `linear-gradient(${angle}deg, ${stopsStr})`;
  }
  return `radial-gradient(circle, ${stopsStr})`;
}

function buildCSS(
  type: GradientType,
  stops: ColorStop[],
  angle: number
): string {
  const gradient = buildGradient(type, stops, angle);
  return `.gradient-text {
  background: ${gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}`;
}

let nextId = 3;

export function CssTextGradientGeneratorTool() {
  const [gradientType, setGradientType] = useState<GradientType>("linear");
  const [stops, setStops] = useState<ColorStop[]>(DEFAULT_STOPS);
  const [angle, setAngle] = useState(135);
  const [previewText, setPreviewText] = useState("Gradient Text");
  const [fontSize, setFontSize] = useState(56);
  const [fontWeight, setFontWeight] = useState("700");
  const [copied, setCopied] = useState(false);
  const colorInputRef = useRef<HTMLInputElement[]>([]);

  const gradient = buildGradient(gradientType, stops, angle);
  const cssOutput = buildCSS(gradientType, stops, angle);

  const updateStop = useCallback(
    (id: string, field: keyof ColorStop, value: string | number) => {
      setStops((prev) =>
        prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
      );
    },
    []
  );

  const addStop = useCallback(() => {
    if (stops.length >= 5) return;
    const mid = Math.round(
      (stops[stops.length - 1].position + stops[stops.length - 2].position) / 2
    );
    setStops((prev) => [
      ...prev,
      { id: String(nextId++), color: "#ffffff", position: mid },
    ]);
  }, [stops]);

  const removeStop = useCallback((id: string) => {
    setStops((prev) => {
      if (prev.length <= 2) return prev;
      return prev.filter((s) => s.id !== id);
    });
  }, []);

  const applyPreset = useCallback(
    (preset: (typeof PRESETS)[number]) => {
      setStops(
        preset.stops.map((s, i) => ({
          id: String(nextId++),
          color: s.color,
          position: s.position,
        }))
      );
      ToolEvents.toolUsed("preset_applied");
    },
    []
  );

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(cssOutput).then(() => {
      setCopied(true);
      toast.success("CSS copied to clipboard!");
      ToolEvents.resultCopied();
      setTimeout(() => setCopied(false), 2000);
    });
  }, [cssOutput]);

  const resetDefaults = useCallback(() => {
    setGradientType("linear");
    setStops([
      { id: String(nextId++), color: "#3b82f6", position: 0 },
      { id: String(nextId++), color: "#a855f7", position: 100 },
    ]);
    setAngle(135);
    setPreviewText("Gradient Text");
    setFontSize(56);
    setFontWeight("700");
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Preview */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-2xl border border-border/50 bg-muted/30 p-8 flex flex-col items-center justify-center min-h-[180px] text-center gap-4"
      >
        <p
          style={{
            background: gradient,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            fontSize: `${fontSize}px`,
            fontWeight,
            lineHeight: 1.2,
            wordBreak: "break-word",
            maxWidth: "100%",
          }}
        >
          {previewText || "Gradient Text"}
        </p>
        <input
          type="text"
          value={previewText}
          onChange={(e) => setPreviewText(e.target.value)}
          placeholder="Type preview text..."
          className="text-center text-sm bg-transparent border-b border-border/50 outline-none text-muted-foreground w-full max-w-xs focus:border-brand transition-colors"
          maxLength={80}
        />
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Controls */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-border/50 bg-card p-6 space-y-6"
        >
          {/* Gradient Type */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Gradient Type
            </label>
            <div className="flex gap-2">
              {(["linear", "radial"] as GradientType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setGradientType(type)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all capitalize ${
                    gradientType === type
                      ? "bg-brand text-white border-brand shadow-sm shadow-brand/25"
                      : "bg-muted/50 border-border/50 text-muted-foreground hover:border-brand/50"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Color Stops */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold">Color Stops</label>
              <button
                onClick={addStop}
                disabled={stops.length >= 5}
                className="flex items-center gap-1 text-xs text-brand hover:text-brand-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Stop
              </button>
            </div>

            <div className="space-y-3">
              {stops.map((stop, i) => (
                <div key={stop.id} className="flex items-center gap-3">
                  {/* Color picker */}
                  <div className="relative">
                    <input
                      type="color"
                      value={stop.color}
                      onChange={(e) =>
                        updateStop(stop.id, "color", e.target.value)
                      }
                      className="absolute inset-0 opacity-0 cursor-pointer w-10 h-10"
                    />
                    <div
                      className="w-10 h-10 rounded-lg border border-border/50 cursor-pointer shadow-sm"
                      style={{ backgroundColor: stop.color }}
                    />
                  </div>
                  {/* Hex input */}
                  <input
                    type="text"
                    value={stop.color}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (/^#[0-9a-fA-F]{0,6}$/.test(v)) {
                        updateStop(stop.id, "color", v);
                      }
                    }}
                    className="w-24 text-xs font-mono bg-muted/50 border border-border/50 rounded-lg px-2 py-1.5 outline-none focus:border-brand transition-colors"
                    maxLength={7}
                  />
                  {/* Position */}
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={stop.position}
                      onChange={(e) =>
                        updateStop(stop.id, "position", Number(e.target.value))
                      }
                      className="flex-1 accent-brand"
                    />
                    <span className="text-xs text-muted-foreground w-8 text-right">
                      {stop.position}%
                    </span>
                  </div>
                  {/* Remove */}
                  <button
                    onClick={() => removeStop(stop.id)}
                    disabled={stops.length <= 2}
                    className="text-muted-foreground hover:text-destructive disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    aria-label="Remove stop"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Angle (linear only) */}
          {gradientType === "linear" && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold">Angle</label>
                <span className="text-sm text-muted-foreground font-mono">
                  {angle}°
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={360}
                value={angle}
                onChange={(e) => setAngle(Number(e.target.value))}
                className="w-full accent-brand"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0° →</span>
                <span>90° ↓</span>
                <span>180° ←</span>
                <span>270° ↑</span>
                <span>360° →</span>
              </div>
            </div>
          )}

          {/* Font Size */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold">Font Size</label>
              <span className="text-sm text-muted-foreground font-mono">
                {fontSize}px
              </span>
            </div>
            <input
              type="range"
              min={16}
              max={120}
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full accent-brand"
            />
          </div>

          {/* Font Weight */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Font Weight
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {FONT_WEIGHTS.map((w) => (
                <button
                  key={w.value}
                  onClick={() => setFontWeight(w.value)}
                  className={`py-1.5 rounded-lg text-xs border transition-all ${
                    fontWeight === w.value
                      ? "bg-brand text-white border-brand"
                      : "bg-muted/50 border-border/50 text-muted-foreground hover:border-brand/50"
                  }`}
                  style={{ fontWeight: w.value }}
                >
                  {w.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right: Presets + CSS Output */}
        <div className="space-y-6">
          {/* Presets */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl border border-border/50 bg-card p-6"
          >
            <label className="block text-sm font-semibold mb-3">Presets</label>
            <div className="grid grid-cols-3 gap-2">
              {PRESETS.map((preset) => {
                const sorted = [...preset.stops].sort(
                  (a, b) => a.position - b.position
                );
                const previewGrad = `linear-gradient(135deg, ${sorted
                  .map((s) => `${s.color} ${s.position}%`)
                  .join(", ")})`;
                return (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset)}
                    className="group relative rounded-xl overflow-hidden border border-border/50 hover:border-brand/50 transition-all"
                    title={preset.name}
                  >
                    <div
                      className="h-10 w-full"
                      style={{ background: previewGrad }}
                    />
                    <div className="text-xs text-center py-1.5 text-muted-foreground group-hover:text-foreground transition-colors">
                      {preset.name}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* CSS Output */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-border/50 bg-card p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold">Generated CSS</label>
              <div className="flex gap-2">
                <button
                  onClick={resetDefaults}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  title="Reset to defaults"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Reset
                </button>
              </div>
            </div>

            <pre className="bg-muted/50 rounded-xl p-4 text-xs font-mono text-foreground overflow-x-auto leading-relaxed border border-border/30 select-all">
              {cssOutput}
            </pre>

            <Button
              onClick={handleCopy}
              className="w-full gap-2 bg-gradient-to-r from-brand to-brand-accent text-white shadow-md shadow-brand/25"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy CSS
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
