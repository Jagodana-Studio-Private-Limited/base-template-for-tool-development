"use client";

import { useState, useCallback } from "react";
import { Copy, Check, Monitor, Smartphone, Tablet, Globe, Cpu, Server, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ToolEvents } from "@/lib/analytics";

interface ParsedUA {
  browser: { name: string; version: string; major: string };
  engine: { name: string; version: string };
  os: { name: string; version: string };
  device: { type: string; vendor: string; model: string };
  cpu: { architecture: string };
  raw: string;
}

function detectBrowser(ua: string): { name: string; version: string; major: string } {
  const patterns: [RegExp, string][] = [
    [/Edg\/(\S+)/, "Edge"],
    [/OPR\/(\S+)/, "Opera"],
    [/SamsungBrowser\/(\S+)/, "Samsung Browser"],
    [/UCBrowser\/(\S+)/, "UC Browser"],
    [/YaBrowser\/(\S+)/, "Yandex Browser"],
    [/Vivaldi\/(\S+)/, "Vivaldi"],
    [/Brave\/(\S+)/, "Brave"],
    [/DuckDuckGo\/(\S+)/, "DuckDuckGo"],
    [/Firefox\/(\S+)/, "Firefox"],
    [/FxiOS\/(\S+)/, "Firefox iOS"],
    [/CriOS\/(\S+)/, "Chrome iOS"],
    [/Chrome\/(\S+)/, "Chrome"],
    [/Safari\/(\S+)/, "Safari"],
    [/MSIE\s(\S+)/, "Internet Explorer"],
    [/Trident\/.*rv:(\S+)/, "Internet Explorer"],
    [/Googlebot\/(\S+)/, "Googlebot"],
    [/bingbot\/(\S+)/, "Bingbot"],
    [/curl\/(\S+)/, "curl"],
    [/python-requests\/(\S+)/, "Python Requests"],
    [/PostmanRuntime\/(\S+)/, "Postman"],
    [/axios\/(\S+)/, "Axios"],
  ];

  for (const [regex, name] of patterns) {
    const match = ua.match(regex);
    if (match) {
      const version = match[1].replace(/[;)]/g, "");
      const major = version.split(".")[0];
      return { name, version, major };
    }
  }

  if (/Safari/.test(ua)) {
    const m = ua.match(/Version\/(\S+)/);
    const version = m ? m[1].replace(/[;)]/g, "") : "unknown";
    return { name: "Safari", version, major: version.split(".")[0] };
  }

  return { name: "Unknown", version: "unknown", major: "unknown" };
}

function detectEngine(ua: string): { name: string; version: string } {
  const patterns: [RegExp, string][] = [
    [/Gecko\/(\S+).*Firefox/, "Gecko"],
    [/AppleWebKit\/(\S+)/, "WebKit"],
    [/Trident\/(\S+)/, "Trident"],
    [/Presto\/(\S+)/, "Presto"],
  ];

  for (const [regex, name] of patterns) {
    const match = ua.match(regex);
    if (match) {
      const version = match[1].replace(/[;)]/g, "");
      if (name === "WebKit" && /Chrome/.test(ua) && !/Edg/.test(ua)) {
        return { name: "Blink", version };
      }
      return { name, version };
    }
  }

  return { name: "Unknown", version: "unknown" };
}

function detectOS(ua: string): { name: string; version: string } {
  const patterns: [RegExp, string, number?][] = [
    [/Windows NT ([\d.]+)/, "Windows", 1],
    [/iPhone OS ([\d_]+)/, "iOS", 1],
    [/iPad.*OS ([\d_]+)/, "iPadOS", 1],
    [/Android ([\d.]+)/, "Android", 1],
    [/Mac OS X ([\d_.]+)/, "macOS", 1],
    [/CrOS \S+ ([\d.]+)/, "Chrome OS", 1],
    [/Linux/, "Linux", undefined],
    [/FreeBSD/, "FreeBSD", undefined],
  ];

  const winVersionMap: Record<string, string> = {
    "10.0": "10/11", "6.3": "8.1", "6.2": "8", "6.1": "7",
    "6.0": "Vista", "5.2": "XP x64", "5.1": "XP",
  };

  for (const [regex, name, group] of patterns) {
    const match = ua.match(regex);
    if (match) {
      if (group === undefined) return { name, version: "" };
      const raw = match[group].replace(/_/g, ".");
      const version = name === "Windows" ? (winVersionMap[raw] ?? raw) : raw;
      return { name, version };
    }
  }

  return { name: "Unknown", version: "" };
}

function detectDevice(ua: string): { type: string; vendor: string; model: string } {
  if (/bot|crawler|spider|googlebot|bingbot|slurp|duckduckbot|baidu|yandex/i.test(ua)) {
    return { type: "Bot/Crawler", vendor: "", model: "" };
  }
  if (/curl|python|axios|postman|httpie/i.test(ua)) {
    return { type: "HTTP Client", vendor: "", model: "" };
  }

  const mobilePatterns: [RegExp, string, string][] = [
    [/iPhone/, "Apple", "iPhone"],
    [/iPad/, "Apple", "iPad"],
    [/iPod/, "Apple", "iPod"],
    [/Samsung|SM-[A-Z\d]+/, "Samsung", extractModel(ua, /SM-([A-Z\d]+)/)],
    [/Pixel [\d]+/, "Google", extractModel(ua, /Pixel ([\d]+)/)],
    [/Nexus [\d]+/, "Google", extractModel(ua, /Nexus ([\d]+)/)],
    [/Huawei/, "Huawei", ""],
    [/OnePlus/, "OnePlus", ""],
    [/Xiaomi|MIUI/, "Xiaomi", ""],
    [/OPPO/, "OPPO", ""],
    [/vivo/, "Vivo", ""],
    [/Redmi/, "Xiaomi", "Redmi"],
  ];

  for (const [regex, vendor, model] of mobilePatterns) {
    if (regex.test(ua)) {
      const isTablet = /iPad|tablet/i.test(ua);
      return { type: isTablet ? "Tablet" : "Mobile", vendor, model };
    }
  }

  if (/Android/.test(ua) && !/Mobile/.test(ua)) {
    return { type: "Tablet", vendor: "", model: "" };
  }
  if (/Android|Mobile|iPhone|iPod/i.test(ua)) {
    return { type: "Mobile", vendor: "", model: "" };
  }

  return { type: "Desktop", vendor: "", model: "" };
}

function extractModel(ua: string, regex: RegExp): string {
  const m = ua.match(regex);
  return m ? m[1] : "";
}

function detectCPU(ua: string): { architecture: string } {
  if (/arm64|aarch64/i.test(ua)) return { architecture: "arm64" };
  if (/arm/i.test(ua)) return { architecture: "arm" };
  if (/x86_64|Win64|WOW64|amd64/i.test(ua)) return { architecture: "amd64" };
  if (/i[36]86/i.test(ua)) return { architecture: "ia32" };
  if (/mips/i.test(ua)) return { architecture: "mips" };
  return { architecture: "" };
}

function parseUA(ua: string): ParsedUA {
  return {
    browser: detectBrowser(ua),
    engine: detectEngine(ua),
    os: detectOS(ua),
    device: detectDevice(ua),
    cpu: detectCPU(ua),
    raw: ua,
  };
}

const EXAMPLE_UAS = [
  {
    label: "Chrome 120 / Windows",
    ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  },
  {
    label: "Firefox 121 / macOS",
    ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 14.2; rv:121.0) Gecko/20100101 Firefox/121.0",
  },
  {
    label: "Safari 17 / iPhone",
    ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1",
  },
  {
    label: "Edge 120 / Windows",
    ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0",
  },
  {
    label: "Googlebot",
    ua: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
  },
  {
    label: "Android Chrome / Samsung",
    ua: "Mozilla/5.0 (Linux; Android 13; SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.193 Mobile Safari/537.36",
  },
];

function deviceIcon(type: string) {
  if (type === "Mobile") return <Smartphone className="h-4 w-4" />;
  if (type === "Tablet") return <Tablet className="h-4 w-4" />;
  if (type === "Bot/Crawler" || type === "HTTP Client") return <Server className="h-4 w-4" />;
  return <Monitor className="h-4 w-4" />;
}

interface ResultRowProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
  mono?: boolean;
}

function ResultRow({ label, value, icon, mono }: ResultRowProps) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    if (!value || value === "unknown" || value === "") return;
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [value]);

  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-border/50 last:border-0">
      <div className="flex items-center gap-2 text-sm text-muted-foreground min-w-[130px]">
        {icon}
        <span>{label}</span>
      </div>
      <div className="flex items-center gap-2 flex-1 justify-end">
        <span className={`text-sm font-medium text-right ${mono ? "font-mono" : ""} ${!value || value === "unknown" ? "text-muted-foreground italic" : ""}`}>
          {value || "—"}
        </span>
        {value && value !== "unknown" && value !== "" && (
          <button
            onClick={copy}
            className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
            aria-label={`Copy ${label}`}
          >
            {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        )}
      </div>
    </div>
  );
}

export function UserAgentParserTool() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<ParsedUA | null>(null);
  const [jsonCopied, setJsonCopied] = useState(false);

  const handleParse = useCallback(() => {
    const ua = input.trim();
    if (!ua) {
      toast.error("Please enter a User-Agent string.");
      return;
    }
    setResult(parseUA(ua));
    ToolEvents.toolUsed("parse");
  }, [input]);

  const useMyUA = useCallback(() => {
    const ua = navigator.userAgent;
    setInput(ua);
    setResult(parseUA(ua));
    ToolEvents.toolUsed("use-my-ua");
  }, []);

  const loadExample = useCallback((ua: string) => {
    setInput(ua);
    setResult(parseUA(ua));
    ToolEvents.toolUsed("load-example");
  }, []);

  const copyJSON = useCallback(async () => {
    if (!result) return;
    const json = JSON.stringify(
      {
        browser: result.browser,
        engine: result.engine,
        os: result.os,
        device: result.device,
        cpu: result.cpu,
      },
      null,
      2
    );
    await navigator.clipboard.writeText(json);
    setJsonCopied(true);
    ToolEvents.resultCopied();
    toast.success("JSON copied to clipboard!");
    setTimeout(() => setJsonCopied(false), 2000);
  }, [result]);

  return (
    <div className="space-y-6">
      {/* Input */}
      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">User-Agent String</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste any User-Agent string here…"
            rows={3}
            className="w-full resize-none font-mono text-sm rounded-xl border border-border/60 bg-muted/30 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand/40 placeholder:text-muted-foreground/50 leading-relaxed"
          />
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleParse}
              className="bg-gradient-to-r from-brand to-brand-accent text-white shadow-md shadow-brand/25 gap-2"
            >
              <Globe className="h-4 w-4" />
              Parse UA
            </Button>
            <Button
              variant="outline"
              onClick={useMyUA}
              className="gap-2 border-brand/30 hover:bg-brand/5"
            >
              <Monitor className="h-4 w-4" />
              Use My Browser UA
            </Button>
            {input && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setInput(""); setResult(null); }}
                className="text-muted-foreground"
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Examples */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-muted-foreground self-center">Examples:</span>
        {EXAMPLE_UAS.map((ex) => (
          <button
            key={ex.label}
            onClick={() => loadExample(ex.ua)}
            className="text-xs px-3 py-1.5 rounded-full border border-border/60 hover:border-brand/40 hover:bg-brand/5 transition-colors"
          >
            {ex.label}
          </button>
        ))}
      </div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Device badge */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-brand/10 text-brand border-brand/30 gap-1.5 text-sm px-3 py-1">
                {deviceIcon(result.device.type)}
                {result.device.type}
              </Badge>
              {result.browser.name !== "Unknown" && (
                <Badge variant="outline" className="text-sm px-3 py-1">
                  {result.browser.name} {result.browser.major}
                </Badge>
              )}
              {result.os.name !== "Unknown" && (
                <Badge variant="outline" className="text-sm px-3 py-1">
                  {result.os.name} {result.os.version}
                </Badge>
              )}
            </div>

            {/* Detail cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Browser */}
              <Card className="border-border/50">
                <CardHeader className="pb-2 pt-4 px-5">
                  <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5" /> Browser
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-4">
                  <ResultRow label="Name" value={result.browser.name} />
                  <ResultRow label="Version" value={result.browser.version} mono />
                  <ResultRow label="Major" value={result.browser.major} mono />
                </CardContent>
              </Card>

              {/* OS */}
              <Card className="border-border/50">
                <CardHeader className="pb-2 pt-4 px-5">
                  <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                    <Monitor className="h-3.5 w-3.5" /> Operating System
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-4">
                  <ResultRow label="Name" value={result.os.name} />
                  <ResultRow label="Version" value={result.os.version} mono />
                </CardContent>
              </Card>

              {/* Engine */}
              <Card className="border-border/50">
                <CardHeader className="pb-2 pt-4 px-5">
                  <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                    <Cpu className="h-3.5 w-3.5" /> Engine
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-4">
                  <ResultRow label="Name" value={result.engine.name} />
                  <ResultRow label="Version" value={result.engine.version} mono />
                </CardContent>
              </Card>

              {/* Device */}
              <Card className="border-border/50">
                <CardHeader className="pb-2 pt-4 px-5">
                  <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                    {deviceIcon(result.device.type)} Device
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-4">
                  <ResultRow label="Type" value={result.device.type} />
                  <ResultRow label="Vendor" value={result.device.vendor} />
                  <ResultRow label="Model" value={result.device.model} />
                  <ResultRow label="CPU Arch" value={result.cpu.architecture} mono />
                </CardContent>
              </Card>
            </div>

            {/* Copy JSON */}
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={copyJSON}
                className="gap-2 border-brand/30 hover:bg-brand/5"
              >
                {jsonCopied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {jsonCopied ? "Copied!" : "Copy as JSON"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
