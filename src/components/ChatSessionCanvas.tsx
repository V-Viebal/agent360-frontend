import { useTranslation } from "../i18n/LanguageContext";
import { useState, useRef, useEffect } from "react";
import { ChatMessage, AgentSession } from "../types/agent";
import { PendingApproval } from "../services/approvalApi";
import { ApprovalCardModal } from "./ApprovalCardModal";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { uploadFileToGateway, UploadedFileResult } from "../services/uploadApi";
import {
  Send,
  Terminal,
  CheckCircle2,
  Clock,
  Bot,
  User,
  BrainCircuit,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
  ShieldAlert,
  Paperclip,
  X,
  FileText,
} from "lucide-react";

interface ChatSessionCanvasProps {
  session?: AgentSession;
  messages: ChatMessage[];
  onSendMessage: (text: string, attachmentVirtualUri?: string) => void;
  agentName: string;
  pendingApprovals?: PendingApproval[];
  onApproveTool?: (requestId: string, sessionId: string, scope?: "exact" | "similar") => Promise<void>;
  onDenyTool?: (requestId: string, sessionId: string, reason?: string) => Promise<void>;
}

export function ChatSessionCanvas({
  session,
  messages,
  onSendMessage,
  agentName,
  pendingApprovals = [],
  onApproveTool,
  onDenyTool,
}: ChatSessionCanvasProps) {
  const { t } = useTranslation();
  const [inputText, setInputText] = useState("");
  const [showThinkingGlobally, setShowThinkingGlobally] = useState<boolean>(true);
  const [expandedReasoning, setExpandedReasoning] = useState<Record<string, boolean>>({});
  const [showApprovalModal, setShowApprovalModal] = useState<boolean>(false);
  const [attachedFile, setAttachedFile] = useState<UploadedFileResult | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !attachedFile) return;

    let finalMessage = inputText;
    if (attachedFile) {
      finalMessage = `${inputText}\n\n[Attached File: ${attachedFile.file_name} (${attachedFile.url})]`.trim();
    }

    onSendMessage(finalMessage, attachedFile?.url);
    setInputText("");
    setAttachedFile(null);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);
    try {
      const res = await uploadFileToGateway(file);
      setAttachedFile(res);
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload file");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const toggleReasoningForMessage = (msgId: string) => {
    setExpandedReasoning((prev) => ({
      ...prev,
      [msgId]: prev[msgId] === undefined ? false : !prev[msgId],
    }));
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0a0806] overflow-hidden relative">
      {/* Session Title Bar with Thinking Blocks Toggle & Approval Indicator */}
      <div className="px-6 py-2.5 border-b border-[#26211d] bg-[#100d0b] flex items-center justify-between text-xs font-mono shrink-0 select-none">
        <div className="flex items-center gap-2 text-neutral-300">
          <span className="text-[#d86f4c] font-semibold">{t("chat.activeSession")}</span>
          <span className="text-white font-sans font-medium">{session?.title || "Default Dialogue Space"}</span>
          <span className="text-neutral-500 text-[11px]">({messages.length} messages)</span>
        </div>
        <div className="flex items-center gap-3 text-neutral-400 text-[11px]">
          {/* Tool Guard Approvals Alert Button */}
          {pendingApprovals.length > 0 && (
            <button data-ux-target-min="24"
              onClick={() => setShowApprovalModal(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 font-medium transition-colors cursor-pointer animate-pulse"
            >
              <ShieldAlert size={12} />
              <span>{pendingApprovals.length} Approval Pending</span>
            </button>
          )}

          {/* Global Thinking Toggle */}
          <button aria-label="Toggle visibility of reasoning trace / thinking blocks" data-ux-target-min="24"
            onClick={() => setShowThinkingGlobally((prev) => !prev)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded border transition-colors cursor-pointer ${
              showThinkingGlobally
                ? "bg-[#26211d] text-[#d86f4c] border-[#d86f4c]/40 hover:bg-[#382f28]"
                : "bg-transparent text-neutral-500 border-neutral-700 hover:text-neutral-300"
            }`}
            title="Toggle visibility of reasoning trace / thinking blocks"
          >
            <BrainCircuit size={12} />
            <span>Thinking {showThinkingGlobally ? "On" : "Off"}</span>
            {showThinkingGlobally ? <Eye size={11} /> : <EyeOff size={11} />}
          </button>

          <div className="flex items-center gap-1.5 text-neutral-500 text-[11px]">
            <Clock size={11} />
            <span>Updated {session?.updatedAt || "recently"}</span>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {messages.map((msg) => {
          const isUser = msg.role === "user";
          const isReasoningOpen =
            expandedReasoning[msg.id] !== undefined
              ? expandedReasoning[msg.id]
              : showThinkingGlobally;

          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-4xl ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}
            >
              {/* Avatar */}
              <div
                className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs select-none ${
                  isUser
                    ? "bg-[#26211d] text-neutral-300 border border-white/10"
                    : "bg-[#d86f4c] text-white shadow-[0_0_12px_rgba(216,111,76,0.3)]"
                }`}
              >
                {isUser ? <User size={14} /> : <Bot size={14} />}
              </div>

              {/* Message Content Bubble */}
              <div
                className={`flex flex-col space-y-2 rounded-2xl p-4 text-xs font-sans leading-relaxed border ${
                  isUser
                    ? "bg-[#1c1713] text-[#f4f3ef] border-[#382f28] rounded-tr-none max-w-xl"
                    : "bg-[#14100d] text-[#e8e6e1] border-[#26211d] rounded-tl-none max-w-2xl"
                }`}
              >
                {/* Author & Timestamp */}
                <div className="flex items-center justify-between gap-4 font-mono text-[10px] text-neutral-500 select-none pb-1 border-b border-white/5">
                  <span className="font-semibold text-neutral-400">
                    {isUser ? "You" : agentName}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>

                {/* Collapsible Reasoning Trace (Thinking Block) */}
                {!isUser && msg.reasoning && (
                  <div className="rounded-lg bg-[#0e0c0a] border border-[#2b241e] overflow-hidden my-1">
                    <button data-ux-target-min="24"
                      onClick={() => toggleReasoningForMessage(msg.id)}
                      className="w-full px-3 py-1.5 flex items-center justify-between text-[11px] font-mono text-[#d86f4c] hover:bg-white/5 transition-colors cursor-pointer select-none"
                    >
                      <span className="flex items-center gap-1.5 font-medium">
                        <BrainCircuit size={13} />
                        Thought process / Reasoning trace
                      </span>
                      {isReasoningOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                    </button>
                    {isReasoningOpen && (
                      <div className="px-3 py-2 text-[11px] font-mono text-neutral-400 border-t border-[#2b241e] bg-black/40 whitespace-pre-wrap leading-relaxed">
                        {msg.reasoning}
                      </div>
                    )}
                  </div>
                )}

                {/* Body Text with Markdown Artifact Rendering */}
                {isUser ? (
                  <div className="whitespace-pre-wrap leading-relaxed text-[13px] text-neutral-200">
                    {msg.content}
                  </div>
                ) : (
                  <MarkdownRenderer content={msg.content} />
                )}

                {/* Evidence Receipt Badge if present */}
                {msg.evidenceStatus && (
                  <div className="mt-2 pt-2 border-t border-white/5 flex items-center gap-1.5 font-mono text-[10px] text-emerald-400">
                    <CheckCircle2 size={12} />
                    <span>Evidence Discipline: {msg.evidenceStatus.toUpperCase()}</span>
                  </div>
                )}

                {/* Tool Calls Accordion */}
                {msg.toolCalls && msg.toolCalls.length > 0 && (
                  <div className="mt-2 space-y-1.5 pt-2 border-t border-white/5">
                    {msg.toolCalls.map((tc, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg bg-[#0c0a08] border border-[#26211d] p-2.5 font-mono text-[11px]"
                      >
                        <div className="flex items-center justify-between text-neutral-400 mb-1">
                          <span className="flex items-center gap-1.5 text-[#d86f4c] font-medium">
                            <Terminal size={12} />
                            {tc.tool}
                          </span>
                          <span className="text-emerald-400 text-[10px]">exit 0</span>
                        </div>
                        <div className="text-neutral-500 text-[10px] truncate mb-1">
                          args: {tc.args}
                        </div>
                        {tc.result && (
                          <div className="p-1.5 rounded bg-black/60 text-neutral-300 text-[11px] border border-white/5">
                            {tc.result}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Composer & Upload Attachment Bar */}
      <div className="p-4 bg-[#100d0b] border-t border-[#26211d] shrink-0 space-y-2">
        {/* Attachment preview if present */}
        {attachedFile && (
          <div className="max-w-4xl mx-auto flex items-center justify-between px-3 py-1.5 rounded-lg bg-[#1a1410] border border-[#d86f4c]/40 font-mono text-xs text-[#d86f4c]">
            <div className="flex items-center gap-2 truncate">
              <FileText size={14} />
              <span className="truncate">{attachedFile.file_name}</span>
              <span className="text-[10px] text-neutral-500 font-sans">
                ({(attachedFile.size / 1024).toFixed(1)} KB)
              </span>
            </div>
            <button aria-label="Remove attached file" data-ux-target-min="24"
              onClick={() => setAttachedFile(null)}
              className="p-1 min-h-6 min-w-6 inline-flex items-center justify-center hover:text-white transition-colors cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {uploadError && (
          <div className="max-w-4xl mx-auto text-[11px] text-red-400 font-mono">
            Error: {uploadError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex items-center gap-2">
          {/* File Upload Button */}
          <input data-ux-target-min="16"
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
          <button data-ux-target-min="24" aria-label="Attach file securely (Path Masked)"
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="h-10 px-3 rounded-xl bg-[#171310] border border-[#26211d] hover:border-[#d86f4c]/50 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer disabled:opacity-40"
            title="Attach file securely (Path Masked)"
          >
            <Paperclip size={15} className={uploading ? "animate-pulse text-[#d86f4c]" : ""} />
          </button>

          <div className="flex-1 relative">
            <input aria-label={`Message ${agentName} or instruct an autonomous task...`} data-ux-target-min="16"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message ${agentName} or instruct an autonomous task...`}
              className="w-full bg-[#171310] border border-[#26211d] rounded-xl px-4 py-3 text-xs text-[#f4f3ef] placeholder:text-neutral-500 focus:outline-none focus:border-[#d86f4c]/60 font-sans shadow-inner"
            />
          </div>

          <button data-ux-target-min="24"
            type="submit"
            disabled={(!inputText.trim() && !attachedFile) || uploading}
            className="h-10 px-4 rounded-xl bg-[#d86f4c] hover:bg-[#c2410c] disabled:opacity-40 disabled:hover:bg-[#d86f4c] text-white font-medium text-xs flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(216,111,76,0.3)] cursor-pointer"
          >
            <Send size={13} />
            <span>{t("chat.send")}</span>
          </button>
        </form>
      </div>

      {/* Tool Guard Approval Modal */}
      {showApprovalModal && onApproveTool && onDenyTool && (
        <ApprovalCardModal
          approvals={pendingApprovals}
          onApprove={async (reqId, sessId, scope) => {
            await onApproveTool(reqId, sessId, scope);
            if (pendingApprovals.length <= 1) {
              setShowApprovalModal(false);
            }
          }}
          onDeny={async (reqId, sessId, reason) => {
            await onDenyTool(reqId, sessId, reason);
            if (pendingApprovals.length <= 1) {
              setShowApprovalModal(false);
            }
          }}
          onClose={() => setShowApprovalModal(false)}
        />
      )}
    </div>
  );
}
