import React, { useState, useEffect } from "react";
import { Building2, Plus, Users, Shield, CheckCircle, RefreshCw } from "lucide-react";

interface OrganizationItem {
  id: string;
  name: string;
  slug: string;
  members_count: number;
  agents_count: number;
  plan: string;
  status: string;
  created_at: string;
}

export function AdminOrganizationsPage() {
  const [orgs, setOrgs] = useState<OrganizationItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadOrgs() {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("skyer_access_token");
      const res = await fetch("/api/v1/admin/metrics/organizations", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setOrgs(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrgs();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Organizations & Workspaces</h1>
          <p className="text-xs text-neutral-400">
            Tenant boundaries and team workspace quotas verified from backend persistence.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadOrgs}
            className="p-2 rounded-xl border border-[#262634] bg-[#161620] hover:bg-[#20202c] text-neutral-300 transition-colors cursor-pointer flex items-center gap-2 text-xs"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-neutral-500">Loading organizations...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {orgs.map((org) => (
            <div key={org.id} className="p-5 rounded-2xl bg-[#14141a] border border-[#22222c] space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">{org.name}</h3>
                  <span className="text-[10px] text-neutral-400 font-mono">slug: {org.slug}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
                  {org.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-[#181822] border border-[#242432]">
                  <div className="text-[10px] text-neutral-400">Team Members</div>
                  <div className="font-semibold text-white mt-0.5">{org.members_count} Members</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#181822] border border-[#242432]">
                  <div className="text-[10px] text-neutral-400">Fleet Allocations</div>
                  <div className="font-semibold text-white mt-0.5">{org.agents_count} Agents</div>
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center text-xs border-t border-[#1e1e28]">
                <span className="text-[11px] text-neutral-500 font-mono">Plan: {org.plan}</span>
                <button className="px-3 py-1.5 rounded-lg bg-[#ff7a00]/10 hover:bg-[#ff7a00]/20 text-[#ff7a00] font-medium transition-colors cursor-pointer">
                  Manage Quota
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
