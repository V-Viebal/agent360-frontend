import { SeoHead } from "../components/SeoHead";
import { useState } from "react";
import { useTranslation } from "../i18n/LanguageContext";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  ShieldCheck,
  Cpu,
  Terminal,
  Play,
  ArrowLeft,
  Sparkles,
  Layers,
  Database,
  ExternalLink,
  Users,
  CheckCircle2,
  Workflow,
  Wrench,
  Boxes,
} from "lucide-react";
import { MARKETPLACE_AGENTS } from "../data/mockMarketplaceAgents";
import { AgentMarketplaceItem } from "../types/marketplace";

export function AgentDetailPage() {
  const { t, language } = useTranslation();
  const isVi = language === "vi";
  const params = useParams<{ id?: string; agentId?: string }>();
  const id = params.agentId || params.id;
  const navigate = useNavigate();
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "team" | "terminal" | "spec">("overview");

  const agent: AgentMarketplaceItem | undefined = MARKETPLACE_AGENTS.find((a) => a.id === id);

  if (!agent) {
    return (
      <div className="pt-32 pb-24 min-h-screen text-[var(--text-primary)] text-center px-4">
        <h2 className="text-2xl font-semibold mb-2">{isVi ? "Không tìm thấy hồ sơ nhân viên AI" : "Agent Template Not Found"}</h2>
        <p className="text-[var(--text-muted)] text-sm mb-6">
          {isVi ? "Hồ sơ vị trí nhân viên AI được yêu cầu không tồn tại hoặc đã ngừng cung cấp." : "The requested agent specification does not exist or has been retired."}
        </p>
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--surface-hover)] border border-[var(--border-subtle)] text-sm font-medium hover:border-[#c2540a]/40 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> {isVi ? "Quay lại Chợ Nhân viên" : "Back to Marketplace"}
        </Link>
      </div>
    );
  }

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(agent.samplePrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleLaunchChat = () => {
    navigate(`/app?template=${agent.id}&prompt=${encodeURIComponent(agent.samplePrompt)}`);
  };

  return (
    <div className="pt-24 pb-28 min-h-screen text-[var(--text-primary)] font-sans">
      <SeoHead
        title={`${agent.name} (${agent.roleTitle}) — Skyer AI Employee Specification`}
        description={`${agent.description} Equipped with ${agent.tools.join(", ")} on the Skyer AgentCore runtime.`}
        keywords={`${agent.name}, ${agent.roleTitle}, ${agent.department}, Skyer AI Employee, ${agent.tools.join(", ")}`}
        canonicalPath={`/marketplace/${agent.id}`}
        ogType="product"
        breadcrumbs={[
          { name: "Skyer Home", url: "/" },
          { name: "Marketplace", url: "/marketplace" },
          { name: agent.name, url: `/marketplace/${agent.id}` },
        ]}
        softwareSpec={{
          name: `${agent.name} — ${agent.roleTitle}`,
          category: agent.department,
          role: agent.roleTitle,
          tools: agent.tools,
        }}
        aeoSummary={{
          question: `What does the ${agent.name} (${agent.roleTitle}) AI employee do in Skyer?`,
          directAnswer: `${agent.name} is a specialized ${agent.department} AI teammate on Skyer (${agent.roleTitle}). ${agent.description}`,
          keyFacts: [
            `Department: ${agent.department}`,
            `Authorized Toolchain: ${agent.tools.join(", ")}`,
            `Routines: ${agent.routines.join("; ")}`,
          ],
        }}
      />
      <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] hover:text-[#c2540a] mb-8 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> {isVi ? "QUAY LẠI CHỢ NHÂN VIÊN" : "BACK TO MARKETPLACE"}
        </Link>

        {/* Hero Card */}
        <div className="relative rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 sm:p-8 backdrop-blur-xl shadow-2xl overflow-hidden mb-8">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#c2540a]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#c2540a]/20 to-transparent border border-[#c2540a]/30 flex items-center justify-center shrink-0">
                <Sparkles className="w-8 h-8 text-[#c2540a]" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                    {agent.name}
                  </h1>
                  {agent.verified && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono text-emerald-400">
                      <ShieldCheck className="w-3 h-3" /> {isVi ? "ĐÃ KIỂM ĐỊNH" : "VERIFIED"}
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-[var(--text-muted)]">
                    {agent.department}
                  </span>
                </div>
                <p className="text-sm font-mono text-[#c2540a] mb-2">{agent.roleTitle}</p>
                <p className="text-xs text-[var(--text-muted)] max-w-2xl">{agent.summary}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
              <button
                onClick={handleLaunchChat}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#252522] dark:bg-[#f8a87c] text-[#FFFCFA] dark:text-black font-medium text-xs sm:text-sm hover:opacity-90 transition-all cursor-pointer shadow-xs"
              >
                <Play className="w-4 h-4 fill-white" /> {isVi ? "Bắt đầu làm việc cùng Bot" : "Launch AI Teammate"}
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-[var(--border-subtle)] text-xs">
            <div>
              <span className="block text-[var(--text-muted)] font-mono text-[10px] uppercase">
                {isVi ? "Đang hoạt động" : "Active Deploys"}
              </span>
              <span className="font-semibold text-sm">{agent.installCount.toLocaleString()}</span>
            </div>
            <div>
              <span className="block text-[var(--text-muted)] font-mono text-[10px] uppercase">
                {isVi ? "Tầng bộ nhớ" : "Memory Layer"}
              </span>
              <span className="font-semibold text-sm">{agent.memoryType}</span>
            </div>
            <div>
              <span className="block text-[var(--text-muted)] font-mono text-[10px] uppercase">
                {isVi ? "Cổng kiểm soát" : "Authority Gate"}
              </span>
              <span className="font-semibold text-sm">{agent.authorityGate}</span>
            </div>
            <div>
              <span className="block text-[var(--text-muted)] font-mono text-[10px] uppercase">
                {isVi ? "Mô hình phối hợp" : "Team Topology"}
              </span>
              <span className="font-semibold text-sm">{agent.teamConfig.collaborationMode}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-2 sm:inline-flex items-center gap-1.5 p-1.5 rounded-2xl sm:rounded-full bg-[#F3EDE4] dark:bg-white/[0.04] border border-[#E6DFD5] dark:border-white/10 mb-8">
          {(
            [
              { id: "overview", label: isVi ? "Tổng quan" : "Overview", icon: Sparkles },
              { id: "team", label: isVi ? "Phối hợp ACP" : "Team (ACP)", icon: Workflow },
              { id: "terminal", label: isVi ? "Máy tính riêng" : "Workstation", icon: Terminal },
              { id: "spec", label: isVi ? "Công cụ & Tích hợp" : "Integrations", icon: Wrench },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2 text-xs font-medium rounded-xl sm:rounded-full transition-all cursor-pointer ${
                  active
                    ? "bg-[#FFFDF9] dark:bg-[#252522] text-[#252522] dark:text-white shadow-xs border border-[#E6DFD5]/80 dark:border-white/15"
                    : "text-[#252522]/65 dark:text-neutral-400 hover:text-[#252522] dark:hover:text-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-card)]">
              <div className="p-4 rounded-lg bg-black/20 border border-white/5 font-mono text-xs text-[var(--text-primary)]">
                <span className="text-[#c2540a] font-semibold">{isVi ? "Mục tiêu: " : "Goal: "}</span>
                {agent.goal}
              </div>
            </div>

            <div className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-card)]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">{isVi ? "Câu lệnh Giao việc Mẫu" : "Standard Kickoff Prompt"}</h3>
                <button
                  onClick={handleCopyPrompt}
                  className="text-xs font-mono text-[#c2540a] hover:underline"
                >
                  {copiedPrompt ? (isVi ? "✓ Đã sao chép" : "✓ Copied to clipboard") : (isVi ? "Sao chép câu lệnh" : "Copy Prompt")}
                </button>
              </div>
              <div className="p-4 rounded-lg bg-black/40 border border-white/10 font-mono text-xs text-[var(--text-muted)] overflow-x-auto whitespace-pre-wrap">
                {agent.samplePrompt}
              </div>
            </div>

            <div className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-card)]">
              <h3 className="text-sm font-semibold mb-3">{isVi ? "Các Quy trình Định kỳ Chủ đạo" : "Core Operating Routines"}</h3>
              <ul className="space-y-2">
                {agent.routines.map((routine, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{routine}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === "team" && (
          <div className="space-y-6">
            <div className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-card)]">
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#c2540a]" />
                {isVi ? "Phương thức Phối hợp Đội ngũ:" : "Collaborative Team Mode:"} {agent.teamConfig.collaborationMode}
              </h3>


              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                {agent.teamConfig.teammateRoles.map((role, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg border border-[var(--border-subtle)] bg-white/[0.02] flex items-center gap-2 text-xs font-mono"
                  >
                    <div className="w-2 h-2 rounded-full bg-[#c2540a]" />
                    <span>{role}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-lg bg-black/20 border border-white/5 text-xs">
                <span className="font-semibold text-[#c2540a] block mb-1">{isVi ? "Kết quả Bàn giao Kỳ vọng:" : "Expected Output Deliverable:"}</span>
                <span className="text-[var(--text-muted)] font-mono">
                  {agent.teamConfig.expectedOutput}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "terminal" && (
          <div className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-card)] font-mono">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4 text-xs text-[var(--text-muted)]">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>{isVi ? "Cửa sổ Điều khiển Container Sandbox (/app/working)" : "Sandbox Container Console (/app/working)"}</span>
              </div>
              <span className="text-[10px] text-emerald-400">{isVi ? "TRẠNG THÁI: SẴN SÀNG" : "STATUS: READY"}</span>
            </div>
            <div className="bg-black/60 p-4 rounded-lg text-xs leading-relaxed overflow-x-auto space-y-1.5 text-zinc-300">
              {agent.terminalPreview.map((line, idx) => (
                <div key={idx} className={line.startsWith("$") ? "text-emerald-400" : ""}>
                  {line}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "spec" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-card)]">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-[#c2540a]" />
                {isVi ? "Công cụ MCP Được Gán" : "MCP Tools Bound"}
              </h3>
              <div className="flex flex-wrap gap-2">
                {agent.tools.map((tool, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-mono text-zinc-300"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-card)]">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Boxes className="w-4 h-4 text-[#c2540a]" />
                {isVi ? "Hệ thống Tích hợp Kết nối" : "Connected Integrations"}
              </h3>
              <div className="flex flex-wrap gap-2">
                {agent.integrations.map((integration, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md bg-[#c2540a]/10 border border-[#c2540a]/30 text-xs font-mono text-[#c2540a]"
                  >
                    {integration}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
