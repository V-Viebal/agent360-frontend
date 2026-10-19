import { useTranslation } from "../i18n/LanguageContext";
import { useState } from "react";
import { PendingApproval } from "../services/approvalApi";
import { Modal } from "./ui/Modal";
import {
  ShieldAlert,
  CheckCircle,
  XCircle,
  Terminal,
  AlertTriangle,
  Clock,
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
  const { t } = useTranslation();
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
    <Modal
      isOpen={true}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <span>Tool Guard Approval Required</span>
          <span className="px-2 py-0.5 rounded-full bg-[#f8a87c]/10 text-[#f8a87c] text-[10px] font-mono border border-[#f8a87c]/30">
            {approvals.length} pending
          </span>
        </div>
      }
      icon={<ShieldAlert size={18} className="text-[#f8a87c]" />}
      maxWidth="lg"
    >
      <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
        {approvals.map((app) => (
          <div
            key={app.request_id}
            className="bg-slate-50 dark:bg-[#17120e] border border-slate-200 dark:border-[#2b241e] rounded-xl p-4 space-y-3 font-sans text-xs"
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
              <span className="text-neutral-500 font-mono text-[10px] block mb-0.5">{t("approval.requestedTool")}</span>
              <div className="flex items-center gap-2 font-mono text-slate-800 dark:text-white text-xs bg-white dark:bg-[#0c0a08] px-3 py-2 rounded-lg border border-slate-200 dark:border-white/5">
                <Terminal size={13} className="text-[#f8a87c]" />
                <span>{app.tool_name}</span>
              </div>
            </div>

            {app.reasoning && (
              <div>
                <span className="text-neutral-500 font-mono text-[10px] block mb-0.5">{t("approval.agentReasoning")}</span>
                <p className="text-slate-700 dark:text-neutral-300 text-xs leading-relaxed bg-white/60 dark:bg-[#0c0a08]/50 p-2.5 rounded-lg border border-slate-200 dark:border-white/5 font-mono">
                  {app.reasoning}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-white/5">
              <button
                disabled={submittingId === app.request_id}
                onClick={() => handleAction(app.request_id, app.session_id, "deny")}
                className="px-3 py-1.5 rounded-lg border border-red-500/30 text-red-500 hover:bg-red-500/10 font-medium text-xs flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-40"
              >
                <XCircle size={13} />
                <span>{t("approval.deny")}</span>
              </button>
              <button
                disabled={submittingId === app.request_id}
                onClick={() => handleAction(app.request_id, app.session_id, "approve")}
                className="px-3.5 py-1.5 rounded-lg bg-[#f8a87c] hover:bg-[#f5935f] text-black font-semibold text-xs flex items-center gap-1 transition-all shadow-md cursor-pointer disabled:opacity-40"
              >
                <CheckCircle size={13} />
                <span>{t("approval.approve")}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-slate-50 dark:bg-[#17120e] border-t border-slate-200 dark:border-[#2b241e] flex justify-between items-center text-[11px] text-neutral-500 font-mono">
        <span>{t("approval.auditNotice")}</span>
        <button
          onClick={onClose}
          className="hover:text-slate-700 dark:hover:text-neutral-300 transition-colors cursor-pointer"
        >
          Dismiss overlay
        </button>
      </div>
    </Modal>
  );
}
