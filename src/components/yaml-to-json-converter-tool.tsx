"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Copy,
  Check,
  Minimize2,
  Maximize2,
  Trash2,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ToolEvents } from "@/lib/analytics";
import * as yaml from "js-yaml";

const PLACEHOLDER_YAML = `# Paste your YAML here
name: my-app
version: "1.0.0"
config:
  host: localhost
  port: 8080
  debug: true
tags:
  - web
  - api
database:
  host: db.example.com
  port: 5432
  name: mydb
`.trimStart();

function convertYamlToJson(input: string, indent: number): { json: string; error: string | null; docCount: number } {
  if (!input.trim()) return { json: "", error: null, docCount: 0 };

  try {
    const docs: unknown[] = [];
    yaml.loadAll(input, (doc) => {
      docs.push(doc);
    });

    if (docs.length === 0) return { json: "", error: null, docCount: 0 };

    const value = docs.length === 1 ? docs[0] : docs;
    const json = indent === 0
      ? JSON.stringify(value)
      : JSON.stringify(value, null, indent);

    return { json, error: null, docCount: docs.length };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { json: "", error: msg, docCount: 0 };
  }
}

export function YamlToJsonConverterTool() {
  const [input, setInput] = useState(PLACEHOLDER_YAML);
  const [indent, setIndent] = useState(2);
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState<{ json: string; error: string | null; docCount: number }>({
    json: "",
    error: null,
    docCount: 0,
  });

  useEffect(() => {
    setResult(convertYamlToJson(input, indent));
  }, [input, indent]);

  const handleCopy = useCallback(async () => {
    if (!result.json) return;
    await navigator.clipboard.writeText(result.json);
    setCopied(true);
    toast.success("JSON copied to clipboard!");
    ToolEvents.resultCopied();
    setTimeout(() => setCopied(false), 2000);
  }, [result.json]);

  const handleClear = useCallback(() => {
    setInput("");
    toast.success("Input cleared");
  }, []);

  const handleMinify = useCallback(() => {
    setIndent(0);
    ToolEvents.toolUsed("minify");
  }, []);

  const handlePrettify = useCallback(() => {
    setIndent(2);
    ToolEvents.toolUsed("prettify");
  }, []);

  const lineCount = input.split("\n").length;
  const byteSize = new TextEncoder().encode(result.json).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="w-full space-y-4"
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground font-medium">Indent:</span>
          {[2, 4].map((n) => (
            <Button
              key={n}
              variant={indent === n ? "default" : "outline"}
              size="sm"
              onClick={() => setIndent(n)}
              className={indent === n ? "bg-brand hover:bg-brand/90 text-white" : ""}
            >
              {n}
            </Button>
          ))}
          <Button
            variant={indent === 0 ? "default" : "outline"}
            size="sm"
            onClick={handleMinify}
            className={`gap-1 ${indent === 0 ? "bg-brand hover:bg-brand/90 text-white" : ""}`}
          >
            <Minimize2 className="h-3 w-3" />
            Minify
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrettify}
            className="gap-1"
          >
            <Maximize2 className="h-3 w-3" />
            Prettify
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            className="gap-1 text-muted-foreground"
          >
            <Trash2 className="h-3 w-3" />
            Clear
          </Button>
          <Button
            size="sm"
            onClick={handleCopy}
            disabled={!result.json}
            className="gap-1 bg-gradient-to-r from-brand to-brand-accent text-white shadow-sm"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                Copy JSON
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Editor panels */}
      <div className="grid md:grid-cols-2 gap-4 items-start">
        {/* YAML input */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              YAML Input
            </span>
            <Badge variant="secondary" className="text-xs font-mono">
              {lineCount} {lineCount === 1 ? "line" : "lines"}
            </Badge>
          </div>
          <div className="relative rounded-xl border border-border/50 bg-muted/20 overflow-hidden">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              spellCheck={false}
              placeholder="Paste your YAML here…"
              className="w-full h-[400px] p-4 font-mono text-sm bg-transparent resize-none focus:outline-none focus:ring-2 focus:ring-brand/30 rounded-xl placeholder:text-muted-foreground/40"
              aria-label="YAML input"
            />
          </div>
        </div>

        {/* Arrow indicator (desktop) */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
          <div className="rounded-full bg-brand/10 border border-brand/20 p-2">
            <ArrowRight className="h-4 w-4 text-brand" />
          </div>
        </div>

        {/* JSON output */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              JSON Output
            </span>
            <div className="flex items-center gap-2">
              {result.docCount > 1 && (
                <Badge className="text-xs bg-brand/10 text-brand border-brand/20">
                  {result.docCount} docs
                </Badge>
              )}
              {result.json && (
                <Badge variant="secondary" className="text-xs font-mono">
                  {byteSize < 1024
                    ? `${byteSize} B`
                    : `${(byteSize / 1024).toFixed(1)} KB`}
                </Badge>
              )}
            </div>
          </div>

          <div
            className={`relative rounded-xl border overflow-hidden ${
              result.error
                ? "border-destructive/50 bg-destructive/5"
                : "border-border/50 bg-muted/20"
            }`}
          >
            {result.error ? (
              <div className="h-[400px] p-4 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span className="text-sm font-semibold">YAML syntax error</span>
                </div>
                <pre className="text-xs font-mono text-destructive/80 whitespace-pre-wrap leading-relaxed">
                  {result.error}
                </pre>
              </div>
            ) : (
              <textarea
                readOnly
                value={result.json}
                placeholder="JSON output will appear here…"
                className="w-full h-[400px] p-4 font-mono text-sm bg-transparent resize-none focus:outline-none placeholder:text-muted-foreground/40"
                aria-label="JSON output"
                aria-live="polite"
              />
            )}
          </div>
        </div>
      </div>

      {/* Status bar */}
      {!result.error && result.json && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-xs text-muted-foreground"
        >
          <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
          Valid JSON
          {result.docCount > 1 && (
            <span>· {result.docCount} YAML documents merged into array</span>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
