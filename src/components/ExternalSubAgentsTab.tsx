import { useEffect, useState } from "react";
import { Network, RefreshCw, Link2, Unlink, Activity, CheckCircle2, XCircle, Clock, Send, Loader2, GitBranch, KeyRound, AlertTriangle } from "lucide-react";
import { a2aApi, A2AAuthError, A2AHealth, A2AMetrics, Delegation, ExternalAgent, ExternalBinding, operatorKey } from "../services/a2aApi";

const STATUS_STYLE: Record<string, string> = {
  accepted: "text-emerald-300 bg-emerald-500/10 border-emerald-500/30",
  under_review: "text-amber-300 bg-amber-500/10 border-amber-500/30",
  running: "text-sky-300 bg-sky-500/10 border-sky-500/30",
  sent: "text-sky-300 bg-sky-500/10 border-sky-500/30",
  delivered: "text-sky-300 bg-sky-500/10 border-sky-500/30",
  failed: "text-red-300 bg-red-500/10 border-red-500/30",
  timed_out: "text-red-300 bg-red-500/10 border-red-500/30",
  cancelled: "text-slate-500 dark:text-neutral-400 bg-neutral-500/10 border-neutral-500/30",
};

export function ExternalSubAgentsTab({ agentId, agentName }: { agentId: string; agentName: string }) {
  const [agents, setAgents] = useState<ExternalAgent[]>([]);
  const [bindings, setBindings] = useState<ExternalBinding[]>([]);
  const [tasks, setTasks] = useState<Delegation[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [view, setView] = useState<"external" | "delegations">("external");
  const [open, setOpen] = useState<string | null>(null);
  const [objective, setObjective] = useState("");
  const [criteria, setCriteria] = useState("");
  const [target, setTarget] = useState("");
  const [health, setHealth] = useState<A2AHealth | null>(null);
  const [metrics, setMetrics] = useState<A2AMetrics | null>(null);
  const [hasKey, setHasKey] = useState(!!operatorKey.get());
  const [keyInput, setKeyInput] = useState("");
  const parentRef = `agent://core/${agentId.split(":").pop()}`;

  const load = async () => {
    // Public, payload-free reads: directory, bindings, health, metrics.
    const pub = await Promise.allSettled([a2aApi.agents(), a2aApi.bindings(agentId), a2aApi.health(), a2aApi.metrics()]);
    if (pub[0].status === "fulfilled") setAgents(pub[0].value.filter((x) => x.agent_ref !== parentRef));
    if (pub[1].status === "fulfilled") { setBindings(pub[1].value); if (!target && pub[1].value[0]) setTarget(pub[1].value[0].child_agent_ref); }
    if (pub[2].status === "fulfilled") setHealth(pub[2].value);
    if (pub[3].status === "fulfilled") setMetrics(pub[3].value);
    const failed = pub.find((p) => p.status === "rejected") as PromiseRejectedResult | undefined;
    // Ledger (objectives/outputs) requires the operator key.
    if (operatorKey.get()) {
      try { setTasks(await a2aApi.delegations(agentId)); }
      catch (e: any) {
        if (e instanceof A2AAuthError) { operatorKey.set(""); setHasKey(false); setMsg("Operator key rejected"); }
        else setMsg(`Ledger load failed: ${e.message}`);
      }
    } else setTasks([]);
    if (failed) setMsg(`Directory load failed: ${failed.reason?.message || failed.reason}`);
  };
  useEffect(() => {
    load();
    // Directory/ledger change slowly; skip polls while the tab is hidden.
    const i = setInterval(() => { if (!document.hidden) load(); }, 20000);
    return () => clearInterval(i);
  }, [agentId]);

  const run = async (key: string, fn: () => Promise<unknown>, ok: string) => {
    setBusy(key); setMsg(null);
    try { await fn(); setMsg(ok); await load(); }
    catch (e: any) { setMsg(e instanceof A2AAuthError ? "Operator key required for this action" : `Error: ${e.message}`); }
    finally { setBusy(null); }
  };
  const bound = (ref: string) => bindings.find((b) => b.child_agent_ref === ref);

  return (
    <div className="space-y-3 text-xs font-sans">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5"><Network size={13} className="text-[#ff7a00]" />External Sub-Agents</span>
        <div className="flex gap-1">
          <button aria-label="Discover external agents from AgentTeams" onClick={() => run("discover", a2aApi.discover, "Directory synced from AgentTeams")} className="min-h-[44px] min-w-[44px] flex items-center justify-center p-1.5 rounded-lg bg-[#16161f] border border-[#242432] text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:text-white" title="Discover from AgentTeams">
            <RefreshCw size={12} className={busy === "discover" ? "animate-spin" : ""} />
          </button>
          <button onClick={() => run("skill", () => a2aApi.syncSkill(agentId), `Skill synced to ${agentName}`)} aria-label="Sync external sub-agents skill to the parent agent" className="min-h-[44px] px-3 rounded-lg bg-[#ff7a00] text-black font-semibold text-[11px]">Sync Skill</button>
        </div>
      </div>
      {msg && <div className="p-2 rounded-lg bg-[#14141d] border border-[#222232] text-slate-700 dark:text-neutral-300">{msg}</div>}

      {health && (
        <div className={`p-2 rounded-xl border text-[11px] ${health.status === "ok" ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-300" : "border-amber-500/30 bg-amber-500/5 text-amber-300"}`}>
          <div className="flex items-center gap-1.5 font-semibold">{health.status === "ok" ? <CheckCircle2 size={11} /> : <AlertTriangle size={11} />}AgentTeams A2A {health.status}</div>
          {health.reasons.length > 0 && <div className="font-mono text-[10px] mt-0.5">{health.reasons.join(" · ")}</div>}
          {metrics && <div className="font-mono text-[10px] text-slate-500 dark:text-neutral-400 mt-1">24h: {metrics.delegations_total} tasks · accept {Math.round(metrics.acceptance_rate * 100)}% · timeout {Math.round(metrics.timeout_rate * 100)}% · retry {Math.round(metrics.retry_rate * 100)}% · p50 {metrics.latency_seconds_accepted.p50 ?? "-"}s · denied {metrics.policy_denied}</div>}
        </div>
      )}

      {!hasKey ? (
        <div className="flex gap-1">
          <input aria-label="A2A operator key" type="password" value={keyInput} onChange={(e) => setKeyInput(e.target.value)} placeholder="A2A operator key (ledger & actions)" className="flex-1 min-h-[44px] bg-[#1b1b24] border border-[#282836] rounded-lg px-2 py-1 text-slate-900 dark:text-white" />
          <button onClick={() => { operatorKey.set(keyInput.trim()); setHasKey(!!keyInput.trim()); setKeyInput(""); load(); }} aria-label="Unlock operator actions" className="min-h-[44px] flex items-center gap-1 px-3 rounded-lg bg-[#1d1d26] border border-[#282834] text-slate-700 dark:text-neutral-300"><KeyRound size={11} />Unlock</button>
        </div>
      ) : (
        <button onClick={() => { operatorKey.set(""); setHasKey(false); setTasks([]); }} aria-label="Lock operator actions" className="min-h-[44px] text-[10px] text-neutral-500 hover:text-slate-700 dark:text-neutral-300 flex items-center gap-1"><KeyRound size={10} />Operator unlocked · lock</button>
      )}

      {/* Topology */}
      <div className="p-2.5 rounded-xl bg-[#101016] border border-[#20202c] font-mono text-[11px] text-slate-700 dark:text-neutral-300">
        <div className="flex items-center gap-1 text-slate-900 dark:text-white"><GitBranch size={11} />{parentRef}</div>
        {bindings.length === 0 && <div className="pl-3 text-neutral-500">└── (no external sub-agents)</div>}
        {bindings.map((b, i) => (
          <div key={b.id} className="pl-3">{i === bindings.length - 1 ? "└──" : "├──"} external via AgentTeams: <span className="text-[#ff7a00]">{b.child_agent_ref}</span></div>
        ))}
      </div>

      <div className="flex gap-1 p-1 bg-[#14141a] rounded-xl border border-slate-200 dark:border-[#20202a]">
        {(["external", "delegations"] as const).map((v) => (
          <button key={v} aria-pressed={view === v} onClick={() => setView(v)} className={`flex-1 min-h-[44px] rounded-lg ${view === v ? "bg-[#242432] text-slate-900 dark:text-white" : "text-slate-500 dark:text-neutral-400"}`}>
            {v === "external" ? `External (${agents.length})` : `Delegations (${tasks.length})`}
          </button>
        ))}
      </div>

      {view === "external" && agents.map((a) => {
        const b = bound(a.agent_ref);
        return (
          <div key={a.agent_ref} className="p-2.5 rounded-xl border border-[#20202c] bg-[#14141c] space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="text-slate-900 dark:text-white font-semibold truncate">{a.display_name}</div>
                <div className="font-mono text-[10px] text-slate-500 dark:text-neutral-400 truncate">{a.agent_ref}</div>
              </div>
              <span className={`px-2 py-0.5 rounded-full border text-[10px] font-mono ${a.health === "online" ? "text-emerald-300 border-emerald-500/30" : a.health === "degraded" ? "text-amber-300 border-amber-500/30" : "text-slate-500 dark:text-neutral-400 border-neutral-600"}`}>{a.health}</span>
            </div>
            <div className="grid grid-cols-2 gap-x-2 text-[10px] text-slate-500 dark:text-neutral-400 font-mono">
              <span>instance: {a.instance_id}</span><span>node: {a.node || "-"}</span>
              <span className="truncate">worker: {a.agentteams_worker_id}</span><span className="truncate">seen: {a.last_seen_at?.slice(11, 19) || "-"}</span>
            </div>
            {a.capabilities.length > 0 && <div className="flex flex-wrap gap-1">{a.capabilities.map((c) => <span key={c} className="px-1.5 rounded bg-[#1f1f2b] text-[10px] text-slate-700 dark:text-neutral-300">{c}</span>)}</div>}
            <div className="flex gap-1 pt-1">
              <button onClick={() => run(`p${a.agent_ref}`, () => a2aApi.probe(a.agent_ref), `Probed ${a.agent_ref}`)} aria-label={`Probe ${a.agent_ref}`} className="min-h-[44px] flex items-center gap-1 px-3 rounded-lg bg-[#1d1d26] border border-[#282834] text-slate-700 dark:text-neutral-300"><Activity size={11} />Probe</button>
              {b ? (
                <button onClick={() => run(`u${a.agent_ref}`, () => a2aApi.unbind(agentId, a.agent_ref), "Unbound")} aria-label={`Unbind ${a.agent_ref}`} className="min-h-[44px] flex items-center gap-1 px-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300"><Unlink size={11} />Unbind</button>
              ) : (
                <button onClick={() => run(`b${a.agent_ref}`, () => a2aApi.bind(agentId, a.agent_ref, { allowed_modes: ["async"], max_depth: 1, max_parallel_tasks: 1, timeout_seconds: 600, requires_human_approval_for_writes: true }), `Bound ${a.agent_ref}`)} aria-label={`Bind ${a.agent_ref}`} className="min-h-[44px] flex items-center gap-1 px-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"><Link2 size={11} />Bind</button>
              )}
            </div>
          </div>
        );
      })}

      {view === "delegations" && (
        <div className="space-y-2">
          <div className="p-2.5 rounded-xl border border-[#20202c] bg-[#14141c] space-y-1.5">
            <CustomSelect
              aria-label="External sub-agent to delegate to"
              value={target}
              onChange={(val) => setTarget(val)}
              options={bindings.map((b) => ({ value: b.child_agent_ref, label: b.child_agent_ref }))}
              className="w-full"
              triggerClassName="w-full min-h-[44px] bg-[#1b1b24] border border-[#282836] hover:border-[#ff7a00]/40 rounded-lg px-2.5 py-2 text-xs text-white"
            />
            <textarea aria-label="Delegation objective" value={objective} onChange={(e) => setObjective(e.target.value)} placeholder="Objective (read-only by default)" className="w-full h-14 bg-[#1b1b24] border border-[#282836] rounded-lg px-2 py-1 text-slate-900 dark:text-white" />
            <input aria-label="Acceptance criteria separated by semicolons" value={criteria} onChange={(e) => setCriteria(e.target.value)} placeholder="Acceptance criteria; separated by ;" className="w-full min-h-[44px] bg-[#1b1b24] border border-[#282836] rounded-lg px-2 py-1 text-slate-900 dark:text-white" />
            <button disabled={!target || !objective || !criteria || busy === "send"} onClick={() => run("send", () => a2aApi.delegate({ parent_agent_ref: agentId.split(":").pop(), child_agent_ref: target, objective, constraints: ["Read-only"], acceptance_criteria: criteria.split(";").map((s) => s.trim()).filter(Boolean) }), "Delegation sent via AgentTeams")} aria-label="Delegate task via AgentTeams" className="min-h-[44px] flex items-center gap-1 px-3 rounded-lg bg-[#ff7a00] text-black font-semibold disabled:opacity-50">
              {busy === "send" ? <Loader2 size={11} className="animate-spin" /> : <Send size={11} />}Delegate
            </button>
          </div>
          {tasks.map((t) => (
            <div key={t.id} className="p-2.5 rounded-xl border border-[#20202c] bg-[#14141c] space-y-1">
              <button aria-expanded={open === t.id} aria-label={`Delegation ${t.correlation_id} ${t.status}`} onClick={() => setOpen(open === t.id ? null : t.id)} className="w-full min-h-[44px] text-left">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] text-slate-700 dark:text-neutral-300 truncate">{t.correlation_id}</span>
                  <span className={`px-2 py-0.5 rounded-full border text-[10px] font-mono ${STATUS_STYLE[t.status] || "text-slate-700 dark:text-neutral-300 border-neutral-600"}`}>{t.status} · a{t.attempt}</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-neutral-400 truncate">{t.child_agent_ref} — {t.summary || t.objective}</div>
              </button>
              {open === t.id && (
                <div className="space-y-1.5 pt-1 border-t border-slate-200 dark:border-[#22222e]">
                  <div className="text-[10px] font-mono text-neutral-500">transport msg: {t.transport_message_id?.slice(0, 24)} · session: {t.child_session_id || "-"}</div>
                  {t.output && <pre className="whitespace-pre-wrap text-[11px] text-slate-800 dark:text-neutral-200 bg-[#0e0e12] p-2 rounded-lg max-h-48 overflow-auto">{t.output}</pre>}
                  {t.evidence.length > 0 && <div className="text-[10px] text-slate-500 dark:text-neutral-400">Evidence: {t.evidence.map((e) => `${e.type}:${e.ref}`).join(", ")}</div>}
                  <div className="space-y-0.5">{t.acceptance_criteria.map((c) => {
                    const r = t.self_check.find((s) => s.criterion === c)?.result;
                    return <div key={c} className="flex items-center gap-1 text-[11px]">{r === "pass" ? <CheckCircle2 size={11} className="text-emerald-400" /> : r === "fail" ? <XCircle size={11} className="text-red-400" /> : <Clock size={11} className="text-neutral-500" />}<span className="text-slate-700 dark:text-neutral-300">{c}</span></div>;
                  })}</div>
                  {t.acceptance && <div className="text-[10px] text-slate-500 dark:text-neutral-400">Decision: {t.acceptance.decision} {t.acceptance.reason || t.acceptance.feedback || ""} {t.acceptance.reviewer ? `by ${t.acceptance.reviewer}` : ""}</div>}
                  <div className="flex gap-1">
                    {t.status === "under_review" && <>
                      <button onClick={() => run(`a${t.id}`, () => a2aApi.review(t.id, "accept"), "Accepted")} aria-label="Accept delegation result" className="min-h-[44px] px-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">Accept</button>
                      <button onClick={() => { const f = window.prompt("Reject feedback (one retry)"); if (f) run(`r${t.id}`, () => a2aApi.review(t.id, "reject", f), "Rejected → retry queued"); }} aria-label="Reject delegation result and retry once" className="min-h-[44px] px-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300">Reject + retry</button>
                    </>}
                    {["sent", "delivered", "running"].includes(t.status) && <button onClick={() => run(`c${t.id}`, () => a2aApi.cancel(t.id), "Cancelled")} aria-label="Cancel delegation" className="min-h-[44px] px-3 rounded-lg bg-[#1d1d26] border border-[#282834] text-slate-700 dark:text-neutral-300">Cancel</button>}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
