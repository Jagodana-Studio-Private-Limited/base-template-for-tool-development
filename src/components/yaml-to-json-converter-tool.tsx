"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { ArrowLeftRight, Copy, Trash2, Download, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolEvents } from "@/lib/analytics";
import * as yaml from "js-yaml";

type ConvertMode = "yaml-to-json" | "json-to-yaml";
type JsonFormat = "pretty" | "minify";

const YAML_EXAMPLE = `# Example YAML
name: John Doe
age: 30
active: true
address:
  street: 123 Main St
  city: Springfield
  zip: "12345"
hobbies:
  - reading
  - coding
  - hiking
scores:
  math: 95
  science: 88
`;

const JSON_EXAMPLE = `{
  "name": "John Doe",
  "age": 30,
  "active": true,
  "address": {
    "street": "123 Main St",
    "city": "Springfield",
    "zip": "12345"
  },
  "hobbies": ["reading", "coding", "hiking"],
  "scores": {
    "math": 95,
    "science": 88
  }
}`;

function detectFormat(text: string): ConvertMode {
  const trimmed = text.trim();
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    return "json-to-yaml";
  }
  return "yaml-to-json";
}

function convertYamlToJson(input: string, format: JsonFormat): string {
  const parsed = yaml.load(input);
  if (format === "pretty") {
    return JSON.stringify(parsed, null, 2);
  }
  return JSON.stringify(parsed);
}

function convertJsonToYaml(input: string): string {
  const parsed = JSON.parse(input);
  return yaml.dump(parsed, { indent: 2, lineWidth: -1 });
}

export function YamlToJsonConverterTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<ConvertMode>("yaml-to-json");
  const [jsonFormat, setJsonFormat] = useState<JsonFormat>("pretty");
  const [error, setError] = useState<string | null>(null);
  const [hasConverted, setHasConverted] = useState(false);

  const handleConvert = useCallback(() => {
    if (!input.trim()) {
      toast.error("Please enter some text to convert.");
      return;
    }

    setError(null);

    try {
      let result: string;
      if (mode === "yaml-to-json") {
        result = convertYamlToJson(input, jsonFormat);
      } else {
        result = convertJsonToYaml(input);
      }
      setOutput(result);
      setHasConverted(true);
      ToolEvents.toolUsed("convert");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      setOutput("");
    }
  }, [input, mode, jsonFormat]);

  const handleSwapMode = useCallback(() => {
    setMode((prev) => (prev === "yaml-to-json" ? "json-to-yaml" : "yaml-to-json"));
    setInput(output || "");
    setOutput("");
    setError(null);
    setHasConverted(false);
  }, [output]);

  const handleLoadExample = useCallback(() => {
    if (mode === "yaml-to-json") {
      setInput(YAML_EXAMPLE);
    } else {
      setInput(JSON_EXAMPLE);
    }
    setOutput("");
    setError(null);
    setHasConverted(false);
  }, [mode]);

  const handleAutoDetect = useCallback(() => {
    if (!input.trim()) return;
    const detected = detectFormat(input);
    setMode(detected);
    setOutput("");
    setError(null);
  }, [input]);

  const handleCopy = useCallback(() => {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      toast.success("Copied to clipboard!");
      ToolEvents.resultCopied();
    });
  }, [output]);

  const handleDownload = useCallback(() => {
    if (!output) return;
    const ext = mode === "yaml-to-json" ? "json" : "yaml";
    const mimeType = mode === "yaml-to-json" ? "application/json" : "text/yaml";
    const blob = new Blob([output], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `converted.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    ToolEvents.resultExported(ext);
  }, [output, mode]);

  const handleClear = useCallback(() => {
    setInput("");
    setOutput("");
    setError(null);
    setHasConverted(false);
  }, []);

  const inputLabel = mode === "yaml-to-json" ? "YAML Input" : "JSON Input";
  const outputLabel = mode === "yaml-to-json" ? "JSON Output" : "YAML Output";
  const inputPlaceholder =
    mode === "yaml-to-json"
      ? "Paste your YAML here...\n\nname: John Doe\nage: 30\nactive: true"
      : 'Paste your JSON here...\n\n{\n  "name": "John Doe",\n  "age": 30\n}';

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl bg-muted/40 border border-border/50">
        {/* Mode selector */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="flex rounded-lg border border-border overflow-hidden text-sm font-medium">
            <button
              onClick={() => { setMode("yaml-to-json"); setOutput(""); setError(null); }}
              className={`px-4 py-2 transition-colors ${
                mode === "yaml-to-json"
                  ? "bg-brand text-white"
                  : "bg-background hover:bg-muted text-foreground"
              }`}
            >
              YAML → JSON
            </button>
            <button
              onClick={() => { setMode("json-to-yaml"); setOutput(""); setError(null); }}
              className={`px-4 py-2 transition-colors ${
                mode === "json-to-yaml"
                  ? "bg-brand text-white"
                  : "bg-background hover:bg-muted text-foreground"
              }`}
            >
              JSON → YAML
            </button>
          </div>

          {mode === "yaml-to-json" && (
            <div className="flex rounded-lg border border-border overflow-hidden text-sm font-medium">
              <button
                onClick={() => setJsonFormat("pretty")}
                className={`px-3 py-2 transition-colors ${
                  jsonFormat === "pretty"
                    ? "bg-brand-accent text-white"
                    : "bg-background hover:bg-muted text-foreground"
                }`}
              >
                Pretty
              </button>
              <button
                onClick={() => setJsonFormat("minify")}
                className={`px-3 py-2 transition-colors ${
                  jsonFormat === "minify"
                    ? "bg-brand-accent text-white"
                    : "bg-background hover:bg-muted text-foreground"
                }`}
              >
                Minify
              </button>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleLoadExample}>
            Load Example
          </Button>
          <Button variant="outline" size="sm" onClick={handleAutoDetect} disabled={!input.trim()}>
            Auto-detect
          </Button>
          <Button variant="outline" size="sm" onClick={handleClear}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Editor panels */}
      <div className="grid md:grid-cols-[1fr_auto_1fr] gap-3 items-start">
        {/* Input panel */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <label className="text-sm font-semibold text-foreground">{inputLabel}</label>
            <span className="text-xs text-muted-foreground">
              {input.split("\n").length} lines
            </span>
          </div>
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (hasConverted) setHasConverted(false);
            }}
            placeholder={inputPlaceholder}
            className="w-full h-96 font-mono text-sm rounded-xl border border-border bg-background p-4 resize-none focus:outline-none focus:ring-2 focus:ring-brand/50 text-foreground placeholder:text-muted-foreground/50"
            spellCheck={false}
          />
        </div>

        {/* Convert button */}
        <div className="flex flex-col items-center justify-center gap-2 pt-8 md:pt-10">
          <Button
            onClick={handleConvert}
            className="gap-2 bg-gradient-to-r from-brand to-brand-accent text-white shadow-lg shadow-brand/25 px-5 py-6"
          >
            <ArrowRight className="h-4 w-4" />
            <span className="hidden md:inline">Convert</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSwapMode}
            className="gap-1 text-xs text-muted-foreground"
          >
            <ArrowLeftRight className="h-3 w-3" />
            Swap
          </Button>
        </div>

        {/* Output panel */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <label className="text-sm font-semibold text-foreground">{outputLabel}</label>
            <div className="flex items-center gap-1">
              {output && (
                <>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded hover:bg-muted transition-colors"
                  >
                    <Copy className="h-3 w-3" />
                    Copy
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded hover:bg-muted transition-colors"
                  >
                    <Download className="h-3 w-3" />
                    Download
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="relative">
            <textarea
              value={output}
              readOnly
              placeholder="Output will appear here after conversion..."
              className="w-full h-96 font-mono text-sm rounded-xl border border-border bg-muted/30 p-4 resize-none focus:outline-none text-foreground placeholder:text-muted-foreground/40"
              spellCheck={false}
            />
            {output && (
              <div className="absolute top-3 right-3">
                <span className="text-xs bg-brand/10 text-brand px-2 py-0.5 rounded-full font-medium">
                  {output.split("\n").length} lines
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-4">
          <p className="text-sm font-semibold text-destructive mb-1">Conversion Error</p>
          <pre className="text-xs text-destructive/80 font-mono whitespace-pre-wrap break-all">
            {error}
          </pre>
        </div>
      )}

      {/* Success indicator */}
      {hasConverted && !error && (
        <div className="rounded-xl border border-brand/30 bg-brand/5 p-3 text-center">
          <p className="text-sm text-brand font-medium">
            ✓ Converted successfully — {output.length.toLocaleString()} characters
          </p>
        </div>
      )}

      {/* Tips */}
      <div className="rounded-xl border border-border/50 bg-muted/20 p-4">
        <p className="text-xs font-semibold text-muted-foreground mb-2">Tips</p>
        <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
          <li>YAML uses spaces for indentation — tabs will cause errors</li>
          <li>Strings with special characters should be quoted in YAML</li>
          <li>JSON must use double quotes for strings</li>
          <li>Use <kbd className="px-1 bg-muted rounded text-[10px]">Auto-detect</kbd> to let the tool choose YAML→JSON or JSON→YAML based on your input</li>
          <li>Use <kbd className="px-1 bg-muted rounded text-[10px]">Swap</kbd> to move output back to input for chain conversions</li>
        </ul>
      </div>
    </div>
  );
}
