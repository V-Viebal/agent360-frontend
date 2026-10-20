import React from "react";
import { Check, Copy, Terminal, Maximize2 } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
  onImageClick?: (url: string, alt: string) => void;
}

export function MarkdownRenderer({ content, onImageClick }: MarkdownRendererProps) {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Simple tokenized block renderer for code blocks and paragraphs
  const parts = content.split(/(```[\s\S]*?```)/g);

  // Markdown image detector
  const imgRegex = /^!\[([^\]]*)\]\((data:image\/[a-zA-Z]+;base64,[A-Za-z0-9+/=]+|https?:\/\/[^\s\)]+|\/[^\s\)]+)\)$/;

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

        // Render regular lines with image detection
        const lines = part.split("\n");
        return (
          <div key={idx} className="space-y-1.5">
            {lines.map((line, lIdx) => {
              const trimmed = line.trim();
              const imgMatch = trimmed.match(imgRegex);
              if (imgMatch) {
                const alt = imgMatch[1] || "Browser Screenshot Preview";
                const src = imgMatch[2];
                return (
                  <div key={lIdx} className="my-2.5">
                    <div
                      onClick={() => onImageClick?.(src, alt)}
                      className="group relative inline-block max-w-full rounded-xl overflow-hidden border border-[#2b241e] bg-black/60 shadow-md hover:border-[#d86f4c]/50 transition-all cursor-zoom-in"
                    >
                      <img
                        src={src}
                        alt={alt}
                        className="max-h-[380px] w-auto max-w-full object-contain block rounded-lg transition-transform duration-200 group-hover:scale-[1.01]"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white font-mono text-[11px] select-none pointer-events-none">
                        <Maximize2 size={13} />
                        <span>Phóng to ảnh</span>
                      </div>
                      {alt && (
                        <div className="px-3 py-1.5 bg-[#17120e]/90 border-t border-[#2b241e] text-[11px] font-mono text-neutral-400 truncate">
                          {alt}
                        </div>
                      )}
                    </div>
                  </div>
                );
              }

              return (
                <div key={lIdx} className="whitespace-pre-wrap">
                  {line}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
