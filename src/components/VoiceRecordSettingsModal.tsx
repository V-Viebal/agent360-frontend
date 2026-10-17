import React, { useState, useEffect } from "react";
import { Mic, X, Volume2, Globe, Sliders, CheckCircle2, ShieldCheck, Keyboard } from "lucide-react";
import {
  AudioInputDeviceOption,
  getAvailableAudioInputDevices,
  getSelectedAudioDeviceId,
  setSelectedAudioDeviceId,
  broadcastAudioSettingChange,
} from "../services/permissionService";

interface VoiceRecordSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sttLang: "vi-VN" | "en-US";
  onSttLangChange: (lang: "vi-VN" | "en-US") => void;
  onOpenShortcuts?: () => void;
  onOpenPermissions?: () => void;
}

export function VoiceRecordSettingsModal({
  isOpen,
  onClose,
  sttLang,
  onSttLangChange,
  onOpenShortcuts,
  onOpenPermissions,
}: VoiceRecordSettingsModalProps) {
  const [audioDevices, setAudioDevices] = useState<AudioInputDeviceOption[]>([]);
  const [selectedMicId, setSelectedMicId] = useState<string>(() => getSelectedAudioDeviceId());
  const [vadMode, setVadMode] = useState<"continuous" | "manual" | "push_to_talk">(() => {
    try {
      return (localStorage.getItem("agent360_vad_mode") as any) || "continuous";
    } catch {
      return "continuous";
    }
  });
  const [silenceDuration, setSilenceDuration] = useState<number>(() => {
    try {
      const v = localStorage.getItem("agent360_vad_silence_ms");
      return v ? parseInt(v, 10) : 2400;
    } catch {
      return 2400;
    }
  });

  useEffect(() => {
    async function loadDevices() {
      const devs = await getAvailableAudioInputDevices();
      setAudioDevices(devs);
    }
    if (isOpen) {
      loadDevices();
    }
  }, [isOpen]);

  const handleDeviceChange = (devId: string) => {
    setSelectedMicId(devId);
    setSelectedAudioDeviceId(devId);
  };

  const handleVadModeChange = (mode: "continuous" | "manual" | "push_to_talk") => {
    setVadMode(mode);
    try {
      localStorage.setItem("agent360_vad_mode", mode);
      window.dispatchEvent(new CustomEvent("agent360_vad_settings_changed", { detail: { mode, silenceDuration } }));
      broadcastAudioSettingChange("VAD_CHANGED", { detail: { mode, silenceDuration } });
    } catch {}
  };

  const handleSilenceChange = (ms: number) => {
    setSilenceDuration(ms);
    try {
      localStorage.setItem("agent360_vad_silence_ms", ms.toString());
      window.dispatchEvent(new CustomEvent("agent360_vad_settings_changed", { detail: { mode: vadMode, silenceDuration: ms } }));
      broadcastAudioSettingChange("VAD_CHANGED", { detail: { mode: vadMode, silenceDuration: ms } });
    } catch {}
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150 select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#121218] border border-[#262634] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-neutral-200 font-sans animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#22222e] flex items-center justify-between bg-[#161620]">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-[#ff7a00]/10 border border-[#ff7a00]/20 flex items-center justify-center text-[#ff7a00]">
              <Mic size={18} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Voice Input & Recording Settings</h3>
              <p className="text-[11px] text-neutral-400">
                Configure input language accent, microphone device, and silence pause
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#1c1c28] hover:bg-[#252536] text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-4 max-h-[65vh] overflow-y-auto">
          {/* 1. Speech Recognition Input Language Accent (VI / EN) */}
          <div className="p-3.5 rounded-xl bg-[#161620] border border-[#22222e] space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe size={15} className="text-[#ff7a00]" />
                <span className="text-xs font-semibold text-white">Input Language Accent (STT)</span>
              </div>
              <span className="text-[10px] font-mono text-[#ff7a00] font-bold">
                {sttLang === "vi-VN" ? "Tiếng Việt" : "English"}
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              Select the primary speech-to-text recognition model for best transcription accuracy:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <button
                type="button"
                onClick={() => onSttLangChange("vi-VN")}
                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-all cursor-pointer ${
                  sttLang === "vi-VN"
                    ? "bg-[#ff7a00]/20 border-[#ff7a00] text-white font-bold shadow-xs"
                    : "bg-[#1c1c28] border-[#28283a] text-neutral-400 hover:text-white"
                }`}
              >
                <span>Tiếng Việt (vi-VN)</span>
                {sttLang === "vi-VN" && <CheckCircle2 size={13} className="text-[#ff7a00]" />}
              </button>
              <button
                type="button"
                onClick={() => onSttLangChange("en-US")}
                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-all cursor-pointer ${
                  sttLang === "en-US"
                    ? "bg-[#ff7a00]/20 border-[#ff7a00] text-white font-bold shadow-xs"
                    : "bg-[#1c1c28] border-[#28283a] text-neutral-400 hover:text-white"
                }`}
              >
                <span>English (en-US)</span>
                {sttLang === "en-US" && <CheckCircle2 size={13} className="text-[#ff7a00]" />}
              </button>
            </div>
          </div>

          {/* 2. Microphone Hardware Device */}
          <div className="p-3.5 rounded-xl bg-[#161620] border border-[#22222e] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-neutral-300">
              <span className="font-semibold text-white">Target Microphone:</span>
              <span className="text-[10px] text-neutral-500 font-sans">
                {audioDevices.length > 0 ? `${audioDevices.length} connected` : "Default"}
              </span>
            </div>
            <select
              value={selectedMicId}
              onChange={(e) => handleDeviceChange(e.target.value)}
              className="w-full bg-[#1c1c28] border border-[#28283a] focus:border-[#ff7a00] rounded-lg px-2.5 py-1.5 text-xs text-white font-sans focus:outline-none cursor-pointer"
            >
              <option value="">Default System Microphone</option>
              {audioDevices.map((d) => (
                <option key={d.deviceId} value={d.deviceId}>
                  {d.label || `Microphone (${d.deviceId.slice(0, 8)}...)`}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Voice Activity Detection (VAD) Mode & Silence Threshold */}
          <div className="p-3.5 rounded-xl bg-[#161620] border border-[#22222e] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white">Interaction Mode</span>
              <span className="text-[10px] font-mono text-neutral-400">
                {vadMode === "continuous" ? "Hands-Free VAD" : vadMode === "push_to_talk" ? "Push-to-Talk" : "Manual"}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs font-mono">
              <button
                type="button"
                onClick={() => handleVadModeChange("continuous")}
                className={`px-2 py-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                  vadMode === "continuous"
                    ? "bg-[#ff7a00]/20 border-[#ff7a00] text-white font-bold"
                    : "bg-[#1c1c28] border-[#28283a] text-neutral-400 hover:text-white"
                }`}
              >
                Auto Silence
              </button>
              <button
                type="button"
                onClick={() => handleVadModeChange("manual")}
                className={`px-2 py-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                  vadMode === "manual"
                    ? "bg-[#ff7a00]/20 border-[#ff7a00] text-white font-bold"
                    : "bg-[#1c1c28] border-[#28283a] text-neutral-400 hover:text-white"
                }`}
              >
                Manual Toggle
              </button>
              <button
                type="button"
                onClick={() => handleVadModeChange("push_to_talk")}
                className={`px-2 py-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                  vadMode === "push_to_talk"
                    ? "bg-[#ff7a00]/20 border-[#ff7a00] text-white font-bold"
                    : "bg-[#1c1c28] border-[#28283a] text-neutral-400 hover:text-white"
                }`}
              >
                Push-to-Talk
              </button>
            </div>

            {vadMode === "continuous" && (
              <div className="pt-1 flex items-center justify-between text-xs font-mono text-neutral-400">
                <span>Silence Pause Window:</span>
                <div className="flex items-center gap-1.5">
                  {[1500, 2400, 3500].map((ms) => (
                    <button
                      key={ms}
                      type="button"
                      onClick={() => handleSilenceChange(ms)}
                      className={`px-2 py-0.5 rounded text-[11px] cursor-pointer transition-colors ${
                        silenceDuration === ms
                          ? "bg-[#ff7a00] text-black font-bold"
                          : "bg-[#1c1c28] hover:bg-[#252538] text-neutral-300"
                      }`}
                    >
                      {(ms / 1000).toFixed(1)}s
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="px-5 py-3 bg-[#0f0f15] border-t border-[#1e1e28] flex items-center justify-between text-[11px] font-mono text-neutral-500">
          <div className="flex items-center gap-2">
            {onOpenPermissions && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPermissions();
                }}
                className="hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
              >
                <ShieldCheck size={13} className="text-[#ff7a00]" />
                <span>Permissions</span>
              </button>
            )}
            {onOpenShortcuts && (
              <>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenShortcuts();
                  }}
                  className="hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Keyboard size={13} className="text-cyan-400" />
                  <span>Shortcuts</span>
                </button>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
