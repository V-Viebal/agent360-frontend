import React from "react";
import { Settings, Shield, Key, Database, RefreshCw, CheckCircle2 } from "lucide-react";

export function AdminSettingsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Platform Settings</h1>
        <p className="text-xs text-neutral-400">
          Core identity endpoints, object storage backends, and security governance rules.
        </p>
      </div>

      <div className="space-y-4">
        {/* IAM Config */}
        <div className="p-6 rounded-2xl bg-[#14141a] border border-[#22222c]">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={16} className="text-[#ff7a00]" />
            <h2 className="text-sm font-semibold text-white">Logto IAM Dedicated Cluster</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-[10px] text-neutral-500 font-mono uppercase">OIDC Discovery Endpoint</label>
              <div className="p-2.5 rounded-xl bg-[#181822] border border-[#262634] text-white font-mono mt-1">
                https://auth-skyer.hmz.one/oidc
              </div>
            </div>
            <div>
              <label className="text-[10px] text-neutral-500 font-mono uppercase">Admin Console</label>
              <div className="p-2.5 rounded-xl bg-[#181822] border border-[#262634] text-white font-mono mt-1">
                https://admin-auth-skyer.hmz.one
              </div>
            </div>
          </div>
        </div>

        {/* MinIO Config */}
        <div className="p-6 rounded-2xl bg-[#14141a] border border-[#22222c]">
          <div className="flex items-center gap-2 mb-4">
            <Database size={16} className="text-emerald-400" />
            <h2 className="text-sm font-semibold text-white">MinIO Dedicated S3 Storage</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-[10px] text-neutral-500 font-mono uppercase">S3 API Endpoint</label>
              <div className="p-2.5 rounded-xl bg-[#181822] border border-[#262634] text-white font-mono mt-1">
                https://s3-skyer.hmz.one
              </div>
            </div>
            <div>
              <label className="text-[10px] text-neutral-500 font-mono uppercase">Default Bucket</label>
              <div className="p-2.5 rounded-xl bg-[#181822] border border-[#262634] text-white font-mono mt-1">
                agent360-production
              </div>
            </div>
          </div>
        </div>

        {/* Infisical Config */}
        <div className="p-6 rounded-2xl bg-[#14141a] border border-[#22222c]">
          <div className="flex items-center gap-2 mb-4">
            <Key size={16} className="text-blue-400" />
            <h2 className="text-sm font-semibold text-white">Central Secrets Vault (Infisical)</h2>
          </div>
          <div className="p-3.5 rounded-xl bg-[#181822] border border-[#262634] flex items-center justify-between text-xs">
            <div>
              <div className="font-semibold text-white">keys.hmz.one / agent360</div>
              <div className="text-[11px] text-neutral-400 font-mono">18 environment variables synchronized</div>
            </div>
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <CheckCircle2 size={14} />
              <span>Synced</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
