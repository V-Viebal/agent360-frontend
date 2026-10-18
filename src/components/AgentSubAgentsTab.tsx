import { useTranslation } from "../i18n/LanguageContext";
import { operatorKey } from "../services/a2aApi";
import { useEffect, useMemo, useState } from "react";
import { Loader2, Plus, RefreshCw, Trash2, Zap, Network, CheckCircle2, XCircle, Clock, Send, RotateCcw, Ban, ScanSearch } from "lucide-react";
import { InfraAgent } from "../types/agent";
import {
  AcceptanceCheck,
  DelegationMode,
  DelegationTask,
  SubAgentBinding,
  SubAgentHealth,
  normalizeAgentId,
  subAgentApi,
  SkillSyncStatus,
  SubAgentAuthError,
} from "../services/subAgentApi";

interface Props {
  agentId: string;
  agentName: string;
  allAgents: InfraAgent[];
}

const STATUS_STYLE: Record<string, string> = {
  accepted: "text-emerald-300 bg-emerald-500/10 border-emerald-500/25",
  completed: "text-sky-300 bg-sky-500/10 border-sky-500/25",
  under_review: "text-amber-300 bg-amber-500/10 border-amber-500/25",
  running: "text-[#ff7a00] bg-[#ff7a00]/10 border-[#ff7a00]/25",
  queued: "text-slate-700 dark:text-neutral-300 bg-neutral-500/10 border-neutral-500/25",
  retry_queued: "text-slate-700 dark:text-neutral-300 bg-neutral-500/10 border-neutral-500/25",
  rejected: "text-rose-300 bg-rose-500/10 border-rose-500/25",
  failed: "text-rose-300 bg-rose-500/10 border-rose-500/25",
  timed_out: "text-rose-300 bg-rose-500/10 border-rose-500/25",
  cancelled: "text-slate-500 dark:text-neutral-400 bg-neutral-500/10 border-neutral-500/25",
};

function Badge({ status }: { status: string }) {
  return (
    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${STATUS_STYLE[status] || STATUS_STYLE.queued}`}>
      {status}
    </span>
  );
}

export function AgentSubAgentsTab({ agentId, agentName, allAgents }: Props) {
  const { t } = useTranslation();
  const parent = normalizeAgentId(agentId);
  const [view, setView] = useState<"subagents" | "delegations">("subagents");
  const [bindings, setBindings] = useState<SubAgentBinding[]>([]);
  const [health, setHealth] = useState<Record<string, SubAgentHealth>>({});
  const [tasks, setTasks] = useState<DelegationTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ text: string; ok: boolean } | null>(null);
  const [form, setForm] = useState({ child: "", role: "", capabilities: "", timeout: 300 });
  const [dlg, setDlg] = useState({ child: "", mode: "sync" as DelegationMode, objective: "", criteria: "" });
  const [pageSize, setPageSize] = useState<number>(20);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [skill, setSkill] = useState<SkillSyncStatus | null>(null);
  const [hasKey, setHasKey] = useState(!!operatorKey.get());
  const [keyInput, setKeyInput] = useState("");

  const candidates = useMemo(
    () =>
      allAgents
        .map((a) => normalizeAgentId(a.id))
        .filter((id) => id !== parent && !bindings.some((b) => b.child_agent_id === id)),
    [allAgents, bindings, parent]
  );

  const flash = (text: string, ok = true) => {
    setNotice({ text, ok });
    setTimeout(() => setNotice(null), 5000);
  };

  const load = async () => {
    setLoading(true);
    try {
      const [bRes, hRes, tRes, st] = await Promise.all([
        subAgentApi.list(parent).catch(() => [] as SubAgentBinding[]),
        subAgentApi.health(parent).catch(() => [] as SubAgentHealth[]),
        subAgentApi.delegations(parent, pageSize).catch(() => [] as DelegationTask[]),
        subAgentApi.skillStatus(parent).catch(() => null),
      ]);
      setSkill(st);
      setBindings(bRes);
      setHealth(Object.fromEntries(hRes.map((x) => [x.child_agent_id, x])));
      setTasks(tRes);
    } catch (e: any) {
      flash(e.message, false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [parent, pageSize]);

  useEffect(() => {
    const running = tasks.filter((t) => t.mode === "async" && ["running", "queued", "retry_queued"].includes(t.status));
    if (running.length === 0) return;
    const timer = setInterval(async () => {
      for (const t of running) {
        try {
          const updated = await subAgentApi.syncStatus(t.id);
          setTasks((prev) => prev.map((x) => (x.id === t.id ? updated : x)));
        } catch {
          /* keep polling */
        }
      }
    }, 15000);
    return () => clearInterval(timer);
  }, [tasks]);

  useEffect(() => {
    if (!skill || !["pending", "syncing"].includes(skill.state)) return;
    const timer = setTimeout(async () => {
      try {
        setSkill(await subAgentApi.skillStatus(parent));
      } catch {
        /* keep last state */
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, [skill, parent]);

  const run = async (key: string, fn: () => Promise<void>) => {
    setBusy(key);
    try {
      await fn();
    } catch (e: any) {
      if (e instanceof SubAgentAuthError) {
        operatorKey.set("");
        setHasKey(false);
      }
      flash(e.message, false);
    } finally {
      setBusy(null);
    }
  };

  const resyncSkill = () =>
    run("skill", async () => {
      setSkill(await subAgentApi.syncSkillAsync(parent));
    });


  const addBinding = () =>
    run("bind", async () => {
      if (!form.child) return;
      await subAgentApi.upsert(parent, form.child, {
        role: form.role || undefined,
        capabilities: form.capabilities.split(",").map((s) => s.trim()).filter(Boolean),
        timeout_seconds: form.timeout,
      });
      setForm({ child: "", role: "", capabilities: "", timeout: 300 });
      flash(`Bound ${form.child}; skill agent360-subagents is syncing into ${agentName} in the background`);
      await load();
    });

  const createDelegation = () =>
    run("dlg", async () => {
      const t = await subAgentApi.create({
        parent_agent_id: parent,
        child_agent_id: dlg.child,
        mode: dlg.mode,
        objective: dlg.objective,
        acceptance_criteria: dlg.criteria.split("\n").map((s) => s.trim()).filter(Boolean),
      });
      setTasks((prev) => [t, ...prev]);
      setDlg({ ...dlg, objective: "", criteria: "" });
      flash(`Delegation ${t.id} → ${t.child_agent_id}: ${t.status}`, !["failed", "timed_out"].includes(t.status));
      setView("delegations");
    });

  const review = (t: DelegationTask, decision: "accepted" | "rejected", reviewer: "human" | "rule-based") =>
    run(`review-${t.id}`, async () => {
      const checks: AcceptanceCheck[] | undefined =
        reviewer === "human" ? t.acceptance_criteria.map((c) => ({ criterion: c, result: decision === "accepted" ? "pass" : "fail", evidence: "human review" })) : undefined;
      const updated = await subAgentApi.review(t.id, { decision, reviewer, checks, reason: `${reviewer} ${decision}` });
      setTasks((prev) => prev.map((x) => (x.id === t.id ? updated : x)));
    });

  const retry = (t: DelegationTask) =>
    run(`retry-${t.id}`, async () => {
      const feedback = window.prompt("Feedback for the sub-agent (required):", t.acceptance?.reason || "");
      if (!feedback) return;
      const objective = window.prompt("Revised objective (optional — leave as-is to keep):", t.objective) || undefined;
      const criteriaText = window.prompt("Revised acceptance criteria, separated by ';' (optional):", t.acceptance_criteria.join("; ")) || "";
      const criteria = criteriaText.split(";").map((x) => x.trim()).filter(Boolean);
      const updated = await subAgentApi.retry(t.id, feedback, {
        objective: objective && objective !== t.objective ? objective : undefined,
        acceptance_criteria: criteria.length && criteria.join("; ") !== t.acceptance_criteria.join("; ") ? criteria : undefined,
      });
      setTasks((prev) => prev.map((x) => (x.id === t.id ? updated : x)));
    });

  return (
    <div className="space-y-3 text-xs font-sans">
      {notice && (
        <div className={`p-2 rounded-lg border text-[11px] ${notice.ok ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" : "bg-rose-500/10 border-rose-500/30 text-rose-300"}`}>
          {notice.text}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 p-2 bg-[#14141a] rounded-xl border border-slate-200 dark:border-[#20202a] text-[10px] font-mono">
        <span className="text-neutral-500">skill</span>
        <span
          data-testid="skill-sync-state"
          className={`px-1.5 py-0.5 rounded border ${
            skill?.state === "synced"
              ? "text-emerald-300 border-emerald-500/30"
              : skill?.state === "failed"
                ? "text-rose-300 border-rose-500/30"
                : skill && ["pending", "syncing"].includes(skill.state)
                  ? "text-amber-300 border-amber-500/30"
                  : "text-slate-500 dark:text-neutral-400 border-[#2b2b3d]"
          }`}
          title={skill?.error || (skill?.synced_at ? `synced ${skill.synced_at}` : "")}
        >
          {skill?.state ?? "unknown"}
          {skill?.duration_ms != null && skill.state === "synced" ? ` · ${skill.duration_ms}ms` : ""}
        </span>
        <button onClick={resyncSkill} disabled={busy === "skill"} className="px-2 py-0.5 rounded-md bg-[#1f1f2b] border border-[#2b2b3d] text-slate-800 dark:text-neutral-200 cursor-pointer disabled:opacity-50">
          Re-sync skill
        </button>
        <span className="ml-auto flex items-center gap-1">
          {hasKey ? (
            <button
              onClick={() => {
                operatorKey.set("");
                setHasKey(false);
              }}
              className="text-neutral-500 hover:text-slate-700 dark:text-neutral-300 cursor-pointer"
            >
              operator unlocked · lock
            </button>
          ) : (
            <>
              <input
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="operator key"
                aria-label="Operator key"
                className="w-28 px-1.5 py-0.5 rounded bg-[#0f0f14] border border-[#2b2b3d] text-slate-800 dark:text-neutral-200"
              />
              <button
                onClick={() => {
                  operatorKey.set(keyInput.trim());
                  setHasKey(!!keyInput.trim());
                  setKeyInput("");
                }}
                className="px-2 py-0.5 rounded-md bg-[#1f1f2b] border border-[#2b2b3d] text-slate-800 dark:text-neutral-200 cursor-pointer"
              >
                Unlock
              </button>
            </>
          )}
        </span>
      </div>

      <div className="flex items-center gap-1 p-1 bg-[#14141a] rounded-xl border border-slate-200 dark:border-[#20202a] text-[11px]">
        {(["subagents", "delegations"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`flex-1 py-1 rounded-lg font-medium cursor-pointer ${view === v ? "bg-[#242432] text-slate-900 dark:text-white" : "text-slate-500 dark:text-neutral-400 hover:text-slate-800 dark:text-neutral-200"}`}
          >
            {v === "subagents" ? `Sub-Agents (${bindings.length})` : `Delegations (${tasks.length})`}
          </button>
        ))}
        <button onClick={load} className="p-1.5 text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:text-white cursor-pointer" title="Refresh">
          <RefreshCw size={12} className={loading ? "animate-spin text-[#ff7a00]" : ""} />
        </button>
      </div>

      {/* Topology */}
      <div className="p-2.5 rounded-xl bg-[#14141c] border border-slate-200 dark:border-slate-200 dark:border-[#22222e] font-mono text-[11px] text-slate-700 dark:text-neutral-300">
        <div className="flex items-center gap-1.5 text-slate-900 dark:text-white font-semibold mb-1">
          <Network size={12} className="text-[#ff7a00]" /> {parent}
        </div>
        {bindings.length === 0 && <div className="text-neutral-500 pl-3">{t("subagents.noSubagents")}</div>}
        {bindings.map((b, i) => {
          const ts = tasks.filter((t) => t.child_agent_id === b.child_agent_id);
          const running = ts.filter((t) => ["running", "queued", "retry_queued"].includes(t.status)).length;
          const accepted = ts.filter((t) => t.status === "accepted").length;
          const failed = ts.filter((t) => ["failed", "timed_out"].includes(t.status)).length;
          return (
            <div key={b.id} className="pl-3">
              {i === bindings.length - 1 ? "└──" : "├──"} {b.child_agent_id}{" "}
              <span className="text-neutral-500">[{running} running, {accepted} accepted{failed ? `, ${failed} failed` : ""}]</span>
            </div>
          );
        })}
      </div>

      {view === "subagents" && (
        <div className="space-y-2">
          {bindings.map((b) => {
            const h = health[b.child_agent_id];
            return (
              <div key={b.id} className="p-2.5 rounded-xl border border-[#20202c] bg-[#14141c] space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className={`h-2 w-2 rounded-full ${h?.callable ? "bg-emerald-400" : "bg-rose-400"}`} title={h?.callable ? "online" : "offline/disabled"} />
                    <span className="font-semibold text-slate-900 dark:text-white">{b.child_agent_id}</span>
                    <span className="text-neutral-500 truncate">· {b.role}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      disabled={busy === `probe-${b.child_agent_id}`}
                      onClick={() =>
                        run(`probe-${b.child_agent_id}`, async () => {
                          const r = await subAgentApi.probe(parent, b.child_agent_id);
                          flash(r.ok ? `Probe ${b.child_agent_id}: ${r.output}` : `Probe failed: ${r.error}`, r.ok);
                        })
                      }
                      className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#1f1f2b] border border-[#2b2b3d] text-slate-700 dark:text-neutral-300 hover:text-slate-900 dark:text-white cursor-pointer"
                    >
                      {busy === `probe-${b.child_agent_id}` ? <Loader2 size={11} className="animate-spin" /> : <Zap size={11} />} Probe
                    </button>
                    <button
                      onClick={() =>
                        window.confirm(`Unbind ${b.child_agent_id} from ${parent}?`) &&
                        run(`rm-${b.child_agent_id}`, async () => {
                          await subAgentApi.remove(parent, b.child_agent_id);
                          flash(`Unbound ${b.child_agent_id}; skill re-synced`);
                          await load();
                        })
                      }
                      className="p-1 rounded-md text-neutral-500 hover:text-rose-400 cursor-pointer"
                      title="Unbind"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {b.capabilities.map((c) => (
                    <span key={c} className="text-[10px] px-1.5 py-0.5 rounded bg-[#1d1d27] border border-[#2a2a38] text-slate-700 dark:text-neutral-300">{c}</span>
                  ))}
                </div>
                <div className="text-[10px] font-mono text-neutral-500">
                  modes: {b.allowed_modes.join("/")} · timeout {b.timeout_seconds}s · parallel {b.max_parallel_tasks} · depth {b.max_depth} · skill:{" "}
                  <span className="text-emerald-400">agent360-subagents</span>
                </div>
              </div>
            );
          })}

          <div className="p-2.5 rounded-xl border border-dashed border-[#2a2a38] bg-[#121218] space-y-1.5">
            <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1"><Plus size={12} /> Bind sub-agent</div>
            <select value={form.child} onChange={(e) => setForm({ ...form, child: e.target.value })} className="w-full bg-[#1b1b24] border border-[#282836] rounded-lg px-2 py-1 text-slate-900 dark:text-white">
              <option value="">{t("subagents.selectAgent")}</option>
              {candidates.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Role (e.g. Product Owner)" className="w-full bg-[#1b1b24] border border-[#282836] rounded-lg px-2 py-1 text-slate-900 dark:text-white" />
            <input value={form.capabilities} onChange={(e) => setForm({ ...form, capabilities: e.target.value })} placeholder="Capabilities, comma separated" className="w-full bg-[#1b1b24] border border-[#282836] rounded-lg px-2 py-1 text-slate-900 dark:text-white" />
            <button disabled={!form.child || busy === "bind"} onClick={addBinding} className="w-full py-1.5 rounded-lg bg-[#ff7a00] text-black font-semibold disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1">
              {busy === "bind" ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />} Bind & sync skill
            </button>
          </div>
        </div>
      )}

      {view === "delegations" && (
        <div className="space-y-2">
          <div className="p-2.5 rounded-xl border border-[#2a2a38] bg-[#121218] space-y-1.5">
            <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1"><Send size={12} /> New delegation</div>
            <div className="flex gap-1">
              <select value={dlg.child} onChange={(e) => setDlg({ ...dlg, child: e.target.value })} className="flex-1 bg-[#1b1b24] border border-[#282836] rounded-lg px-2 py-1 text-slate-900 dark:text-white">
                <option value="">{t("subagents.subagentPlaceholder")}</option>
                {bindings.filter((b) => b.enabled).map((b) => <option key={b.child_agent_id} value={b.child_agent_id}>{b.child_agent_id}</option>)}
              </select>
              <select value={dlg.mode} onChange={(e) => setDlg({ ...dlg, mode: e.target.value as DelegationMode })} className="bg-[#1b1b24] border border-[#282836] rounded-lg px-2 py-1 text-slate-900 dark:text-white">
                <option value="sync">{t("subagents.sync")}</option>
                <option value="async">{t("subagents.async")}</option>
              </select>
            </div>
            <textarea value={dlg.objective} onChange={(e) => setDlg({ ...dlg, objective: e.target.value })} rows={2} placeholder="Objective" className="w-full bg-[#1b1b24] border border-[#282836] rounded-lg px-2 py-1 text-slate-900 dark:text-white" />
            <textarea value={dlg.criteria} onChange={(e) => setDlg({ ...dlg, criteria: e.target.value })} rows={2} placeholder="Acceptance criteria, one per line (e.g. Output contains 'DONE')" className="w-full bg-[#1b1b24] border border-[#282836] rounded-lg px-2 py-1 text-slate-900 dark:text-white" />
            <div className="flex gap-1">
              <button disabled={!dlg.child || !dlg.objective || busy === "dlg"} onClick={createDelegation} className="flex-1 py-1.5 rounded-lg bg-[#ff7a00] text-black font-semibold disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1">
                {busy === "dlg" ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />} Delegate
              </button>
              <button
                onClick={() =>
                  run("ingest", async () => {
                    const r = await subAgentApi.ingestNative(parent);
                    flash(`Imported ${r.ingested} autonomous delegation(s) from ${parent}'s tool calls`);
                    await load();
                  })
                }
                className="px-2 rounded-lg bg-[#1f1f2b] border border-[#2b2b3d] text-slate-700 dark:text-neutral-300 hover:text-slate-900 dark:text-white cursor-pointer flex items-center gap-1"
                title="Import chat_with_agent / submit_to_agent calls made by the agent itself"
              >
                {busy === "ingest" ? <Loader2 size={12} className="animate-spin" /> : <ScanSearch size={12} />} Sync agent calls
              </button>
            </div>
          </div>

          {tasks.length === 0 && <div className="py-6 text-center text-neutral-500 font-mono">{t("subagents.noDelegations")}</div>}
          {tasks.map((task) => (
            <div key={task.id} className="p-2.5 rounded-xl border border-[#20202c] bg-[#14141c] space-y-1.5">
              <div className="flex items-center justify-between gap-2 cursor-pointer" onClick={() => setExpanded(expanded === task.id ? null : task.id)}>
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="font-mono text-slate-500 dark:text-neutral-400">{task.parent_agent_id}→</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{task.child_agent_id}</span>
                  <span className="text-[10px] font-mono text-neutral-500">{task.mode}{task.source === "native-tool-call" ? " · auto" : ""} · #{task.attempt}</span>
                </div>
                <Badge status={task.status} />
              </div>
              <p className="text-slate-700 dark:text-neutral-300 line-clamp-2">{task.objective}</p>
              {expanded === task.id && (
                <div className="space-y-1.5 pt-1 border-t border-[#20202c]">
                  {task.output && <pre className="whitespace-pre-wrap text-[11px] text-slate-800 dark:text-neutral-200 bg-[#0f0f14] p-2 rounded-lg max-h-48 overflow-y-auto">{task.output}</pre>}
                  {task.error && <div className="text-rose-300 text-[11px]">Error: {task.error}</div>}
                  {task.acceptance && (
                    <div className="space-y-0.5">
                      <div className="text-[10px] font-mono text-slate-500 dark:text-neutral-400">
                        {task.acceptance.reviewer}: {task.acceptance.decision} ({task.acceptance.score}) — {task.acceptance.reason}
                      </div>
                      {task.acceptance.checks.map((c) => (
                        <div key={c.criterion} className="flex items-start gap-1 text-[11px]">
                          {c.result === "pass" ? <CheckCircle2 size={11} className="text-emerald-400 mt-0.5" /> : c.result === "fail" ? <XCircle size={11} className="text-rose-400 mt-0.5" /> : <Clock size={11} className="text-amber-400 mt-0.5" />}
                          <span className="text-slate-700 dark:text-neutral-300">{c.criterion}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="text-[10px] font-mono text-neutral-500 break-all">
                    {task.native_task_id && <>task: {task.native_task_id} · </>}session: {task.session_id || "-"}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {["completed", "under_review"].includes(task.status) && (
                      <>
                        <button onClick={() => review(task, "accepted", "rule-based")} className="px-2 py-0.5 rounded-md bg-[#1f1f2b] border border-[#2b2b3d] text-slate-800 dark:text-neutral-200 cursor-pointer">{t("subagents.ruleCheck")}</button>
                        <button onClick={() => review(task, "accepted", "human")} className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 cursor-pointer">{t("subagents.accept")}</button>
                        <button onClick={() => review(task, "rejected", "human")} className="px-2 py-0.5 rounded-md bg-rose-500/15 border border-rose-500/30 text-rose-300 cursor-pointer">{t("subagents.reject")}</button>
                      </>
                    )}
                    {task.status === "rejected" && task.attempt < task.max_attempts && (
                      <button onClick={() => retry(task)} className="px-2 py-0.5 rounded-md bg-[#ff7a00]/15 border border-[#ff7a00]/30 text-[#ff7a00] cursor-pointer flex items-center gap-1"><RotateCcw size={11} /> Retry</button>
                    )}
                    {["running", "queued", "retry_queued"].includes(task.status) && (
                      <>
                        {task.mode === "async" && (
                          <button onClick={() => run(`s-${task.id}`, async () => { const u = await subAgentApi.syncStatus(task.id); setTasks((p) => p.map((x) => (x.id === task.id ? u : x))); })} className="px-2 py-0.5 rounded-md bg-[#1f1f2b] border border-[#2b2b3d] text-slate-800 dark:text-neutral-200 cursor-pointer">{t("subagents.checkStatus")}</button>
                        )}
                        <button onClick={() => run(`c-${task.id}`, async () => { const u = await subAgentApi.cancel(task.id); setTasks((p) => p.map((x) => (x.id === task.id ? u : x))); })} className="px-2 py-0.5 rounded-md bg-[#1f1f2b] border border-[#2b2b3d] text-slate-500 dark:text-neutral-400 cursor-pointer flex items-center gap-1"><Ban size={11} /> Cancel</button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Pagination Controls */}
          {tasks.length > 0 && (
            <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)] text-[11px] font-mono text-neutral-400 select-none">
              <span>Showing up to {pageSize} delegations</span>
              <div className="flex items-center gap-1.5">
                {[10, 20, 50].map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setPageSize(sz)}
                    className={`px-2 py-0.5 rounded text-[10px] cursor-pointer transition-colors ${
                      pageSize === sz
                        ? "bg-[#ff7a00] text-black font-bold"
                        : "bg-neutral-500/10 hover:bg-neutral-500/20 text-neutral-300"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
