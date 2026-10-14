import { Check, Copy } from "lucide-react";
import Prism from "prismjs";
import "prismjs/components/prism-bash.js";
import "prismjs/components/prism-http.js";
import "prismjs/components/prism-json.js";
import "prismjs/components/prism-jsx.js";
import "prismjs/components/prism-tsx.js";
import "prismjs/components/prism-typescript.js";
import { useState } from "react";

const LANG_MAP = {
  html: "markup",
  xml: "markup",
  js: "javascript",
  ts: "typescript",
  shell: "bash",
  sh: "bash",
};

export function CodeBlock({ code, language = "javascript", title }) {
  const [copied, setCopied] = useState(false);

  const cleanCode = (code || "").trim();
  const prismLang =
    LANG_MAP[language?.toLowerCase()] ||
    language?.toLowerCase() ||
    "javascript";
  const grammar = Prism.languages[prismLang] || Prism.languages.javascript;
  const highlighted = Prism.highlight(cleanCode, grammar, prismLang);

  const lines = cleanCode.split("\n");
  const showLineNumbers = lines.length > 2 && language !== "bash";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cleanCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore clipboard write errors
    }
  };

  return (
    <div className="relative my-6 overflow-hidden rounded-[10px] border border-slate-800/90 bg-[#181a20] shadow-md shadow-black/20">
      {/* Codeblock Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 bg-[#14151b] px-4 py-2.5 backdrop-blur-xs">
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate font-mono text-xs font-semibold text-slate-300">
            {title || language}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleCopy}
            className="flex cursor-pointer items-center gap-1.5 rounded-md border border-slate-700/60 bg-slate-800/80 px-2.5 py-1 text-[11px] font-medium text-slate-300 transition hover:border-slate-600 hover:bg-slate-700 hover:text-white active:scale-95"
            title="Copy code to clipboard"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="font-semibold text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-slate-400" />
                <span>Copy</span>
              </>
            )}
          </button>
          <span className="shrink-0 rounded-sm bg-slate-800/80 px-2 py-0.5 font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            {language}
          </span>
        </div>
      </div>

      {/* Code Container with Line Numbers */}
      <div className="flex overflow-hidden">
        {showLineNumbers && (
          <div
            className="shrink-0 border-r border-slate-800/60 py-4 pr-3 pl-4 text-right font-mono text-xs text-slate-600 select-none"
            aria-hidden="true"
          >
            {lines.map((_, i) => (
              <div key={i + 1} className="leading-relaxed">
                {i + 1}
              </div>
            ))}
          </div>
        )}

        <pre className="code-scroll flex-1 overflow-x-auto p-4 font-mono text-xs leading-relaxed text-slate-200 sm:text-sm">
          <code
            className="prism-code block"
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        </pre>
      </div>
    </div>
  );
}
