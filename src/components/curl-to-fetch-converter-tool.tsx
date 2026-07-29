"use client";

import { useState, useCallback } from "react";
import { Copy, Check, Terminal, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// ── Curl parser ────────────────────────────────────────────────────────────────

interface ParsedCurl {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: string | null;
  bodyType: "json" | "form" | "text" | "multipart" | null;
  followRedirects: boolean;
  compressed: boolean;
}

function tokenize(input: string): string[] {
  const tokens: string[] = [];
  let i = 0;
  // Join continuation lines
  const src = input.replace(/\\\n/g, " ").replace(/\\\r\n/g, " ").trim();

  while (i < src.length) {
    // Skip whitespace
    while (i < src.length && /\s/.test(src[i])) i++;
    if (i >= src.length) break;

    const ch = src[i];
    if (ch === '"' || ch === "'") {
      const quote = ch;
      i++;
      let token = "";
      while (i < src.length) {
        if (src[i] === "\\") {
          i++;
          if (i < src.length) {
            if (quote === '"') {
              // Bash double-quote escape sequences
              const esc = src[i];
              if (esc === "n") token += "\n";
              else if (esc === "t") token += "\t";
              else if (esc === "r") token += "\r";
              else token += esc;
            } else {
              token += src[i];
            }
            i++;
          }
        } else if (src[i] === quote) {
          i++;
          break;
        } else {
          token += src[i++];
        }
      }
      tokens.push(token);
    } else {
      let token = "";
      while (i < src.length && !/\s/.test(src[i])) {
        if (src[i] === "\\") {
          i++;
          if (i < src.length) token += src[i++];
        } else {
          token += src[i++];
        }
      }
      tokens.push(token);
    }
  }
  return tokens;
}

function parseCurl(raw: string): ParsedCurl {
  const tokens = tokenize(raw);
  let idx = 0;
  const peek = () => tokens[idx];
  const eat = () => tokens[idx++];

  // Consume "curl" prefix
  if (peek()?.toLowerCase() === "curl") eat();

  let url = "";
  let method = "";
  const headers: Record<string, string> = {};
  const bodyParts: string[] = [];
  let bodyType: ParsedCurl["bodyType"] = null;
  let followRedirects = false;
  let compressed = false;

  while (idx < tokens.length) {
    const tok = eat();

    if (tok === "-X" || tok === "--request") {
      method = eat() || "GET";
    } else if (tok === "-H" || tok === "--header") {
      const hdr = eat() || "";
      const colon = hdr.indexOf(":");
      if (colon !== -1) {
        const name = hdr.slice(0, colon).trim();
        const value = hdr.slice(colon + 1).trim();
        headers[name] = value;
      }
    } else if (
      tok === "-d" ||
      tok === "--data" ||
      tok === "--data-raw" ||
      tok === "--data-binary" ||
      tok === "--data-ascii"
    ) {
      let val = eat() || "";
      if (val.startsWith("@")) val = val.slice(1); // file reference — strip @
      bodyParts.push(val);
      if (bodyType === null) bodyType = "text";
    } else if (tok === "--data-urlencode") {
      const val = eat() || "";
      bodyParts.push(val);
      bodyType = "form";
    } else if (tok === "-F" || tok === "--form") {
      const val = eat() || "";
      bodyParts.push(val);
      bodyType = "multipart";
    } else if (tok === "-u" || tok === "--user") {
      const creds = eat() || "";
      const encoded = btoa(creds);
      headers["Authorization"] = `Basic ${encoded}`;
    } else if (tok === "-A" || tok === "--user-agent") {
      headers["User-Agent"] = eat() || "";
    } else if (tok === "-e" || tok === "--referer" || tok === "--referrer") {
      headers["Referer"] = eat() || "";
    } else if (tok === "-b" || tok === "--cookie") {
      headers["Cookie"] = eat() || "";
    } else if (tok === "--compressed") {
      compressed = true;
      if (!headers["Accept-Encoding"]) {
        headers["Accept-Encoding"] = "gzip, deflate, br";
      }
    } else if (tok === "-L" || tok === "--location") {
      followRedirects = true;
    } else if (
      tok === "-s" ||
      tok === "--silent" ||
      tok === "-v" ||
      tok === "--verbose" ||
      tok === "-i" ||
      tok === "--include" ||
      tok === "-I" ||
      tok === "--head" ||
      tok === "-k" ||
      tok === "--insecure" ||
      tok === "--no-buffer" ||
      tok === "-g" ||
      tok === "--globoff"
    ) {
      // Ignore display/behaviour-only flags
      if (tok === "-I" || tok === "--head") method = "HEAD";
    } else if (tok === "-o" || tok === "--output" || tok === "-m" || tok === "--max-time") {
      eat(); // consume the value but ignore it
    } else if (tok === "--url") {
      url = eat() || "";
    } else if (!tok.startsWith("-") && !url) {
      url = tok;
    }
  }

  // Infer method
  if (!method) {
    method = bodyParts.length > 0 ? "POST" : "GET";
  }

  // Infer body content type
  const ctHeader =
    headers["Content-Type"] || headers["content-type"] || "";
  if (ctHeader.includes("application/json")) {
    bodyType = "json";
  } else if (ctHeader.includes("application/x-www-form-urlencoded")) {
    bodyType = "form";
  } else if (ctHeader.includes("multipart/form-data")) {
    bodyType = "multipart";
  } else if (bodyParts.length > 0 && bodyType === "text") {
    // Guess JSON
    const combined = bodyParts.join("&");
    try {
      JSON.parse(combined);
      bodyType = "json";
      if (!ctHeader) headers["Content-Type"] = "application/json";
    } catch {
      // keep text
    }
  }

  const body =
    bodyParts.length > 0
      ? bodyType === "multipart"
        ? bodyParts.join("\n")
        : bodyParts.join("&")
      : null;

  return { url, method, headers, body, bodyType, followRedirects, compressed };
}

// ── Code generator ─────────────────────────────────────────────────────────────

function generateFetch(parsed: ParsedCurl, lang: "js" | "ts"): string {
  const { url, method, headers, body, bodyType, followRedirects } = parsed;

  if (!url) return "";

  const lines: string[] = [];
  const isTs = lang === "ts";

  // Build headers object
  const hasHeaders = Object.keys(headers).length > 0;
  let headersStr = "";
  if (hasHeaders) {
    const hLines = Object.entries(headers).map(
      ([k, v]) => `    "${k}": "${v.replace(/"/g, '\\"')}",`
    );
    headersStr = `  headers: {\n${hLines.join("\n")}\n  },\n`;
  }

  // Build body
  let bodyStr = "";
  if (body !== null) {
    if (bodyType === "json") {
      // Pretty-print if valid JSON
      try {
        const parsed = JSON.parse(body);
        const pretty = JSON.stringify(parsed, null, 2)
          .split("\n")
          .map((l, i) => (i === 0 ? l : "    " + l))
          .join("\n");
        bodyStr = `  body: JSON.stringify(${pretty}),\n`;
      } catch {
        bodyStr = `  body: ${JSON.stringify(body)},\n`;
      }
    } else if (bodyType === "form") {
      const params = body.split("&").map((p) => {
        const eq = p.indexOf("=");
        if (eq === -1) return `  params.append(${JSON.stringify(p)}, "");`;
        return `  params.append(${JSON.stringify(p.slice(0, eq))}, ${JSON.stringify(p.slice(eq + 1))});`;
      });
      lines.push(`const params = new URLSearchParams();`);
      params.forEach((p) => lines.push(p));
      lines.push("");
      bodyStr = `  body: params,\n`;
    } else if (bodyType === "multipart") {
      const fields = body.split("\n").map((p) => {
        const eq = p.indexOf("=");
        if (eq === -1) return `  formData.append(${JSON.stringify(p)}, "");`;
        return `  formData.append(${JSON.stringify(p.slice(0, eq))}, ${JSON.stringify(p.slice(eq + 1))});`;
      });
      lines.push(`const formData = new FormData();`);
      fields.forEach((f) => lines.push(f));
      lines.push("");
      bodyStr = `  body: formData,\n`;
    } else {
      bodyStr = `  body: ${JSON.stringify(body)},\n`;
    }
  }

  // Init object
  const needsInit =
    method !== "GET" || hasHeaders || body !== null || followRedirects;
  let initStr = "";
  if (needsInit) {
    const methodStr = method !== "GET" ? `  method: "${method}",\n` : "";
    const redirectStr = followRedirects ? `  redirect: "follow",\n` : "";
    initStr = `{\n${methodStr}${headersStr}${bodyStr}${redirectStr}}`;
  }

  if (isTs) {
    lines.push(`const response = await fetch(`);
    lines.push(`  "${url}",`);
    if (initStr) {
      lines.push(`  ${initStr.replace(/\n/g, "\n  ")} satisfies RequestInit,`);
    }
    lines.push(`);`);
  } else {
    lines.push(`const response = await fetch(`);
    lines.push(`  "${url}",`);
    if (initStr) {
      lines.push(`  ${initStr.replace(/\n/g, "\n  ")},`);
    }
    lines.push(`);`);
  }

  lines.push("");
  lines.push(`if (!response.ok) {`);
  lines.push(`  throw new Error(\`HTTP error! status: \${response.status}\`);`);
  lines.push(`}`);
  lines.push("");
  lines.push(`const data = await response.json();`);
  lines.push(`console.log(data);`);

  const fnType = isTs
    ? `async function fetchData()${": Promise<void>"} {`
    : `async function fetchData() {`;

  const body2 = lines.map((l) => (l ? `  ${l}` : "")).join("\n");

  return `${fnType}\n${body2}\n}\n\nfetchData();`;
}

// ── UI ─────────────────────────────────────────────────────────────────────────

const EXAMPLE_CURL = `curl -X POST https://api.example.com/v1/messages \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer sk-your-api-key" \\
  -d '{"model":"gpt-4","messages":[{"role":"user","content":"Hello!"}]}'`;

export function CurlToFetchConverterTool() {
  const [curlInput, setCurlInput] = useState(EXAMPLE_CURL);
  const [lang, setLang] = useState<"js" | "ts">("js");
  const [copied, setCopied] = useState(false);

  const parsed = (() => {
    try {
      return parseCurl(curlInput.trim());
    } catch {
      return null;
    }
  })();

  const output = parsed && parsed.url ? generateFetch(parsed, lang) : "";

  const handleCopy = useCallback(async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  const hasError = curlInput.trim() && !parsed?.url;

  return (
    <div className="space-y-4">
      {/* Input / Output panels */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Terminal className="h-4 w-4" />
              <span>cURL Command</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-muted-foreground"
              onClick={() => setCurlInput(EXAMPLE_CURL)}
            >
              Load example
            </Button>
          </div>
          <textarea
            value={curlInput}
            onChange={(e) => setCurlInput(e.target.value)}
            placeholder={"Paste your curl command here…\n\ncurl -X POST https://api.example.com/v1/items \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"key\":\"value\"}'"}
            spellCheck={false}
            className={`w-full h-80 p-4 rounded-xl border font-mono text-sm bg-muted/20 resize-none focus:outline-none focus:ring-2 transition-colors ${
              hasError
                ? "border-destructive focus:ring-destructive/30"
                : "border-border/50 focus:ring-brand/30 focus:border-brand"
            }`}
          />
          {hasError && (
            <p className="text-xs text-destructive">
              Could not detect a URL. Make sure the command starts with <code>curl</code> and includes a URL.
            </p>
          )}
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                <ArrowRight className="h-4 w-4" />
                <span>fetch() Code</span>
              </div>
              <Tabs
                value={lang}
                onValueChange={(v) => setLang(v as "js" | "ts")}
              >
                <TabsList className="h-7 p-0.5">
                  <TabsTrigger value="js" className="h-6 px-2 text-xs">
                    JS
                  </TabsTrigger>
                  <TabsTrigger value="ts" className="h-6 px-2 text-xs">
                    TS
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <Button
              size="sm"
              disabled={!output}
              onClick={handleCopy}
              className={`h-7 text-xs gap-1.5 ${
                output
                  ? "bg-gradient-to-r from-brand to-brand-accent text-white shadow-sm shadow-brand/25"
                  : ""
              }`}
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  Copy Code
                </>
              )}
            </Button>
          </div>

          <div className="relative h-80 rounded-xl border border-border/50 bg-muted/20 overflow-hidden">
            {output ? (
              <pre className="h-full overflow-auto p-4 font-mono text-sm text-foreground leading-relaxed whitespace-pre">
                <code>{output}</code>
              </pre>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-sm text-muted-foreground text-center px-8">
                  {curlInput.trim()
                    ? "Waiting for a valid curl command…"
                    : "Paste a curl command on the left to see the fetch() equivalent."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Parsed info chips */}
      {parsed && parsed.url && (
        <div className="flex flex-wrap gap-2 pt-1">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand/10 border border-brand/20 text-xs text-brand font-medium">
            {parsed.method}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted/50 border border-border/50 text-xs text-muted-foreground font-mono truncate max-w-xs">
            {parsed.url}
          </span>
          {Object.keys(parsed.headers).length > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted/50 border border-border/50 text-xs text-muted-foreground">
              {Object.keys(parsed.headers).length} header
              {Object.keys(parsed.headers).length !== 1 ? "s" : ""}
            </span>
          )}
          {parsed.body && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted/50 border border-border/50 text-xs text-muted-foreground">
              body: {parsed.bodyType ?? "text"}
            </span>
          )}
          {parsed.followRedirects && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted/50 border border-border/50 text-xs text-muted-foreground">
              follow redirects
            </span>
          )}
        </div>
      )}
    </div>
  );
}
