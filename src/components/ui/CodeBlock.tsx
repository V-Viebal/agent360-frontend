import React, { useState } from "react";
import { Copy, Check, Terminal } from "lucide-react";
import { playMicroClick } from "../../services/notificationService";

export interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  maxHeight?: string;
  className?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({
  code,
  language = "bash",
  title,
  maxHeight = "max-h-80",
  className = "",
  showLineNumbers = false,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    playMicroClick();
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const lines = code.trim().split("\n");

  return (
    <div
      className={`rounded-xl border border-slate-200 dark:border-[#222230] bg-slate-900 dark:bg-[#0c0c12] overflow-hidden text-xs font-mono shadow-md ${className}`}
    >
      {/* Code Block Header */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-slate-800/80 dark:bg-[#14141c] border-b border-slate-700/60 dark:border-[#1e1e28] text-[11px] text-neutral-400 select-none">
        <div className="flex items-center gap-2 min-w-0">
          <Terminal size={12} className="text-[#f8a87c] shrink-0" />
          <span className="font-semibold text-slate-200 truncate">{title || language}</span>
          <span className="text-[10px] text-neutral-500 font-mono">({lines.length} lines)</span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md transition-all cursor-pointer ${
            copied
              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 scale-105 shadow-xs"
              : "hover:bg-white/10 text-neutral-300 hover:text-white border border-transparent active:scale-95"
          }`}
          title="Sao chép nội dung"
        >
          {copied ? (
            <>
              <Check size={12} className="text-emerald-400 stroke-[2.5]" />
              <span className="text-[10px] text-emerald-400 font-mono font-semibold">Copied</span>
            </>
          ) : (
            <>
              <Copy size={12} className="transition-transform duration-150" />
              <span className="text-[10px] font-mono">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <div className={`p-3.5 overflow-x-auto ${maxHeight} scrollbar-none font-mono text-[11px] leading-relaxed text-slate-100`}>
        {showLineNumbers ? (
          <table className="w-full border-collapse">
            <tbody>
              {lines.map((line, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors">
                  <td className="pr-4 text-right text-neutral-600 select-none w-8 text-[10px]">
                    {idx + 1}
                  </td>
                  <td className="whitespace-pre">{line || " "}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <pre className="whitespace-pre">{code}</pre>
        )}
      </div>
    </div>
  );
}
