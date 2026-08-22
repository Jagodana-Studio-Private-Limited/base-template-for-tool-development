"use client";

import { useState, useCallback } from "react";
import { Copy, Check, RefreshCcw, Code2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ToolEvents } from "@/lib/analytics";

// ─── Type inference ──────────────────────────────────────────────────────────

function toPascalCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
    .replace(/^[a-z]/, (c) => c.toUpperCase());
}

type Collected = Map<string, string>;

function inferType(
  value: unknown,
  keyName: string,
  collected: Collected,
  useOptional: boolean,
  useTypeAlias: boolean
): string {
  if (value === null) return "null";
  if (value === undefined) return "undefined";

  switch (typeof value) {
    case "string":
      return "string";
    case "number":
      return Number.isInteger(value) ? "number" : "number";
    case "boolean":
      return "boolean";
    case "object":
      if (Array.isArray(value)) {
        if (value.length === 0) return "unknown[]";
        // Collect all types across array items
        const itemTypes = new Set(
          value.map((item) =>
            inferType(item, keyName + "Item", collected, useOptional, useTypeAlias)
          )
        );
        const unionType =
          itemTypes.size === 1
            ? [...itemTypes][0]
            : `(${[...itemTypes].join(" | ")})`;
        return `${unionType}[]`;
      }
      // Nested object → generate sub-interface
      const interfaceName = toPascalCase(keyName);
      buildInterface(
        value as Record<string, unknown>,
        interfaceName,
        collected,
        useOptional,
        useTypeAlias
      );
      return interfaceName;
    default:
      return "unknown";
  }
}

function buildInterface(
  obj: Record<string, unknown>,
  name: string,
  collected: Collected,
  useOptional: boolean,
  useTypeAlias: boolean
): void {
  if (collected.has(name)) return; // already processed

  const lines: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const isNull = value === null || value === undefined;
    const typeName = inferType(value, key, collected, useOptional, useTypeAlias);

    const fieldKey =
      useOptional && isNull ? `${key}?` : key;
    const fieldType =
      useOptional && isNull ? `${typeName} | null` : typeName;

    // Escape keys that aren't valid identifiers
    const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(fieldKey)
      ? fieldKey
      : `"${fieldKey}"`;

    lines.push(`  ${safeKey}: ${fieldType};`);
  }

  const keyword = useTypeAlias ? "type" : "interface";
  const body = `{\n${lines.join("\n")}\n}`;
  const declaration =
    useTypeAlias ? `type ${name} = ${body};` : `interface ${name} ${body}`;

  collected.set(name, declaration);
}

function convertJsonToTs(
  json: string,
  rootName: string,
  useOptional: boolean,
  useTypeAlias: boolean
): string {
  const parsed: unknown = JSON.parse(json);

  const collected: Collected = new Map();

  // Handle top-level array
  if (Array.isArray(parsed)) {
    if (parsed.length === 0) {
      return useTypeAlias
        ? `type ${rootName} = unknown[];`
        : `type ${rootName} = unknown[];`;
    }
    // Infer from first element
    const itemName = rootName + "Item";
    if (parsed[0] !== null && typeof parsed[0] === "object" && !Array.isArray(parsed[0])) {
      buildInterface(
        parsed[0] as Record<string, unknown>,
        itemName,
        collected,
        useOptional,
        useTypeAlias
      );
    }
    const itemType =
      parsed[0] !== null && typeof parsed[0] === "object"
        ? itemName
        : inferType(parsed[0], itemName, collected, useOptional, useTypeAlias);
    collected.set(rootName, useTypeAlias ? `type ${rootName} = ${itemType}[];` : `type ${rootName} = ${itemType}[];`);
  } else if (parsed !== null && typeof parsed === "object") {
    buildInterface(
      parsed as Record<string, unknown>,
      rootName,
      collected,
      useOptional,
      useTypeAlias
    );
  } else {
    // Primitive
    const primType = inferType(parsed, rootName, collected, useOptional, useTypeAlias);
    return useTypeAlias
      ? `type ${rootName} = ${primType};`
      : `type ${rootName} = ${primType};`;
  }

  // Output in dependency order (sub-interfaces first, root last)
  const keys = [...collected.keys()];
  const rootIdx = keys.indexOf(rootName);
  if (rootIdx > -1) keys.splice(rootIdx, 1);
  keys.push(rootName);

  return keys.map((k) => collected.get(k)!).join("\n\n");
}

// ─── Component ───────────────────────────────────────────────────────────────

const SAMPLE_JSON = `{
  "id": 1,
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "age": 30,
  "isActive": true,
  "score": null,
  "address": {
    "street": "123 Main St",
    "city": "Springfield",
    "zip": "62701"
  },
  "tags": ["developer", "designer"],
  "orders": [
    {
      "orderId": "ORD-001",
      "total": 49.99,
      "items": 3
    }
  ]
}`;

export function JsonToTypescriptTool() {
  const [input, setInput] = useState(SAMPLE_JSON);
  const [rootName, setRootName] = useState("Root");
  const [useOptional, setUseOptional] = useState(false);
  const [useTypeAlias, setUseTypeAlias] = useState(false);
  const [output, setOutput] = useState(() => {
    try {
      return convertJsonToTs(SAMPLE_JSON, "Root", false, false);
    } catch {
      return "";
    }
  });
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const convert = useCallback(
    (
      json: string,
      name: string,
      optional: boolean,
      typeAlias: boolean
    ) => {
      setError(null);
      if (!json.trim()) {
        setOutput("");
        return;
      }
      try {
        const result = convertJsonToTs(json, name || "Root", optional, typeAlias);
        setOutput(result);
        ToolEvents.toolUsed("convert");
      } catch (e) {
        setError(e instanceof SyntaxError ? `JSON Error: ${e.message}` : String(e));
        setOutput("");
      }
    },
    []
  );

  const handleInputChange = (value: string) => {
    setInput(value);
    convert(value, rootName, useOptional, useTypeAlias);
  };

  const handleRootNameChange = (value: string) => {
    setRootName(value);
    convert(input, value, useOptional, useTypeAlias);
  };

  const handleToggleOptional = () => {
    const next = !useOptional;
    setUseOptional(next);
    convert(input, rootName, next, useTypeAlias);
  };

  const handleToggleTypeAlias = () => {
    const next = !useTypeAlias;
    setUseTypeAlias(next);
    convert(input, rootName, useOptional, next);
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success("Copied to clipboard!");
    ToolEvents.resultCopied();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setInput(SAMPLE_JSON);
    setRootName("Root");
    setUseOptional(false);
    setUseTypeAlias(false);
    setError(null);
    const result = convertJsonToTs(SAMPLE_JSON, "Root", false, false);
    setOutput(result);
  };

  const lineCount = output.split("\n").length;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Options Bar */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {/* Root Name */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="root-name"
            className="text-sm font-medium text-muted-foreground whitespace-nowrap"
          >
            Root name:
          </label>
          <input
            id="root-name"
            type="text"
            value={rootName}
            onChange={(e) => handleRootNameChange(e.target.value)}
            className="h-8 w-28 rounded-md border border-border bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50"
          />
        </div>

        {/* Toggles */}
        <Toggle
          active={useOptional}
          onToggle={handleToggleOptional}
          label="Optional fields"
        />
        <Toggle
          active={useTypeAlias}
          onToggle={handleToggleTypeAlias}
          label="type alias"
        />

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="gap-1.5 text-muted-foreground"
          >
            <RefreshCcw className="h-3.5 w-3.5" />
            Reset
          </Button>
        </div>
      </div>

      {/* Editor Panes */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Input */}
        <Pane
          label="JSON Input"
          badge={input.trim() ? "JSON" : undefined}
          lineCount={input.split("\n").length}
        >
          <textarea
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            spellCheck={false}
            placeholder='Paste your JSON here, e.g. {"name": "Alice"}'
            className="w-full h-[420px] resize-none bg-transparent font-mono text-sm leading-relaxed p-4 focus:outline-none text-foreground placeholder:text-muted-foreground/50"
          />
        </Pane>

        {/* Output */}
        <Pane
          label="TypeScript Output"
          badge={output ? "TypeScript" : undefined}
          lineCount={output ? lineCount : undefined}
          action={
            output ? (
              <button
                onClick={handleCopy}
                aria-label="Copy TypeScript to clipboard"
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy
                  </>
                )}
              </button>
            ) : null
          }
        >
          {error ? (
            <div className="p-4 h-[420px] overflow-auto">
              <p className="text-destructive font-mono text-sm">{error}</p>
            </div>
          ) : output ? (
            <pre className="h-[420px] overflow-auto p-4 font-mono text-sm leading-relaxed text-foreground whitespace-pre-wrap break-words">
              <TypescriptHighlight code={output} />
            </pre>
          ) : (
            <div className="h-[420px] flex flex-col items-center justify-center gap-3 text-muted-foreground/40">
              <Code2 className="h-10 w-10" />
              <p className="text-sm">Output will appear here</p>
            </div>
          )}
        </Pane>
      </div>

      {/* Copy button (mobile-friendly below) */}
      {output && (
        <div className="mt-4 flex justify-end">
          <Button
            onClick={handleCopy}
            className="gap-2 bg-gradient-to-r from-brand to-brand-accent text-white shadow-lg shadow-brand/25"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy to Clipboard
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Toggle({
  active,
  onToggle,
  label,
}: {
  active: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onToggle}
      aria-pressed={active}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
        active
          ? "bg-brand/10 border-brand/30 text-brand"
          : "bg-muted/40 border-border/50 text-muted-foreground hover:border-brand/30"
      }`}
    >
      <span
        className={`inline-block w-3 h-3 rounded-full border ${
          active ? "bg-brand border-brand" : "bg-transparent border-muted-foreground/40"
        }`}
      />
      {label}
    </button>
  );
}

function Pane({
  label,
  badge,
  lineCount,
  action,
  children,
}: {
  label: string;
  badge?: string;
  lineCount?: number;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border/50 bg-muted/20 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/50 bg-muted/30">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">{label}</span>
          {badge && (
            <Badge variant="outline" className="text-[10px] h-5 px-1.5 text-brand border-brand/30">
              {badge}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-3">
          {lineCount !== undefined && (
            <span className="text-xs text-muted-foreground/60">
              {lineCount} {lineCount === 1 ? "line" : "lines"}
            </span>
          )}
          {action}
        </div>
      </div>
      {children}
    </div>
  );
}

// Minimal syntax highlighting for TypeScript output
function TypescriptHighlight({ code }: { code: string }) {
  const highlighted = code
    // keywords: interface, type, extends
    .replace(
      /\b(interface|type|extends|export|const|let|var|null|undefined|unknown)\b/g,
      '<span class="text-brand">$1</span>'
    )
    // primitive types
    .replace(
      /\b(string|number|boolean)\b/g,
      '<span class="text-brand-accent">$1</span>'
    )
    // field names (before colon)
    .replace(
      /^(\s+)("?[a-zA-Z_$][a-zA-Z0-9_$"]*\??)(\s*:)/gm,
      '$1<span class="text-foreground/90">$2</span>$3'
    );

  return (
    <span
      dangerouslySetInnerHTML={{ __html: highlighted }}
    />
  );
}
