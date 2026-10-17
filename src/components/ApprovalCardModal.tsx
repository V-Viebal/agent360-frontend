import { useState } from "react";
import { PendingApproval } from "../services/approvalApi";
import {
  ShieldAlert,
  CheckCircle,
  XCircle,
  Terminal,
  AlertTriangle,
  Clock,
  HelpCircle,
} from "lucide-react";

interface ApprovalCardModalProps {
  approvals: PendingApproval[];
  onApprove: (requestId: string, sessionId: string, scope?: "exact" | "similar") => Promise<void>;
  onDeny: (requestId: string, sessionId: string, reason?: string) => Promise<void>;
  onClose: () => void;
}

export function ApprovalCardModal({
  approvals,
  onApprove,
  onDeny,
  onClose,
}: ApprovalCardModalProps) {
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  if (!approvals || approvals.length === 0) {
    return null;
  }

  const handleAction = async (
    requestId: string,
    sessionId: string,
    action: "approve" | "deny"
  ) => {
    setSubmittingId(requestId);
    try {
      if (action === "approve") {
        await onApprove(requestId, sessionId, "exact");
      } else {
        await onDeny(requestId, sessionId, "User rejected execution from console");
      }
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 dark:bg-black/80 backdrop-blur-sm backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#120f0c] border border-[#d86f4c]/50 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-[#1a1410] border-b border-[#2b241e] flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-[#d86f4c]">
            <ShieldAlert size={18} />
            <h3 className="font-semibold text-sm text-white font-sans">
              Tool Guard Approval Required
            </h3>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-[#d86f4c]/10 text-[#d86f4c] text-[11px] font-mono border border-[#d86f4c]/30">
            {approvals.length} pending
          </span>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-4">
          {approvals.map((app) => (
            <div
              key={app.request_id}
              className="bg-slate-50 dark:bg-[#17120e] border border-[#2b241e] rounded-xl p-4 space-y-3 font-sans text-xs"
            >
              <div className="flex items-center justify-between text-slate-500 dark:text-neutral-400 font-mono text-[11px]">
                <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                  <AlertTriangle size={13} />
                  Severity: {app.severity || "HIGH"}
                </span>
                <span className="flex items-center gap-1 text-neutral-500">
                  <Clock size={11} />
                  {app.created_at ? new Date(app.created_at).toLocaleTimeString() : "Just now"}
                </span>
              </div>

              <div>
                <span className="text-neutral-500 font-mono text-[10px] block mb-0.5">REQUESTED TOOL</span>
                <div className="flex items-center gap-2 font-mono text-white text-xs bg-[#0c0a08] px-3 py-2 rounded-lg border border-white/5">
                  <Terminal size={13} className="text-[#d86f4c]" />
                  <span>{app.tool_name}</span>
                </div>
              </div>

              {app.reasoning && (
                <div>
                  <span className="text-neutral-500 font-mono text-[10px] block mb-0.5">AGENT REASONING</span>
                  <p className="text-slate-700 dark:text-neutral-300 text-xs leading-relaxed bg-[#0c0a08]/50 p-2.5 rounded-lg border border-white/5 font-mono">
                    {app.reasoning}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                <button
                  disabled={submittingId === app.request_id}
                  onClick={() => handleAction(app.request_id, app.session_id, "deny")}
                  className="px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 font-medium text-xs flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-40"
                >
                  <XCircle size={13} />
                  <span>Deny</span>
                </button>
                <button
                  disabled={submittingId === app.request_id}
                  onClick={() => handleAction(app.request_id, app.session_id, "approve")}
                  className="px-3.5 py-1.5 rounded-lg bg-[#d86f4c] hover:bg-[#c2410c] text-white font-medium text-xs flex items-center gap-1 transition-all shadow-[0_0_12px_rgba(216,111,76,0.3)] cursor-pointer disabled:opacity-40"
                >
                  <CheckCircle size={13} />
                  <span>Approve & Execute</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-[#17120e] border-t border-[#2b241e] flex justify-between items-center text-[11px] text-neutral-500 font-mono">
          <span>Decisions recorded in audit log</span>
          <button
            onClick={onClose}
            className="hover:text-slate-700 dark:text-neutral-300 transition-colors cursor-pointer"
          >
            Dismiss overlay
          </button>
        </div>
      </div>
    </div>
  );
}
