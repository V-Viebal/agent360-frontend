import { useTranslation } from "../i18n/LanguageContext";
import React, { useState, useEffect } from "react";
import { Mic,
  Wifi, X, Volume2, Globe, Sliders, CheckCircle2, ShieldCheck, Keyboard, Activity } from "lucide-react";
import {
  AudioInputDeviceOption,
  getAvailableAudioInputDevices,
  getSelectedAudioDeviceId,
  setSelectedAudioDeviceId,
  getVoiceAudioProfile,
  setVoiceAudioProfile,
  VoiceAudioProfile,
  broadcastAudioSettingChange,
} from "../services/permissionService";

interface VoiceRecordSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sttLang: "vi-VN" | "en-US";
  onSttLangChange: (lang: "vi-VN" | "en-US") => void;
  onOpenShortcuts?: () => void;
  onOpenPermissions?: () => void;
  agentId?: string;
  agentName?: string;
}

export function VoiceRecordSettingsModal({
  isOpen,
  onClose,
  sttLang,
  onSttLangChange,
  onOpenShortcuts,
  onOpenPermissions,
  agentId,
  agentName,
}: VoiceRecordSettingsModalProps) {
  const { t } = useTranslation();
  const [audioDevices, setAudioDevices] = useState<AudioInputDeviceOption[]>([]);
  const [selectedMicId, setSelectedMicId] = useState<string>(() => getSelectedAudioDeviceId(agentId));
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

  // Frequency bands (Bass / Mid / Treble) for live Equalizer Monitor
    const [voiceProfile, setVoiceProfileState] = useState<VoiceAudioProfile>(() => getVoiceAudioProfile());

  const handleProfileChange = (patch: Partial<VoiceAudioProfile>) => {
    setVoiceProfileState((prev) => {
      const next = { ...prev, ...patch };
      setVoiceAudioProfile(next);
      return next;
    });
  };

  const [isLiveTesting, setIsLiveTesting] = useState(false);
  const [freqBands, setFreqBands] = useState<{ bass: number; mid: number; treble: number }>({
    bass: 0,
    mid: 0,
    treble: 0,
  });
  const audioContextRef = React.useRef<AudioContext | null>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const animFrameRef = React.useRef<number | null>(null);

  const stopLiveTest = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setIsLiveTesting(false);
    setFreqBands({ bass: 0, mid: 0, treble: 0 });
  };

  const startLiveTest = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
      const constraints: MediaStreamConstraints = {
        audio: selectedMicId ? { deviceId: { exact: selectedMicId } } : true,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      setIsLiveTesting(true);

      const updateBands = () => {
        animFrameRef.current = requestAnimationFrame(updateBands);
        analyser.getByteFrequencyData(dataArray);

        // Bass: ~0-250Hz (indices 0..4)
        let bassSum = 0;
        for (let i = 0; i < 4; i++) bassSum += dataArray[i] || 0;
        const bass = Math.min(100, Math.round((bassSum / (4 * 255)) * 100));

        // Mid: ~250-2000Hz (indices 4..20)
        let midSum = 0;
        for (let i = 4; i < 20; i++) midSum += dataArray[i] || 0;
        const mid = Math.min(100, Math.round((midSum / (16 * 255)) * 100));

        // Treble: ~2000-8000Hz (indices 20..48)
        let trebleSum = 0;
        for (let i = 20; i < 48; i++) trebleSum += dataArray[i] || 0;
        const treble = Math.min(100, Math.round((trebleSum / (28 * 255)) * 100));

        setFreqBands({ bass, mid, treble });
      };

      updateBands();
    } catch (err) {
      console.warn("Failed to start live equalizer test:", err);
      stopLiveTest();
    }
  };

  useEffect(() => {
    return () => {
      stopLiveTest();
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      stopLiveTest();
    }
  }, [isOpen]);

  useEffect(() => {
    async function loadDevices() {
      const devs = await getAvailableAudioInputDevices();
      setAudioDevices(devs);
      setSelectedMicId(getSelectedAudioDeviceId(agentId));
    }
    if (isOpen) {
      loadDevices();
    }
  }, [isOpen, agentId]);

  const handleDeviceChange = (devId: string) => {
    setSelectedMicId(devId);
    setSelectedAudioDeviceId(devId, agentId);
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/80 backdrop-blur-sm backdrop-blur-md animate-in fade-in duration-150 select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white dark:bg-[#121218] border border-slate-200 dark:border-[#262634] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-800 dark:text-neutral-200 font-sans animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-[#22222e] flex items-center justify-between bg-slate-50 dark:bg-[#161620]">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-[#ff7a00]/10 border border-[#ff7a00]/20 flex items-center justify-center text-[#ff7a00]">
              <Mic size={18} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Voice Input & Recording Settings</h3>
              <p className="text-[11px] text-slate-500 dark:text-neutral-400">
                Configure input language accent, microphone device, and silence pause
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-[#1c1c28] hover:bg-[#252536] text-slate-500 dark:text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-4 max-h-[65vh] overflow-y-auto">
          {/* 1. Speech Recognition Input Language Accent (VI / EN) */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#161620] border border-slate-200 dark:border-[#22222e] space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe size={15} className="text-[#ff7a00]" />
                <span className="text-xs font-semibold text-white">Input Language Accent (STT)</span>
              </div>
              <span className="text-[10px] font-mono text-[#ff7a00] font-bold">
                {sttLang === "vi-VN" ? "Tiếng Việt" : "English"}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-neutral-400 leading-relaxed">
              Select the primary speech-to-text recognition model for best transcription accuracy:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <button
                type="button"
                onClick={() => onSttLangChange("vi-VN")}
                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-all cursor-pointer ${
                  sttLang === "vi-VN"
                    ? "bg-[#ff7a00]/20 border-[#ff7a00] text-white font-bold shadow-xs"
                    : "bg-slate-100 dark:bg-[#1c1c28] border-[#28283a] text-slate-500 dark:text-neutral-400 hover:text-white"
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
                    : "bg-slate-100 dark:bg-[#1c1c28] border-[#28283a] text-slate-500 dark:text-neutral-400 hover:text-white"
                }`}
              >
                <span>English (en-US)</span>
                {sttLang === "en-US" && <CheckCircle2 size={13} className="text-[#ff7a00]" />}
              </button>
            </div>
          </div>

          {/* 2. Microphone Hardware Device */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#161620] border border-slate-200 dark:border-[#22222e] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-700 dark:text-neutral-300">
              <span className="font-semibold text-white">Target Microphone:</span>
              <span className="text-[10px] text-neutral-500 font-sans">
                {audioDevices.length > 0 ? `${audioDevices.length} connected` : "Default"}
              </span>
            </div>
            <select
              value={selectedMicId}
              onChange={(e) => handleDeviceChange(e.target.value)}
              className="w-full bg-slate-100 dark:bg-[#1c1c28] border border-[#28283a] focus:border-[#ff7a00] rounded-lg px-2.5 py-1.5 text-xs text-white font-sans focus:outline-none cursor-pointer"
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
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#161620] border border-slate-200 dark:border-[#22222e] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white">Interaction Mode</span>
              <span className="text-[10px] font-mono text-slate-500 dark:text-neutral-400">
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
                    : "bg-slate-100 dark:bg-[#1c1c28] border-[#28283a] text-slate-500 dark:text-neutral-400 hover:text-white"
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
                    : "bg-slate-100 dark:bg-[#1c1c28] border-[#28283a] text-slate-500 dark:text-neutral-400 hover:text-white"
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
                    : "bg-slate-100 dark:bg-[#1c1c28] border-[#28283a] text-slate-500 dark:text-neutral-400 hover:text-white"
                }`}
              >
                Push-to-Talk
              </button>
            </div>

            {vadMode === "continuous" && (
              <div className="pt-1 flex items-center justify-between text-xs font-mono text-slate-500 dark:text-neutral-400">
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
                          : "bg-slate-100 dark:bg-[#1c1c28] hover:bg-[#252538] text-slate-700 dark:text-neutral-300"
                      }`}
                    >
                      {(ms / 1000).toFixed(1)}s
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

                    {/* 3.1 Network Bandwidth & Low Latency Profile */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#161620] border border-slate-200 dark:border-[#22222e] space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wifi size={14} className="text-cyan-400" />
                <span className="text-xs font-semibold text-white">Network & Low-Latency Profile</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                WebRTC Optimized
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-neutral-400">
              Tune audio bitrate and acoustic filters for optimal voice responsiveness under low bandwidth:
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
              {/* Bitrate selection */}
              <div className="bg-[#12121a] border border-[#222230] rounded-lg p-2.5 space-y-1.5">
                <span className="text-[10px] text-neutral-400 block">Opus Bitrate:</span>
                <div className="flex items-center gap-1">
                  {[32, 64, 128].map((kbps) => (
                    <button
                      key={kbps}
                      type="button"
                      onClick={() => handleProfileChange({ bitrateKbps: kbps })}
                      className={`flex-1 py-1 rounded text-[11px] font-bold cursor-pointer transition-colors border ${
                        voiceProfile.bitrateKbps === kbps
                          ? "bg-cyan-500/20 border-cyan-500 text-cyan-300"
                          : "bg-[#181824] border-[#262638] text-neutral-400 hover:text-white"
                      }`}
                    >
                      {kbps}k
                    </button>
                  ))}
                </div>
              </div>

              {/* Ultra Low Latency Mode */}
              <div className="bg-[#12121a] border border-[#222230] rounded-lg p-2.5 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-neutral-400">Ultra-Low Latency:</span>
                  <input
                    type="checkbox"
                    checked={voiceProfile.lowLatencyMode}
                    onChange={(e) => handleProfileChange({ lowLatencyMode: e.target.checked })}
                    className="accent-cyan-400 h-3.5 w-3.5 cursor-pointer"
                  />
                </div>
                <span className="text-[9px] text-neutral-500">
                  {voiceProfile.lowLatencyMode ? "Zero buffer delay (<80ms)" : "Standard buffer smoothing"}
                </span>
              </div>
            </div>

            {/* Acoustic Filters Toggles */}
            <div className="grid grid-cols-3 gap-2 pt-1 text-[10px] font-mono">
              <button
                type="button"
                onClick={() => handleProfileChange({ noiseSuppression: !voiceProfile.noiseSuppression })}
                className={`py-1 px-1.5 rounded border text-center transition-colors cursor-pointer ${
                  voiceProfile.noiseSuppression
                    ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                    : "bg-[#12121a] border-[#222230] text-neutral-500"
                }`}
              >
                Noise Suppress {voiceProfile.noiseSuppression ? "✓" : "✗"}
              </button>
              <button
                type="button"
                onClick={() => handleProfileChange({ echoCancellation: !voiceProfile.echoCancellation })}
                className={`py-1 px-1.5 rounded border text-center transition-colors cursor-pointer ${
                  voiceProfile.echoCancellation
                    ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                    : "bg-[#12121a] border-[#222230] text-neutral-500"
                }`}
              >
                Echo Cancel {voiceProfile.echoCancellation ? "✓" : "✗"}
              </button>
              <button
                type="button"
                onClick={() => handleProfileChange({ autoGainControl: !voiceProfile.autoGainControl })}
                className={`py-1 px-1.5 rounded border text-center transition-colors cursor-pointer ${
                  voiceProfile.autoGainControl
                    ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                    : "bg-[#12121a] border-[#222230] text-neutral-500"
                }`}
              >
                Auto Gain {voiceProfile.autoGainControl ? "✓" : "✗"}
              </button>
            </div>
          </div>

          {/* 4. Acoustic Spectrum Equalizer (Bass / Mid / Treble) */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#161620] border border-slate-200 dark:border-[#22222e] space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity size={14} className="text-[#ff7a00]" />
                <span className="text-xs font-semibold text-white">Frequency Bands Equalizer</span>
              </div>
              <button
                type="button"
                onClick={() => (isLiveTesting ? stopLiveTest() : startLiveTest())}
                className={`px-2.5 py-1 rounded-md text-[10px] font-mono transition-all cursor-pointer border ${
                  isLiveTesting
                    ? "bg-red-500/20 border-red-500/50 text-red-300 font-semibold"
                    : "bg-[#1c1c28] border-[#2c2c3e] text-neutral-300 hover:text-white"
                }`}
              >
                {isLiveTesting ? "Stop Live Test" : "Live Test Mic"}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-neutral-400">
              Live acoustic frequency breakdown for current microphone input:
            </p>

            <div className="grid grid-cols-3 gap-2 text-xs font-mono pt-1">
              {/* Bass Band */}
              <div className="bg-[#12121a] border border-[#222230] rounded-lg p-2 flex flex-col items-center gap-1.5">
                <div className="flex items-center justify-between w-full text-[10px] text-neutral-400">
                  <span>{t("voiceSettings.bass")}</span>
                  <span className="text-[#ff7a00] font-bold">{freqBands.bass}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#20202e] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-[#ff7a00] transition-all duration-75 rounded-full"
                    style={{ width: `${Math.max(4, freqBands.bass)}%` }}
                  />
                </div>
                <span className="text-[9px] text-neutral-500">60-250 Hz</span>
              </div>

              {/* Mid Band */}
              <div className="bg-[#12121a] border border-[#222230] rounded-lg p-2 flex flex-col items-center gap-1.5">
                <div className="flex items-center justify-between w-full text-[10px] text-neutral-400">
                  <span>{t("voiceSettings.mid")}</span>
                  <span className="text-cyan-400 font-bold">{freqBands.mid}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#20202e] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-400 to-cyan-500 transition-all duration-75 rounded-full"
                    style={{ width: `${Math.max(4, freqBands.mid)}%` }}
                  />
                </div>
                <span className="text-[9px] text-neutral-500">250-2k Hz</span>
              </div>

              {/* Treble Band */}
              <div className="bg-[#12121a] border border-[#222230] rounded-lg p-2 flex flex-col items-center gap-1.5">
                <div className="flex items-center justify-between w-full text-[10px] text-neutral-400">
                  <span>{t("voiceSettings.treble")}</span>
                  <span className="text-purple-400 font-bold">{freqBands.treble}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#20202e] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-400 to-purple-500 transition-all duration-75 rounded-full"
                    style={{ width: `${Math.max(4, freqBands.treble)}%` }}
                  />
                </div>
                <span className="text-[9px] text-neutral-500">2k-8k Hz</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-5 py-3 bg-[#0f0f15] border-t border-slate-200 dark:border-[#1e1e28] flex items-center justify-between text-[11px] font-mono text-neutral-500">
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
                <span>{t("voiceSettings.permissionsBtn")}</span>
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
                  <span>{t("voiceSettings.shortcutsBtn")}</span>
                </button>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-700 dark:text-neutral-300 hover:text-white transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
