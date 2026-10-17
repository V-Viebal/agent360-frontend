import React from "react";
import { Zap, Activity, Clock, Cpu } from "lucide-react";

export interface TurnTelemetry {
  ttftMs?: number;
  totalDurationMs?: number;
  tokenCount?: number;
  tokensPerSec?: number;
  model?: string;
  provider?: string;
  contextUsagePercent?: number;
  estimatedCostUsd?: number;
}

interface TelemetryHudProps {
  telemetry: TurnTelemetry | null;
  isStreaming?: boolean;
}

export function TelemetryHud({ telemetry, isStreaming }: TelemetryHudProps) {
  if (!telemetry && !isStreaming) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#14141c]/90 border border-[#22222e] text-[10px] font-mono text-neutral-400 select-none shadow-xs animate-in fade-in">
      {isStreaming ? (
        <div className="flex items-center gap-1.5 text-[#ff7a00]">
          <Activity size={11} className="animate-spin text-[#ff7a00]" />
          <span>Generating turn...</span>
        </div>
      ) : (
        <>
          {telemetry?.ttftMs !== undefined && (
            <div className="flex items-center gap-1" title="Time to first token (latency)">
              <Clock size={10} className="text-amber-400" />
              <span>TTFT: {telemetry.ttftMs}ms</span>
            </div>
          )}

          {telemetry?.tokensPerSec !== undefined && telemetry.tokensPerSec > 0 && (
            <>
              <span className="text-neutral-600">•</span>
              <div className="flex items-center gap-1" title="Inference generation speed">
                <Zap size={10} className="text-emerald-400" />
                <span>{telemetry.tokensPerSec.toFixed(1)} t/s</span>
              </div>
            </>
          )}

          {telemetry?.totalDurationMs !== undefined && (
            <>
              <span className="text-neutral-600">•</span>
              <div className="flex items-center gap-1" title="Total turn duration">
                <span>{(telemetry.totalDurationMs / 1000).toFixed(1)}s</span>
              </div>
            </>
          )}

          {telemetry?.model && (
            <>
              <span className="text-neutral-600">•</span>
              <div className="flex items-center gap-1 text-neutral-300" title="Active Model">
                <Cpu size={10} className="text-[#ff7a00]" />
                <span className="truncate max-w-[120px]">{telemetry.model.split("/").pop()}</span>
              </div>
            </>
          )}

          {telemetry?.estimatedCostUsd !== undefined && (
            <>
              <span className="text-neutral-600">•</span>
              <span className="text-neutral-500" title="Estimated cost based on token footprint">
                ${telemetry.estimatedCostUsd.toFixed(4)}
              </span>
            </>
          )}
        </>
      )}
    </div>
  );
}
