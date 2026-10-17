import React from "react";
import { Check, Copy, Terminal } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Simple tokenized block renderer for code blocks and paragraphs
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-3 leading-relaxed text-[13px] text-neutral-200 font-sans">
      {parts.map((part, idx) => {
        if (part.startsWith("```") && part.endsWith("```")) {
          const match = part.match(/^```(\w+)?\n([\s\S]*?)```$/);
          const lang = match ? match[1] || "text" : "text";
          const code = match ? match[2] : part.slice(3, -3);

          return (
            <div
              key={idx}
              className="rounded-xl overflow-hidden border border-[#2b241e] bg-[#0c0a08] my-2 font-mono text-xs"
            >
              <div className="px-3.5 py-1.5 bg-[#17120e] border-b border-[#2b241e] flex items-center justify-between text-[11px] text-neutral-400">
                <span className="flex items-center gap-1.5 text-[#d86f4c]">
                  <Terminal size={12} />
                  {lang}
                </span>
                <button
                  onClick={() => handleCopy(code, idx)}
                  className="flex items-center gap-1 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  {copiedIndex === idx ? (
                    <>
                      <Check size={11} className="text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={11} />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-3.5 overflow-x-auto text-neutral-300 whitespace-pre">
                <code>{code}</code>
              </pre>
            </div>
          );
        }

        // Render regular text blocks with linebreaks preserved
        return (
          <div key={idx} className="whitespace-pre-wrap">
            {part}
          </div>
        );
      })}
    </div>
  );
}
