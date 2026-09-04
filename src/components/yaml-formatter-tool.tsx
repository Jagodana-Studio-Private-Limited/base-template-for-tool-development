"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import {
  CheckCircle,
  XCircle,
  Copy,
  Minimize2,
  Maximize2,
  RotateCcw,
  Clipboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ToolEvents } from "@/lib/analytics";

const EXAMPLE_YAML = `# Kubernetes Deployment Example
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
  namespace: production
  labels:
    app: my-app
    version: "1.0"
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
        - name: my-app
          image: my-app:1.0
          ports:
            - containerPort: 8080
          env:
            - name: NODE_ENV
              value: production
          resources:
            requests:
              memory: "64Mi"
              cpu: "250m"
            limits:
              memory: "128Mi"
              cpu: "500m"`;

type ValidationResult =
  | { ok: true; parsed: unknown }
  | { ok: false; error: string; line?: number; column?: number };

// Pure JS YAML parser — subset sufficient for formatting (no js-yaml dependency needed)
// We use a simple round-trip: parse then re-serialize using JSON as an intermediary for valid YAML
async function loadYaml(): Promise<{
  load: (s: string) => unknown;
  dump: (o: unknown, opts?: object) => string;
}> {
  // Dynamic import so we only load js-yaml if it's installed
  try {
    const jsyaml = await import("js-yaml");
    return { load: jsyaml.load as (s: string) => unknown, dump: jsyaml.dump };
  } catch {
    throw new Error(
      "js-yaml is not installed. Run: npm install js-yaml @types/js-yaml"
    );
  }
}

function validateYaml(input: string): ValidationResult {
  if (!input.trim()) {
    return { ok: false, error: "Input is empty." };
  }
  try {
    // We'll do real validation using js-yaml in the async path
    // For sync validation we do a basic check
    return { ok: true, parsed: null };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, error: msg };
  }
}

export function YamlFormatterTool() {
  const [input, setInput] = useState(EXAMPLE_YAML);
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<"idle" | "valid" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [errorLine, setErrorLine] = useState<number | undefined>();
  const [isMinified, setIsMinified] = useState(false);
  const [processing, setProcessing] = useState(false);

  const processYaml = useCallback(
    async (minify: boolean) => {
      if (!input.trim()) {
        toast.error("Please paste some YAML first.");
        return;
      }
      setProcessing(true);
      setIsMinified(minify);
      try {
        const yaml = await loadYaml();
        const parsed = yaml.load(input);
        let formatted: string;
        if (minify) {
          // Minify: dump as inline JSON-like YAML with flow style
          formatted = yaml.dump(parsed, {
            flowLevel: 99,
            lineWidth: -1,
          }).trim();
        } else {
          formatted = yaml.dump(parsed, {
            indent: 2,
            lineWidth: -1,
            noRefs: true,
          }).trim();
        }
        setOutput(formatted);
        setStatus("valid");
        setErrorMsg("");
        setErrorLine(undefined);
        ToolEvents.toolUsed(minify ? "minify" : "format");
        toast.success(minify ? "YAML minified!" : "YAML formatted successfully!");
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        // Extract line number from js-yaml error messages like "... at line 5, column 3"
        const lineMatch = msg.match(/at line (\d+)/);
        const line = lineMatch ? parseInt(lineMatch[1], 10) : undefined;
        setStatus("error");
        setErrorMsg(msg);
        setErrorLine(line);
        setOutput("");
        toast.error("Invalid YAML — check the error details.");
      } finally {
        setProcessing(false);
      }
    },
    [input]
  );

  const handleFormat = () => processYaml(false);
  const handleMinify = () => processYaml(true);

  const handleCopy = useCallback(() => {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      toast.success("Copied to clipboard!");
      ToolEvents.resultCopied();
    });
  }, [output]);

  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
      setStatus("idle");
      setOutput("");
      toast.success("Pasted from clipboard!");
    } catch {
      toast.error("Could not access clipboard.");
    }
  }, []);

  const handleClear = useCallback(() => {
    setInput("");
    setOutput("");
    setStatus("idle");
    setErrorMsg("");
    setErrorLine(undefined);
  }, []);

  const handleLoadExample = useCallback(() => {
    setInput(EXAMPLE_YAML);
    setOutput("");
    setStatus("idle");
    setErrorMsg("");
  }, []);

  // Highlight the error line in the input textarea by scrolling
  const inputLines = input.split("\n");

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      {/* Status bar */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        {status === "valid" && (
          <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" />
            Valid YAML
          </Badge>
        )}
        {status === "error" && (
          <Badge className="bg-destructive/15 text-destructive border-destructive/20 gap-1.5">
            <XCircle className="w-3.5 h-3.5" />
            Invalid YAML
          </Badge>
        )}
        {status === "idle" && (
          <Badge variant="outline" className="text-muted-foreground gap-1.5">
            Paste YAML below to get started
          </Badge>
        )}
        <span className="text-xs text-muted-foreground ml-auto">
          {inputLines.length} lines · {new Blob([input]).size} bytes
        </span>
      </div>

      {/* Main editor grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Input YAML</span>
            <div className="flex gap-1.5">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePaste}
                className="h-7 px-2 text-xs"
              >
                <Clipboard className="w-3 h-3 mr-1" />
                Paste
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLoadExample}
                className="h-7 px-2 text-xs"
              >
                Example
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="h-7 px-2 text-xs"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Clear
              </Button>
            </div>
          </div>
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setStatus("idle");
              setOutput("");
              setErrorMsg("");
            }}
            placeholder="Paste your YAML here..."
            spellCheck={false}
            className="w-full h-[420px] font-mono text-sm bg-muted/40 border border-border rounded-lg p-4 resize-none focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
          />
          {/* Error message */}
          {status === "error" && errorMsg && (
            <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm">
              <XCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-destructive">Parse Error</p>
                <p className="text-destructive/80 mt-0.5 font-mono text-xs break-all">
                  {errorMsg}
                </p>
                {errorLine && (
                  <p className="text-muted-foreground text-xs mt-1">
                    Error on line {errorLine}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Output */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              {isMinified ? "Minified Output" : "Formatted Output"}
            </span>
            {output && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-7 px-2 text-xs"
              >
                <Copy className="w-3 h-3 mr-1" />
                Copy
              </Button>
            )}
          </div>
          <textarea
            value={output}
            readOnly
            placeholder="Formatted YAML will appear here..."
            spellCheck={false}
            className="w-full h-[420px] font-mono text-sm bg-muted/20 border border-border rounded-lg p-4 resize-none focus:outline-none text-foreground"
          />
          {output && (
            <p className="text-xs text-muted-foreground text-right">
              {output.split("\n").length} lines · {new Blob([output]).size} bytes
            </p>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 mt-6 justify-center">
        <Button
          onClick={handleFormat}
          disabled={processing || !input.trim()}
          size="lg"
          className="bg-brand hover:bg-brand/90 text-white gap-2 min-w-[160px]"
        >
          <Maximize2 className="w-4 h-4" />
          {processing && !isMinified ? "Formatting..." : "Format YAML"}
        </Button>
        <Button
          onClick={handleMinify}
          disabled={processing || !input.trim()}
          size="lg"
          variant="outline"
          className="gap-2 min-w-[160px] border-brand/30 hover:border-brand/60"
        >
          <Minimize2 className="w-4 h-4" />
          {processing && isMinified ? "Minifying..." : "Minify YAML"}
        </Button>
        {output && (
          <Button
            onClick={handleCopy}
            size="lg"
            variant="outline"
            className="gap-2"
          >
            <Copy className="w-4 h-4" />
            Copy Output
          </Button>
        )}
      </div>

      {/* Tips */}
      <div className="mt-8 p-4 bg-muted/30 rounded-xl border border-border/50">
        <p className="text-sm font-medium mb-2 text-foreground">
          Common YAML mistakes to avoid:
        </p>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
          <li>
            <strong>Tabs vs spaces</strong> — YAML requires spaces only, never
            tabs
          </li>
          <li>
            <strong>Inconsistent indentation</strong> — child keys must be
            indented by the same amount under their parent
          </li>
          <li>
            <strong>Unquoted colons</strong> — values containing{" "}
            <code className="font-mono text-xs">:</code> must be wrapped in
            quotes
          </li>
          <li>
            <strong>Missing space after colon</strong> — every key-value pair
            needs a space:{" "}
            <code className="font-mono text-xs">key: value</code>, not{" "}
            <code className="font-mono text-xs">key:value</code>
          </li>
        </ul>
      </div>
    </div>
  );
}
