"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, ArrowRight, RotateCcw, Copy, Check, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ToolEvents } from "@/lib/analytics";

// ─── Specificity Types ────────────────────────────────────────────────────────

type PartType = "id" | "class" | "attribute" | "pseudo-class" | "element" | "pseudo-element";

interface SpecificityPart {
  type: PartType;
  value: string;
  a: number;
  b: number;
  c: number;
}

interface SpecificityResult {
  a: number;
  b: number;
  c: number;
  parts: SpecificityPart[];
  error?: string;
}

// ─── Specificity Engine ───────────────────────────────────────────────────────

function calcSpecificity(raw: string): SpecificityResult {
  if (!raw.trim()) return { a: 0, b: 0, c: 0, parts: [] };

  let a = 0, b = 0, c = 0;
  const parts: SpecificityPart[] = [];

  try {
    // Strip comments
    let s = raw.replace(/\/\*[\s\S]*?\*\//g, "").trim();

    // Handle comma-separated selectors — return highest specificity
    if (s.includes(",")) {
      const candidates = splitTopLevel(s, ",").map((sel) => calcSpecificity(sel.trim()));
      const best = candidates.reduce((max, cur) =>
        specifTotal(cur) > specifTotal(max) ? cur : max
      );
      return best;
    }

    // :where() → contributes 0 specificity; strip it (keep nothing)
    s = replaceNestedFn(s, "where", () => "");

    // :is(), :not(), :has() → take specificity of most specific argument
    const expandedFnParts: SpecificityPart[] = [];
    s = replaceNestedFn(s, "is|not|has", (fnMatch, inner) => {
      const argSpecificities = splitTopLevel(inner, ",").map((arg) =>
        calcSpecificity(arg.trim())
      );
      const best = argSpecificities.reduce((max, cur) =>
        specifTotal(cur) > specifTotal(max) ? cur : max
      );
      a += best.a;
      b += best.b;
      c += best.c;
      best.parts.forEach((p) => expandedFnParts.push(p));
      return "";
    });
    expandedFnParts.forEach((p) => parts.push(p));

    // ID selectors
    s = s.replace(/#([\w-]+)/g, (match) => {
      a++;
      parts.push({ type: "id", value: match, a: 1, b: 0, c: 0 });
      return "";
    });

    // Attribute selectors [attr...]
    s = s.replace(/\[([^\]]*)\]/g, (match) => {
      b++;
      parts.push({ type: "attribute", value: match, a: 0, b: 1, c: 0 });
      return "";
    });

    // Pseudo-elements (:: or legacy single-colon)
    const pseudoElements = new Set([
      "before", "after", "first-line", "first-letter", "selection",
      "placeholder", "marker", "backdrop", "file-selector-button",
      "spelling-error", "grammar-error", "cue", "cue-region",
    ]);
    s = s.replace(/:{1,2}([\w-]+)(?:\([^)]*\))?/g, (match, name) => {
      if (match.startsWith("::") || pseudoElements.has(name)) {
        c++;
        parts.push({ type: "pseudo-element", value: match, a: 0, b: 0, c: 1 });
        return "";
      }
      return match;
    });

    // Class selectors
    s = s.replace(/\.([\w-]+)/g, (match) => {
      b++;
      parts.push({ type: "class", value: match, a: 0, b: 1, c: 0 });
      return "";
    });

    // Remaining pseudo-classes
    s = s.replace(/:([\w-]+)(?:\([^)]*\))?/g, (match) => {
      b++;
      parts.push({ type: "pseudo-class", value: match, a: 0, b: 1, c: 0 });
      return "";
    });

    // Remove combinators, universal selector, whitespace
    s = s.replace(/[>~+|]/g, " ").replace(/\*/g, " ");

    // Type selectors (elements)
    const tokens = s.match(/[a-zA-Z][\w-]*/g) ?? [];
    tokens.forEach((el) => {
      c++;
      parts.push({ type: "element", value: el, a: 0, b: 0, c: 1 });
    });

    return { a, b, c, parts };
  } catch {
    return { a: 0, b: 0, c: 0, parts: [], error: "Invalid selector" };
  }
}

function specifTotal(r: SpecificityResult) {
  return r.a * 1_000_000 + r.b * 1_000 + r.c;
}

function splitTopLevel(s: string, sep: string): string[] {
  const result: string[] = [];
  let depth = 0, start = 0;
  const re = new RegExp(sep);
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "(") depth++;
    else if (s[i] === ")") depth--;
    else if (depth === 0 && re.test(s[i])) {
      result.push(s.slice(start, i));
      start = i + 1;
    }
  }
  result.push(s.slice(start));
  return result;
}

function replaceNestedFn(
  s: string,
  fns: string,
  replacer: (match: string, inner: string) => string
): string {
  const re = new RegExp(`:(?:${fns})\\(`, "g");
  let result = s;
  let match: RegExpExecArray | null;
  while ((match = re.exec(result)) !== null) {
    const start = match.index + match[0].length - 1; // index of opening (
    let depth = 1, i = start + 1;
    while (i < result.length && depth > 0) {
      if (result[i] === "(") depth++;
      else if (result[i] === ")") depth--;
      i++;
    }
    const inner = result.slice(start + 1, i - 1);
    const fullMatch = result.slice(match.index, i);
    const replacement = replacer(fullMatch, inner);
    result = result.slice(0, match.index) + replacement + result.slice(i);
    re.lastIndex = match.index + replacement.length;
  }
  return result;
}

// ─── UI Helpers ───────────────────────────────────────────────────────────────

const PART_COLORS: Record<PartType, { bg: string; text: string; label: string }> = {
  id:             { bg: "bg-amber-100 dark:bg-amber-900/30",  text: "text-amber-700 dark:text-amber-400",  label: "ID" },
  class:          { bg: "bg-blue-100 dark:bg-blue-900/30",    text: "text-blue-700 dark:text-blue-400",    label: "Class" },
  attribute:      { bg: "bg-cyan-100 dark:bg-cyan-900/30",    text: "text-cyan-700 dark:text-cyan-400",    label: "Attr" },
  "pseudo-class": { bg: "bg-green-100 dark:bg-green-900/30",  text: "text-green-700 dark:text-green-400",  label: "Pseudo-class" },
  element:        { bg: "bg-slate-100 dark:bg-slate-800/60",  text: "text-slate-600 dark:text-slate-400",  label: "Element" },
  "pseudo-element":{ bg: "bg-purple-100 dark:bg-purple-900/30",text: "text-purple-700 dark:text-purple-400",label: "Pseudo-el" },
};

const EXAMPLES = [
  "div",
  ".active",
  "#header",
  "a:hover",
  "ul li > a",
  ".nav > li.active",
  "#header .nav > li a:hover",
  "input[type='text']",
  "h1 + p::first-line",
  ":nth-child(2n+1)",
];

// ─── Score Display ─────────────────────────────────────────────────────────────

function ScoreBox({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <motion.div
        key={value}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={cn(
          "w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl font-bold border-2",
          color
        )}
      >
        {value}
      </motion.div>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
    </div>
  );
}

function SpecificityDisplay({ result, selector }: { result: SpecificityResult; selector: string }) {
  const [showBreakdown, setShowBreakdown] = useState(true);

  if (!selector) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Score row */}
      <div className="flex items-center justify-center gap-4 sm:gap-6 py-4">
        <ScoreBox
          label="IDs (a)"
          value={result.a}
          color="border-amber-300 dark:border-amber-600 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400"
        />
        <span className="text-2xl text-muted-foreground font-light">,</span>
        <ScoreBox
          label="Classes (b)"
          value={result.b}
          color="border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400"
        />
        <span className="text-2xl text-muted-foreground font-light">,</span>
        <ScoreBox
          label="Elements (c)"
          value={result.c}
          color="border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-950/30 text-slate-600 dark:text-slate-400"
        />
      </div>

      {/* Annotated selector */}
      <div className="rounded-xl bg-muted/40 border border-border/50 px-4 py-3 font-mono text-sm flex flex-wrap gap-1.5 items-center min-h-[44px]">
        {result.parts.length === 0 ? (
          <span className="text-muted-foreground italic">universal / no specificity</span>
        ) : (
          result.parts.map((part, i) => {
            const col = PART_COLORS[part.type];
            return (
              <span
                key={i}
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-mono font-semibold",
                  col.bg,
                  col.text
                )}
                title={col.label}
              >
                {part.value}
                <span className="opacity-60 font-normal text-[10px]">{col.label}</span>
              </span>
            );
          })
        )}
      </div>

      {/* Breakdown toggle */}
      {result.parts.length > 0 && (
        <div>
          <button
            onClick={() => setShowBreakdown((v) => !v)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {showBreakdown ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            {showBreakdown ? "Hide" : "Show"} breakdown
          </button>

          <AnimatePresence>
            {showBreakdown && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-2 rounded-xl border border-border/50 divide-y divide-border/40">
                  {result.parts.map((part, i) => {
                    const col = PART_COLORS[part.type];
                    return (
                      <div
                        key={i}
                        className="flex items-center justify-between px-4 py-2 text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <span className={cn("text-xs px-1.5 py-0.5 rounded font-medium", col.bg, col.text)}>
                            {col.label}
                          </span>
                          <code className="font-mono text-foreground/80">{part.value}</code>
                        </div>
                        <span className="font-mono text-xs text-muted-foreground">
                          ({part.a},{part.b},{part.c})
                        </span>
                      </div>
                    );
                  })}
                  <div className="flex items-center justify-between px-4 py-2 text-sm font-semibold bg-muted/30">
                    <span>Total</span>
                    <span className="font-mono text-brand">
                      ({result.a},{result.b},{result.c})
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}

// ─── Main Tool ────────────────────────────────────────────────────────────────

export function CssSpecificityCalculatorTool() {
  const [singleInput, setSingleInput] = useState("");
  const [compareA, setCompareA] = useState("");
  const [compareB, setCompareB] = useState("");
  const [copied, setCopied] = useState(false);

  const singleResult = calcSpecificity(singleInput);
  const resultA = calcSpecificity(compareA);
  const resultB = calcSpecificity(compareB);

  const totalA = specifTotal(resultA);
  const totalB = specifTotal(resultB);
  const winner =
    !compareA && !compareB
      ? null
      : totalA > totalB
      ? "A"
      : totalA < totalB
      ? "B"
      : "tie";

  const handleCopy = useCallback(() => {
    const score = `(${singleResult.a},${singleResult.b},${singleResult.c})`;
    navigator.clipboard.writeText(`${singleInput} — specificity ${score}`);
    setCopied(true);
    toast.success("Copied to clipboard!");
    ToolEvents.resultCopied();
    setTimeout(() => setCopied(false), 2000);
  }, [singleInput, singleResult]);

  const handleExample = useCallback((ex: string) => {
    setSingleInput(ex);
    ToolEvents.toolUsed("example");
  }, []);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Tabs defaultValue="single">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="single">Single Selector</TabsTrigger>
          <TabsTrigger value="compare">Compare Two</TabsTrigger>
        </TabsList>

        {/* ── Single Mode ── */}
        <TabsContent value="single" className="space-y-4 mt-4">
          <div className="relative">
            <div className="flex items-center gap-2 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              <Code2 className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={singleInput}
              onChange={(e) => {
                setSingleInput(e.target.value);
                ToolEvents.toolUsed("input");
              }}
              placeholder="e.g. #nav .menu > li:hover"
              className="w-full h-12 pl-10 pr-28 rounded-xl border border-border bg-background font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
              spellCheck={false}
              autoComplete="off"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
              {singleInput && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => setSingleInput("")}
                  aria-label="Clear"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </Button>
              )}
              {singleInput && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={handleCopy}
                  aria-label="Copy result"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                </Button>
              )}
            </div>
          </div>

          {singleResult.error ? (
            <p className="text-sm text-destructive px-1">{singleResult.error}</p>
          ) : (
            <SpecificityDisplay result={singleResult} selector={singleInput} />
          )}

          {/* Legend */}
          <div className="flex flex-wrap gap-2 pt-2">
            {(Object.entries(PART_COLORS) as [PartType, typeof PART_COLORS[PartType]][]).map(([type, col]) => (
              <span
                key={type}
                className={cn("text-xs px-2 py-0.5 rounded-full font-medium", col.bg, col.text)}
              >
                {col.label}
              </span>
            ))}
          </div>

          {/* Examples */}
          <div>
            <p className="text-xs text-muted-foreground mb-2 font-medium">Try an example:</p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  onClick={() => handleExample(ex)}
                  className="text-xs font-mono px-2.5 py-1 rounded-lg border border-border/60 bg-muted/30 hover:bg-muted hover:border-brand/40 transition-colors text-muted-foreground hover:text-foreground"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ── Compare Mode ── */}
        <TabsContent value="compare" className="space-y-4 mt-4">
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Selector A */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-brand text-white text-xs flex items-center justify-center font-bold">A</span>
                Selector A
              </label>
              <input
                type="text"
                value={compareA}
                onChange={(e) => setCompareA(e.target.value)}
                placeholder="e.g. #header nav a"
                className={cn(
                  "w-full h-11 px-3 rounded-xl border bg-background font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand/40",
                  winner === "A" ? "border-green-400 dark:border-green-500" : "border-border"
                )}
                spellCheck={false}
              />
              {compareA && (
                <div className="text-center">
                  <span className="inline-block font-mono font-bold text-lg text-foreground">
                    ({resultA.a},{resultA.b},{resultA.c})
                  </span>
                  {winner === "A" && (
                    <span className="ml-2 text-xs text-green-600 dark:text-green-400 font-semibold">✓ Wins</span>
                  )}
                </div>
              )}
            </div>

            {/* VS divider */}
            <div className="hidden sm:flex items-center justify-center absolute left-1/2 mt-6 -translate-x-1/2">
              <span className="text-xs font-bold text-muted-foreground/50 absolute">vs</span>
            </div>

            {/* Selector B */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-brand-accent text-white text-xs flex items-center justify-center font-bold">B</span>
                Selector B
              </label>
              <input
                type="text"
                value={compareB}
                onChange={(e) => setCompareB(e.target.value)}
                placeholder="e.g. .nav-link:hover"
                className={cn(
                  "w-full h-11 px-3 rounded-xl border bg-background font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand/40",
                  winner === "B" ? "border-green-400 dark:border-green-500" : "border-border"
                )}
                spellCheck={false}
              />
              {compareB && (
                <div className="text-center">
                  <span className="inline-block font-mono font-bold text-lg text-foreground">
                    ({resultB.a},{resultB.b},{resultB.c})
                  </span>
                  {winner === "B" && (
                    <span className="ml-2 text-xs text-green-600 dark:text-green-400 font-semibold">✓ Wins</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Winner banner */}
          <AnimatePresence>
            {winner && (compareA || compareB) && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={cn(
                  "rounded-xl px-4 py-3 text-center text-sm font-semibold border",
                  winner === "tie"
                    ? "bg-muted/40 border-border text-muted-foreground"
                    : "bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-700 text-green-700 dark:text-green-400"
                )}
              >
                {winner === "tie"
                  ? "⚖️ Equal specificity — source order decides"
                  : winner === "A"
                  ? `🏆 Selector A wins — (${resultA.a},${resultA.b},${resultA.c}) beats (${resultB.a},${resultB.b},${resultB.c})`
                  : `🏆 Selector B wins — (${resultB.a},${resultB.b},${resultB.c}) beats (${resultA.a},${resultA.b},${resultA.c})`}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Side-by-side breakdowns */}
          {(compareA || compareB) && (
            <div className="grid sm:grid-cols-2 gap-4">
              {compareA && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">A breakdown</p>
                  <SpecificityDisplay result={resultA} selector={compareA} />
                </div>
              )}
              {compareB && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">B breakdown</p>
                  <SpecificityDisplay result={resultB} selector={compareB} />
                </div>
              )}
            </div>
          )}

          {/* Quick compare examples */}
          {!compareA && !compareB && (
            <div className="space-y-2 pt-2">
              <p className="text-xs text-muted-foreground font-medium">Quick compare examples:</p>
              <div className="flex flex-col gap-2">
                {[
                  ["#nav a", ".nav-link"],
                  ["div p a", ".content a:hover"],
                  ["#header .nav > li", "nav ul li"],
                ].map(([a, b], i) => (
                  <button
                    key={i}
                    onClick={() => { setCompareA(a); setCompareB(b); }}
                    className="flex items-center gap-2 text-xs font-mono px-3 py-2 rounded-lg border border-border/60 bg-muted/30 hover:bg-muted transition-colors w-full text-left"
                  >
                    <span className="text-muted-foreground">{a}</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                    <span className="text-muted-foreground">vs</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                    <span className="text-muted-foreground">{b}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Specificity reference card */}
      <div className="rounded-xl border border-border/50 bg-muted/20 p-4 text-xs space-y-3">
        <p className="font-semibold text-muted-foreground uppercase tracking-wide text-[10px]">Specificity Quick Reference</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { example: "#id", score: "(1,0,0)", note: "ID selector" },
            { example: ".class", score: "(0,1,0)", note: "Class selector" },
            { example: "[attr]", score: "(0,1,0)", note: "Attribute selector" },
            { example: ":hover", score: "(0,1,0)", note: "Pseudo-class" },
            { example: "div", score: "(0,0,1)", note: "Type selector" },
            { example: "::before", score: "(0,0,1)", note: "Pseudo-element" },
            { example: "*", score: "(0,0,0)", note: "Universal" },
            { example: ":where()", score: "(0,0,0)", note: "No specificity" },
            { example: "> + ~", score: "(0,0,0)", note: "Combinators" },
          ].map(({ example, score, note }) => (
            <div key={example} className="flex items-center gap-2">
              <code className="font-mono text-foreground/70 shrink-0">{example}</code>
              <span className="text-muted-foreground/60">→</span>
              <span className="font-mono text-brand font-semibold shrink-0">{score}</span>
              <span className="text-muted-foreground/50 hidden sm:inline truncate">{note}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
