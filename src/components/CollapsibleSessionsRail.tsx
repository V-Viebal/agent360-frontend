import { useTranslation } from "../i18n/LanguageContext";
import { useState } from "react";
import { AgentSession } from "../types/agent";
import {
  ChevronUp,
  ChevronDown,
  MessageSquare,
  Plus,
  Clock,
  Sparkles,
  Layers,
  ChevronRight,
  Loader2,
} from "lucide-react";

interface CollapsibleSessionsRailProps {
  sessions: AgentSession[];
  activeSessionId: string;
  onSelectSession: (sessionId: string) => void;
  onNewSession?: () => void;
  agentName: string;
}

export function CollapsibleSessionsRail({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  agentName,
}: CollapsibleSessionsRailProps) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="border-t border-[#26211d] bg-[#100d0b] select-none transition-all duration-200 shrink-0">
      {/* Collapse Bar Toggle */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-6 py-2.5 flex items-center justify-between hover:bg-[#171310] cursor-pointer transition-colors"
      >
        <div className="flex items-center gap-2 text-xs font-mono">
          <MessageSquare size={13} className="text-[#d86f4c]" />
          <span className="font-semibold text-neutral-200">
            Sessions History on {agentName}
          </span>
          <span className="bg-[#26211d] text-[#d86f4c] text-[10px] px-2 py-0.2 rounded-full font-bold">
            {sessions.length}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {onNewSession && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNewSession();
              }}
              className="text-[11px] font-mono flex items-center gap-1 text-neutral-300 hover:text-white bg-[#1c1713] hover:bg-[#26211d] border border-[#26211d] px-2.5 py-1 rounded-md transition-colors cursor-pointer"
            >
              <Plus size={11} className="text-[#d86f4c]" />
              <span>{t("sessions.newSession")}</span>
            </button>
          )}

          <div className="text-neutral-400 hover:text-white p-1">
            {isExpanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </div>
        </div>
      </div>

      {/* Expandable Session Cards Grid */}
      {isExpanded && (
        <div className="px-6 py-3.5 bg-[#0a0806] border-t border-[#26211d]/60 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-48 overflow-y-auto">
          {sessions.map((sess) => {
            const isActive = sess.id === activeSessionId;
            return (
              <div
                key={sess.id}
                onClick={() => onSelectSession(sess.id)}
                className={`p-3 rounded-xl border text-xs font-sans transition-all cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? "bg-[#1c1713] border-[#d86f4c] shadow-[0_0_12px_rgba(216,111,76,0.15)] ring-1 ring-[#d86f4c]/40"
                    : "bg-[#120e0c] border-[#26211d] hover:bg-[#181310] hover:border-white/10"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between font-mono text-[10px] text-neutral-500 mb-1">
                    <span className="text-[#d86f4c] font-semibold truncate max-w-[120px]">
                      {sess.id}
                    </span>
                    <span>{sess.updatedAt}</span>
                  </div>
                  <h4 className="font-medium text-neutral-200 line-clamp-1 mb-1 flex items-center gap-1.5">
                    <span className="truncate">{sess.title}</span>
                  </h4>
                  <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                    {sess.lastMessageSnippet}
                  </p>
                </div>

                <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-neutral-500">
                  <span className="flex items-center gap-1">
                    {(sess.is_running || (sess as any).isRunning || sess.status === "running" || sess.status === "in_progress") && (
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                    )}
                    <span>{sess.messageCount} turns</span>
                  </span>
                  {isActive ? (
                    <span className="text-[#d86f4c] font-bold">{t("sessions.active")}</span>
                  ) : (sess.is_running || (sess as any).isRunning || sess.status === "running" || sess.status === "in_progress") ? (
                    <span className="text-blue-400 font-semibold flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                      <span>running</span>
                    </span>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
