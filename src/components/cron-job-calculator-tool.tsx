"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, AlertCircle, Calendar, Clock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ToolEvents } from "@/lib/analytics";

// ── Types ──────────────────────────────────────────────────────────────────────

interface CronField {
  raw: string;
  label: string;
  min: number;
  max: number;
  names?: string[];
}

interface ParseResult {
  valid: boolean;
  description: string;
  nextRuns: Date[];
  error?: string;
  fields?: CronField[];
  expression: string;
}

// ── Presets ────────────────────────────────────────────────────────────────────

const PRESETS: { label: string; value: string; description: string }[] = [
  { label: "Every minute", value: "* * * * *", description: "Runs every minute" },
  { label: "Every 5 minutes", value: "*/5 * * * *", description: "Runs every 5 minutes" },
  { label: "Every 15 minutes", value: "*/15 * * * *", description: "Runs every 15 minutes" },
  { label: "Every 30 minutes", value: "*/30 * * * *", description: "Runs every 30 minutes" },
  { label: "Every hour", value: "0 * * * *", description: "Runs at the start of every hour" },
  { label: "Every 6 hours", value: "0 */6 * * *", description: "Runs every 6 hours" },
  { label: "Daily at midnight", value: "0 0 * * *", description: "Runs at 00:00 every day" },
  { label: "Daily at 9 AM", value: "0 9 * * *", description: "Runs at 09:00 every day" },
  { label: "Daily at noon", value: "0 12 * * *", description: "Runs at 12:00 every day" },
  { label: "Every weekday at 9 AM", value: "0 9 * * 1-5", description: "Runs Mon–Fri at 09:00" },
  { label: "Every Sunday", value: "0 0 * * 0", description: "Runs at midnight every Sunday" },
  { label: "Weekly (Monday)", value: "0 0 * * 1", description: "Runs at midnight every Monday" },
  { label: "Monthly (1st)", value: "0 0 1 * *", description: "Runs at midnight on the 1st of each month" },
  { label: "Quarterly", value: "0 0 1 */3 *", description: "Runs at midnight on the 1st of every 3rd month" },
  { label: "Yearly (Jan 1)", value: "0 0 1 1 *", description: "Runs at midnight on January 1st" },
];

const SPECIAL_PRESETS: { label: string; value: string; description: string }[] = [
  { label: "@yearly", value: "@yearly", description: "Run once a year (Jan 1 at midnight)" },
  { label: "@monthly", value: "@monthly", description: "Run once a month (1st at midnight)" },
  { label: "@weekly", value: "@weekly", description: "Run once a week (Sunday midnight)" },
  { label: "@daily", value: "@daily", description: "Run once a day (midnight)" },
  { label: "@midnight", value: "@midnight", description: "Run at midnight daily" },
  { label: "@hourly", value: "@hourly", description: "Run once an hour" },
];

// ── Parser ─────────────────────────────────────────────────────────────────────

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DOW_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const DOW_FULL = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const MONTH_FULL = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function resolveSpecial(expr: string): string | null {
  const map: Record<string, string> = {
    "@yearly": "0 0 1 1 *",
    "@annually": "0 0 1 1 *",
    "@monthly": "0 0 1 * *",
    "@weekly": "0 0 * * 0",
    "@daily": "0 0 * * *",
    "@midnight": "0 0 * * *",
    "@hourly": "0 * * * *",
  };
  return map[expr.toLowerCase().trim()] ?? null;
}

function parseField(raw: string, min: number, max: number, names?: string[]): number[] | null {
  const resolved = names
    ? raw.replace(/[a-z]+/gi, (m) => {
        const i = names.findIndex((n) => n.toLowerCase() === m.toLowerCase());
        return i >= 0 ? String(i + min) : m;
      })
    : raw;

  const result = new Set<number>();

  for (const part of resolved.split(",")) {
    if (part === "*") {
      for (let i = min; i <= max; i++) result.add(i);
      continue;
    }

    const stepMatch = part.match(/^(\*|\d+(?:-\d+)?)\/([\d]+)$/);
    if (stepMatch) {
      const step = parseInt(stepMatch[2], 10);
      if (isNaN(step) || step <= 0) return null;
      const rangeStr = stepMatch[1];
      let start = min;
      let end = max;
      if (rangeStr !== "*") {
        const parts = rangeStr.split("-");
        start = parseInt(parts[0], 10);
        end = parts[1] ? parseInt(parts[1], 10) : max;
        if (isNaN(start) || isNaN(end) || start < min || end > max) return null;
      }
      for (let i = start; i <= end; i += step) result.add(i);
      continue;
    }

    const rangeMatch = part.match(/^(\d+)-(\d+)$/);
    if (rangeMatch) {
      const a = parseInt(rangeMatch[1], 10);
      const b = parseInt(rangeMatch[2], 10);
      if (isNaN(a) || isNaN(b) || a < min || b > max || a > b) return null;
      for (let i = a; i <= b; i++) result.add(i);
      continue;
    }

    const num = parseInt(part, 10);
    if (isNaN(num) || num < min || num > max) return null;
    result.add(num);
  }

  return [...result].sort((a, b) => a - b);
}

function describeField(raw: string, label: string, min: number, max: number, names?: string[]): string {
  if (raw === "*") return "";
  const vals = parseField(raw, min, max, names);
  if (!vals || vals.length === 0) return `invalid ${label}`;

  if (raw.startsWith("*/")) {
    const step = parseInt(raw.slice(2), 10);
    return `every ${step} ${label}${step > 1 ? "s" : ""}`;
  }

  const display = names
    ? vals.map((v) => names[v - min] ?? v)
    : vals.map((v) => {
        if (label === "hour") return `${String(v).padStart(2, "0")}:00`;
        if (label === "minute") return String(v).padStart(2, "0");
        return String(v);
      });

  if (display.length === 1) return `at ${label} ${display[0]}`;
  if (display.length === 2) return `on ${label}s ${display[0]} and ${display[1]}`;
  return `on ${label}s ${display.slice(0, -1).join(", ")} and ${display[display.length - 1]}`;
}

function buildDescription(minute: string, hour: string, dom: string, month: string, dow: string): string {
  const isEvery = (f: string) => f === "*";
  const hasStep = (f: string) => f.startsWith("*/");

  // All wildcards
  if (isEvery(minute) && isEvery(hour) && isEvery(dom) && isEvery(month) && isEvery(dow)) {
    return "Runs every minute";
  }

  // Minute step with all others wildcard
  if (hasStep(minute) && isEvery(hour) && isEvery(dom) && isEvery(month) && isEvery(dow)) {
    const step = parseInt(minute.slice(2), 10);
    return `Runs every ${step} minute${step > 1 ? "s" : ""}`;
  }

  // Hourly with minute=0
  if (minute === "0" && isEvery(hour) && isEvery(dom) && isEvery(month) && isEvery(dow)) {
    return "Runs at the start of every hour";
  }

  // Hour step
  if (minute === "0" && hasStep(hour) && isEvery(dom) && isEvery(month) && isEvery(dow)) {
    const step = parseInt(hour.slice(2), 10);
    return `Runs every ${step} hours (at :00)`;
  }

  // Specific time every day
  if (!hasStep(minute) && !hasStep(hour) && isEvery(dom) && isEvery(month) && isEvery(dow)) {
    const mins = parseField(minute, 0, 59);
    const hrs = parseField(hour, 0, 23);
    if (mins && hrs) {
      const times = hrs.flatMap((h) => mins.map((m) => `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`));
      if (times.length === 1) return `Runs daily at ${times[0]}`;
      return `Runs daily at ${times.join(", ")}`;
    }
  }

  // Weekday schedule
  if (isEvery(dom) && isEvery(month) && !isEvery(dow)) {
    const mins = parseField(minute, 0, 59);
    const hrs = parseField(hour, 0, 23);
    const days = parseField(dow, 0, 6, DOW_NAMES);
    if (mins && hrs && days) {
      const timeStr =
        mins.length === 1 && hrs.length === 1
          ? `${String(hrs[0]).padStart(2,"0")}:${String(mins[0]).padStart(2,"0")}`
          : "specified time";
      const dayNames = days.map((d) => DOW_FULL[d]);
      let dayStr: string;
      if (days.length === 7) dayStr = "every day";
      else if (JSON.stringify(days) === JSON.stringify([1,2,3,4,5])) dayStr = "weekdays (Mon–Fri)";
      else if (JSON.stringify(days) === JSON.stringify([0,6])) dayStr = "weekends";
      else if (dayNames.length === 1) dayStr = `every ${dayNames[0]}`;
      else dayStr = `${dayNames.slice(0,-1).join(", ")} and ${dayNames[dayNames.length-1]}`;
      return `Runs at ${timeStr} on ${dayStr}`;
    }
  }

  // Monthly schedule
  if (isEvery(month) && isEvery(dow) && !isEvery(dom)) {
    const mins = parseField(minute, 0, 59);
    const hrs = parseField(hour, 0, 23);
    const doms = parseField(dom, 1, 31);
    if (mins && hrs && doms) {
      const timeStr =
        mins.length === 1 && hrs.length === 1
          ? `${String(hrs[0]).padStart(2,"0")}:${String(mins[0]).padStart(2,"0")}`
          : "specified time";
      const domStr = doms.length === 1 ? `the ${ordinal(doms[0])}` : `days ${doms.join(", ")}`;
      return `Runs at ${timeStr} on ${domStr} of every month`;
    }
  }

  // Yearly
  if (!isEvery(month) && !isEvery(dom)) {
    const mos = parseField(month, 1, 12, MONTH_NAMES);
    const doms = parseField(dom, 1, 31);
    const mins = parseField(minute, 0, 59);
    const hrs = parseField(hour, 0, 23);
    if (mos && doms && mins && hrs) {
      const timeStr =
        mins.length === 1 && hrs.length === 1
          ? `${String(hrs[0]).padStart(2,"0")}:${String(mins[0]).padStart(2,"0")}`
          : "specified time";
      const moStr = mos.map((m) => MONTH_FULL[m - 1]).join(", ");
      const domStr = doms.length === 1 ? `the ${ordinal(doms[0])}` : `days ${doms.join(", ")}`;
      return `Runs at ${timeStr} on ${domStr} of ${moStr}`;
    }
  }

  // Fallback: build generic description
  const parts: string[] = [];
  if (!isEvery(minute)) {
    if (hasStep(minute)) parts.push(describeField(minute, "minute", 0, 59));
    else {
      const mins = parseField(minute, 0, 59);
      if (mins) parts.push(`minute${mins.length > 1 ? "s" : ""} ${mins.map((m) => String(m).padStart(2,"0")).join(", ")}`);
    }
  }
  if (!isEvery(hour)) {
    const hrs = parseField(hour, 0, 23);
    if (hrs) parts.push(`hour${hrs.length > 1 ? "s" : ""} ${hrs.map((h) => String(h).padStart(2,"0")).join(", ")}`);
  }
  if (!isEvery(dow)) {
    const days = parseField(dow, 0, 6, DOW_NAMES);
    if (days) parts.push(`on ${days.map((d) => DOW_FULL[d]).join(", ")}`);
  } else if (!isEvery(dom)) {
    const doms = parseField(dom, 1, 31);
    if (doms) parts.push(`on day${doms.length > 1 ? "s" : ""} ${doms.join(", ")} of the month`);
  }
  if (!isEvery(month)) {
    const mos = parseField(month, 1, 12, MONTH_NAMES);
    if (mos) parts.push(`in ${mos.map((m) => MONTH_FULL[m - 1]).join(", ")}`);
  }

  return parts.length ? `Runs at ${parts.join(", ")}` : "Runs on a custom schedule";
}

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] ?? s[v] ?? s[0]);
}

function computeNextRuns(minute: string, hour: string, dom: string, month: string, dow: string, count = 10): Date[] {
  const minutes = parseField(minute, 0, 59);
  const hours = parseField(hour, 0, 23);
  const doms = parseField(dom, 1, 31);
  const months = parseField(month, 1, 12, MONTH_NAMES);
  const dows = parseField(dow, 0, 6, DOW_NAMES);

  if (!minutes || !hours || !doms || !months || !dows) return [];

  const domWild = dom === "*";
  const dowWild = dow === "*";

  const runs: Date[] = [];
  const now = new Date();
  const start = new Date(now);
  start.setSeconds(0, 0);
  start.setMinutes(start.getMinutes() + 1);

  let current = new Date(start);
  const maxIter = 366 * 24 * 60 * 4;
  let iter = 0;

  while (runs.length < count && iter < maxIter) {
    iter++;

    const m = current.getMonth() + 1;
    const d = current.getDate();
    const wd = current.getDay();
    const h = current.getHours();
    const min = current.getMinutes();

    if (!months.includes(m)) {
      current = new Date(current);
      current.setDate(1);
      current.setMonth(current.getMonth() + 1);
      current.setHours(0, 0, 0, 0);
      continue;
    }

    const domOk = domWild || doms.includes(d);
    const dowOk = dowWild || dows.includes(wd);
    const dayOk = (!domWild && !dowWild) ? (domOk || dowOk) : (domOk && dowOk);

    if (!dayOk) {
      current = new Date(current);
      current.setDate(current.getDate() + 1);
      current.setHours(0, 0, 0, 0);
      continue;
    }

    if (!hours.includes(h)) {
      const nextHour = hours.find((hv) => hv > h);
      if (nextHour !== undefined) {
        current = new Date(current);
        current.setHours(nextHour, 0, 0, 0);
      } else {
        current = new Date(current);
        current.setDate(current.getDate() + 1);
        current.setHours(0, 0, 0, 0);
      }
      continue;
    }

    const nextMin = minutes.find((mv) => mv >= min);
    if (nextMin === undefined) {
      current = new Date(current);
      current.setHours(current.getHours() + 1, 0, 0, 0);
      continue;
    }

    if (nextMin !== min) {
      current = new Date(current);
      current.setMinutes(nextMin, 0, 0);
      continue;
    }

    runs.push(new Date(current));
    current = new Date(current);
    current.setMinutes(current.getMinutes() + 1, 0, 0);
  }

  return runs;
}

function parseCron(expression: string): ParseResult {
  const trimmed = expression.trim();

  if (!trimmed) {
    return { valid: false, description: "", nextRuns: [], error: "Enter a cron expression", expression: trimmed };
  }

  const resolved = resolveSpecial(trimmed) ?? trimmed;
  const parts = resolved.split(/\s+/);

  if (parts.length < 5 || parts.length > 6) {
    return {
      valid: false,
      description: "",
      nextRuns: [],
      error: `Expected 5 fields (got ${parts.length}): minute hour day-of-month month day-of-week`,
      expression: trimmed,
    };
  }

  const [minute, hour, dom, month, dow] = parts.slice(parts.length - 5);

  const fieldDefs = [
    { raw: minute, label: "minute", min: 0, max: 59 },
    { raw: hour, label: "hour", min: 0, max: 23 },
    { raw: dom, label: "day-of-month", min: 1, max: 31 },
    { raw: month, label: "month", min: 1, max: 12, names: MONTH_NAMES },
    { raw: dow, label: "day-of-week", min: 0, max: 6, names: DOW_NAMES },
  ];

  for (const f of fieldDefs) {
    const vals = parseField(f.raw, f.min, f.max, f.names);
    if (vals === null) {
      return {
        valid: false,
        description: "",
        nextRuns: [],
        error: `Invalid ${f.label} field: "${f.raw}"`,
        expression: trimmed,
      };
    }
  }

  const description = buildDescription(minute, hour, dom, month, dow);
  const nextRuns = computeNextRuns(minute, hour, dom, month, dow, 10);

  return {
    valid: true,
    description,
    nextRuns,
    fields: fieldDefs,
    expression: trimmed,
  };
}

// ── Component ──────────────────────────────────────────────────────────────────

export function CronJobCalculatorTool() {
  const [expression, setExpression] = useState("0 9 * * 1-5");
  const [copied, setCopied] = useState(false);
  const [showPresets, setShowPresets] = useState(false);

  const result = useMemo(() => parseCron(expression), [expression]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setExpression(e.target.value);
  }, []);

  const handlePreset = useCallback((value: string, label: string) => {
    setExpression(value);
    setShowPresets(false);
    ToolEvents.toolUsed(`preset:${label}`);
  }, []);

  const handleCopy = useCallback(async () => {
    if (!result.valid) return;
    await navigator.clipboard.writeText(result.expression);
    setCopied(true);
    toast.success("Cron expression copied!");
    ToolEvents.resultCopied();
    setTimeout(() => setCopied(false), 2000);
  }, [result]);

  const FIELD_LABELS = ["Minute", "Hour", "Day", "Month", "Weekday"];
  const fields = result.valid && result.fields ? result.fields : null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Input card */}
      <div className="rounded-2xl border border-border/50 bg-card p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Clock className="h-5 w-5 text-brand" />
          <h2 className="font-semibold text-lg">Cron Expression</h2>
        </div>

        {/* Expression input */}
        <div className="flex gap-2">
          <Input
            value={expression}
            onChange={handleChange}
            placeholder="* * * * *"
            className="font-mono text-base"
            spellCheck={false}
            aria-label="Cron expression input"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={handleCopy}
            disabled={!result.valid}
            aria-label="Copy expression"
            title="Copy to clipboard"
          >
            {copied ? <Check className="h-4 w-4 text-brand" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>

        {/* Field labels */}
        <div className="grid grid-cols-5 gap-1 text-xs text-center text-muted-foreground">
          {FIELD_LABELS.map((label) => (
            <div key={label} className="bg-muted/40 rounded px-1 py-1">{label}</div>
          ))}
        </div>

        {/* Validation status */}
        <AnimatePresence mode="wait">
          {result.error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="flex items-center gap-2 text-sm text-destructive"
            >
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {result.error}
            </motion.div>
          ) : (
            <motion.div
              key="desc"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="flex items-start gap-2 text-sm"
            >
              <Check className="h-4 w-4 text-brand flex-shrink-0 mt-0.5" />
              <span className="text-foreground font-medium">{result.description}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Parsed fields display */}
        {fields && (
          <div className="grid grid-cols-5 gap-1 text-xs text-center">
            {fields.map((f) => (
              <div key={f.label} className="bg-brand/10 border border-brand/20 rounded px-1 py-1 font-mono text-brand truncate">
                {f.raw}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Presets */}
      <div className="rounded-2xl border border-border/50 bg-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Common Presets</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPresets((s) => !s)}
            className="text-xs"
          >
            {showPresets ? "Hide all" : "Show all"}
          </Button>
        </div>

        {/* Special macros */}
        <div>
          <p className="text-xs text-muted-foreground mb-2 font-mono">Special macros</p>
          <div className="flex flex-wrap gap-2">
            {SPECIAL_PRESETS.map((p) => (
              <button
                key={p.value}
                onClick={() => handlePreset(p.value, p.label)}
                title={p.description}
                className="px-3 py-1.5 rounded-lg bg-muted/50 hover:bg-brand/10 hover:border-brand/30 border border-border/50 text-xs font-mono transition-colors cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Standard presets */}
        <div>
          <p className="text-xs text-muted-foreground mb-2">Standard schedules</p>
          <div className="flex flex-wrap gap-2">
            {(showPresets ? PRESETS : PRESETS.slice(0, 8)).map((p) => (
              <button
                key={p.value}
                onClick={() => handlePreset(p.value, p.label)}
                title={p.value}
                className="px-3 py-1.5 rounded-lg bg-muted/50 hover:bg-brand/10 hover:border-brand/30 border border-border/50 text-xs transition-colors cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Next run times */}
      {result.valid && result.nextRuns.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border/50 bg-card p-6 space-y-4"
        >
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-brand" />
            <h2 className="font-semibold">Next 10 Run Times</h2>
            <Badge variant="secondary" className="text-xs ml-auto">
              {Intl.DateTimeFormat().resolvedOptions().timeZone}
            </Badge>
          </div>

          <div className="space-y-1.5">
            {result.nextRuns.map((run, i) => {
              const isFirst = i === 0;
              return (
                <motion.div
                  key={run.toISOString()}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-mono ${
                    isFirst
                      ? "bg-brand/10 border border-brand/20 text-brand font-semibold"
                      : "bg-muted/30"
                  }`}
                >
                  <span className="text-muted-foreground text-xs w-4 text-right">{i + 1}</span>
                  <span>
                    {run.toLocaleDateString(undefined, {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className="ml-auto">
                    {run.toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {isFirst && (
                    <Badge className="text-xs bg-brand text-white ml-1">Next</Badge>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Quick reference */}
      <div className="rounded-2xl border border-border/50 bg-muted/20 p-6">
        <h2 className="font-semibold mb-3 text-sm">Quick Reference</h2>
        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-xs font-mono text-muted-foreground">
          {[
            ["*", "any value"],
            [",", "value list (1,3,5)"],
            ["-", "range (1-5)"],
            ["*/n", "every nth value (*/2)"],
            ["0-59", "minute range"],
            ["0-23", "hour range"],
            ["1-31", "day-of-month"],
            ["1-12", "month (or JAN-DEC)"],
            ["0-6", "day-of-week (0=Sun)"],
          ].map(([sym, desc]) => (
            <div key={sym} className="flex gap-2 py-0.5">
              <span className="text-brand w-16 flex-shrink-0">{sym}</span>
              <span>{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
