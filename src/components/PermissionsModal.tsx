import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Mic,
  Bell,
  Copy,
  Volume2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  X,
  ExternalLink,
} from "lucide-react";
import {
  queryAllPermissions,
  requestPermission,
  PermissionStatusDetail,
  PermissionType,
  getAvailableAudioInputDevices,
  getSelectedAudioDeviceId,
  setSelectedAudioDeviceId,
  AudioInputDeviceOption,
  getAvailableAudioOutputDevices,
  getSelectedAudioOutputDeviceId,
  setSelectedAudioOutputDeviceId,
  broadcastAudioSettingChange,
} from "../services/permissionService";
import { playNotificationChime, SOUND_PRESETS, SoundPreset, getNotificationVolume, setNotificationVolume } from "../services/notificationService";
import { Volume1, VolumeX } from "lucide-react";

interface PermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestDone?: () => void;
}

export function PermissionsModal({ isOpen, onClose, onRequestDone }: PermissionsModalProps) {
  const [permissions, setPermissions] = useState<PermissionStatusDetail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [requestingType, setRequestingType] = useState<PermissionType | null>(null);
  const [audioDevices, setAudioDevices] = useState<AudioInputDeviceOption[]>([]);
  const [selectedMicId, setSelectedMicId] = useState<string>(() => getSelectedAudioDeviceId());
  const [outputDevices, setOutputDevices] = useState<AudioInputDeviceOption[]>([]);
  const [selectedSpeakerId, setSelectedSpeakerId] = useState<string>(() => getSelectedAudioOutputDeviceId());
  const [testSoundPreset, setTestSoundPreset] = useState<SoundPreset>("modern");
  const [isPlayingTestSound, setIsPlayingTestSound] = useState(false);
  const [chimeVolume, setChimeVolume] = useState<number>(() => getNotificationVolume());

  const handleVolumeChange = (newVol: number) => {
    setChimeVolume(newVol);
    setNotificationVolume(newVol);
  };
  const [isTestingMic, setIsTestingMic] = useState(false);
  const [micAudioLevel, setMicAudioLevel] = useState(0);
  const testStreamRef = React.useRef<MediaStream | null>(null);
  const testAudioCtxRef = React.useRef<AudioContext | null>(null);
  const testAnimRef = React.useRef<number | null>(null);

  const stopMicTest = () => {
    if (testAnimRef.current) {
      cancelAnimationFrame(testAnimRef.current);
      testAnimRef.current = null;
    }
    if (testStreamRef.current) {
      testStreamRef.current.getTracks().forEach((t) => t.stop());
      testStreamRef.current = null;
    }
    if (testAudioCtxRef.current && testAudioCtxRef.current.state !== "closed") {
      testAudioCtxRef.current.close().catch(() => {});
      testAudioCtxRef.current = null;
    }
    setIsTestingMic(false);
    setMicAudioLevel(0);
  };

  const startMicTest = async () => {
    stopMicTest();
    try {
      const constraints: MediaTrackConstraints = {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      };
      if (selectedMicId) {
        constraints.deviceId = { exact: selectedMicId };
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: constraints });
      testStreamRef.current = stream;

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      testAudioCtxRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      const buffer = new Uint8Array(analyser.frequencyBinCount);
      setIsTestingMic(true);

      const updateLevel = () => {
        analyser.getByteFrequencyData(buffer);
        let sum = 0;
        for (let i = 0; i < buffer.length; i++) {
          sum += buffer[i];
        }
        const avg = sum / buffer.length;
        setMicAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
        testAnimRef.current = requestAnimationFrame(updateLevel);
      };
      updateLevel();
    } catch (e) {
      console.warn("Failed to test microphone stream:", e);
      setIsTestingMic(false);
    }
  };

  useEffect(() => {
    return () => {
      stopMicTest();
    };
  }, []);

  useEffect(() => {
    async function loadDevices() {
      const [inDevs, outDevs] = await Promise.all([
        getAvailableAudioInputDevices(),
        getAvailableAudioOutputDevices(),
      ]);
      setAudioDevices(inDevs);
      setOutputDevices(outDevs);
    }
    if (isOpen) {
      loadDevices();
    }
  }, [isOpen]);

  const handleDeviceChange = (devId: string) => {
    setSelectedMicId(devId);
    setSelectedAudioDeviceId(devId);
  };

  const handleSpeakerChange = (devId: string) => {
    setSelectedSpeakerId(devId);
    setSelectedAudioOutputDeviceId(devId);
  };

  const handleTestSpeakerChime = (overridePreset?: SoundPreset) => {
    const presetToPlay = overridePreset || testSoundPreset;
    setIsPlayingTestSound(true);
    try {
      playNotificationChime(presetToPlay);
    } catch (e) {
      console.warn("Chime playback error:", e);
    }
    setTimeout(() => setIsPlayingTestSound(false), 800);
  };

  // Keyboard Shortcuts inside PermissionsModal: 1, 2, 3, 4 for chime presets
  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input or select
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === "input" || tag === "select" || tag === "textarea") return;

      if (e.key === "1") {
        e.preventDefault();
        setTestSoundPreset("modern");
        handleTestSpeakerChime("modern");
      } else if (e.key === "2") {
        e.preventDefault();
        setTestSoundPreset("retro");
        handleTestSpeakerChime("retro");
      } else if (e.key === "3") {
        e.preventDefault();
        setTestSoundPreset("pop");
        handleTestSpeakerChime("pop");
      } else if (e.key === "4") {
        e.preventDefault();
        setTestSoundPreset("bell");
        handleTestSpeakerChime("bell");
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, testSoundPreset]);
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

  const loadPermissions = async () => {
    setIsLoading(true);
    try {
      const perms = await queryAllPermissions();
      setPermissions(perms);
    } catch (e) {
      console.warn("Failed to query permissions:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadPermissions();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRequest = async (type: PermissionType) => {
    setRequestingType(type);
    try {
      await requestPermission(type);
      await loadPermissions();
      if (onRequestDone) onRequestDone();
    } finally {
      setRequestingType(null);
    }
  };

  const getIcon = (type: PermissionType) => {
    switch (type) {
      case "microphone":
        return <Mic size={16} className="text-[#ff7a00]" />;
      case "notifications":
        return <Bell size={16} className="text-cyan-400" />;
      case "clipboard":
        return <Copy size={16} className="text-emerald-400" />;
      case "speaker":
        return <Volume2 size={16} className="text-purple-400" />;
      default:
        return <ShieldCheck size={16} className="text-neutral-400" />;
    }
  };

  const renderBadge = (state: PermissionStatusDetail["state"]) => {
    switch (state) {
      case "granted":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 size={11} />
            <span>Granted</span>
          </span>
        );
      case "prompt":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <HelpCircle size={11} />
            <span>Not Requested</span>
          </span>
        );
      case "denied":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-red-500/10 text-red-400 border border-red-500/20">
            <AlertCircle size={11} />
            <span>Blocked / Denied</span>
          </span>
        );
      case "unsupported":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-neutral-500/10 text-neutral-400 border border-neutral-500/20">
            <span>Unavailable</span>
          </span>
        );
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-[#121218] border border-[#262634] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-neutral-200 font-sans animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#22222e] flex items-center justify-between bg-[#161620]">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-[#ff7a00]/10 border border-[#ff7a00]/20 flex items-center justify-center text-[#ff7a00]">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Browser Permissions & Hardware</h3>
              <p className="text-[11px] text-neutral-400">
                Manage hardware permissions for voice input, audio playback, and alerts
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadPermissions}
              disabled={isLoading}
              title="Refresh status"
              className="p-1.5 rounded-lg bg-[#1c1c28] hover:bg-[#252536] text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <RefreshCw size={14} className={isLoading ? "animate-spin text-[#ff7a00]" : ""} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#1c1c28] hover:bg-[#252536] text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="p-4 space-y-2.5 max-h-[65vh] overflow-y-auto">
          {permissions.map((perm) => {
            const isRequesting = requestingType === perm.type;
            const canTrigger = perm.canRequest && perm.state !== "granted";

            return (
              <div
                key={perm.type}
                className="p-3.5 rounded-xl bg-[#161620] border border-[#22222e] flex items-start justify-between gap-3 transition-colors hover:border-[#2e2e3e]"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-[#1c1c28] border border-[#262638] shrink-0 mt-0.5">
                    {getIcon(perm.type)}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white">{perm.name}</span>
                      {renderBadge(perm.state)}
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
                      {perm.description}
                    </p>
                    {perm.state === "denied" && (
                      <p className="text-[10px] text-red-400 font-mono mt-1">
                        Permission is blocked in your browser address bar icon (🔒 / ⚙️). Click the padlock icon to allow access.
                      </p>
                    )}
                  </div>
                </div>

                <div className="shrink-0 pt-0.5">
                  {canTrigger && (
                    <button
                      type="button"
                      onClick={() => handleRequest(perm.type)}
                      disabled={isRequesting}
                      className="px-3 py-1 rounded-lg text-xs font-medium bg-[#ff7a00] hover:bg-[#ff8f26] text-black transition-all cursor-pointer shadow-sm disabled:opacity-50"
                    >
                      {isRequesting ? "Prompting..." : "Enable"}
                    </button>
                  )}
                  {perm.state === "granted" && (
                    <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 size={13} /> Active
                    </span>
                  )}
                </div>
              </div>
            );
          })}
          {/* VAD & Voice Input Preferences */}
          <div className="p-3.5 rounded-xl bg-[#161620] border border-[#22222e] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white">Voice Input & Silence Detection (VAD)</span>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Configure automatic silence timeout and speech submission mode
                </p>
              </div>
              <span className="text-[10px] font-mono bg-[#ff7a00]/10 text-[#ff7a00] border border-[#ff7a00]/20 px-2 py-0.5 rounded">
                VAD Config
              </span>
            </div>

            {/* Audio Input Device Selector */}
            {audioDevices.length > 0 && (
              <div className="pt-1 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                  <span>Input Microphone:</span>
                  <span className="text-[10px] text-neutral-500 font-sans">{audioDevices.length} available</span>
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

                {/* Audio Input Level Meter Visualizer */}
                <div className="pt-1.5 flex items-center justify-between gap-3 bg-[#121218] border border-[#22222e] rounded-lg p-2 font-mono text-xs">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="text-[11px] text-neutral-400 shrink-0">Level:</span>
                    <div className="flex-1 h-2 bg-[#1c1c26] rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-75 rounded-full ${
                          micAudioLevel > 70 ? "bg-red-500" : micAudioLevel > 35 ? "bg-[#ff7a00]" : "bg-emerald-400"
                        }`}
                        style={{ width: `${Math.max(micAudioLevel, isTestingMic ? 3 : 0)}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-neutral-400 shrink-0 w-8 text-right font-mono">
                      {isTestingMic ? `${micAudioLevel}%` : "Idle"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={isTestingMic ? stopMicTest : startMicTest}
                    className={`px-2.5 py-1 rounded text-[11px] font-sans font-medium transition-colors cursor-pointer shrink-0 ${
                      isTestingMic
                        ? "bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30"
                        : "bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10"
                    }`}
                  >
                    {isTestingMic ? "Stop Test" : "Test Mic"}
                  </button>
                </div>
              </div>
            )}

            {/* Audio Output Device & Speaker Chime Test */}
            <div className="pt-2 border-t border-[#22222e] space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                <span>Audio Playback & Alert Speaker (Keys 1-4 to test):</span>
                <span className="text-[10px] text-neutral-500 font-sans">
                  {outputDevices.length > 0 ? `${outputDevices.length} available` : "System Default"}
                </span>
              </div>
              {outputDevices.length > 0 && (
                <select
                  value={selectedSpeakerId}
                  onChange={(e) => handleSpeakerChange(e.target.value)}
                  className="w-full bg-[#1c1c28] border border-[#28283a] focus:border-[#ff7a00] rounded-lg px-2.5 py-1.5 text-xs text-white font-sans focus:outline-none cursor-pointer"
                >
                  <option value="">Default System Speaker</option>
                  {outputDevices.map((d) => (
                    <option key={d.deviceId} value={d.deviceId}>
                      {d.label || `Speaker (${d.deviceId.slice(0, 8)}...)`}
                    </option>
                  ))}
                </select>
              )}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-[#121218] border border-[#22222e] rounded-lg p-2.5 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-neutral-400 shrink-0">Chime:</span>
                  <select
                    value={testSoundPreset}
                    onChange={(e) => setTestSoundPreset(e.target.value as SoundPreset)}
                    className="bg-[#1c1c28] border border-[#28283a] rounded px-2 py-0.5 text-xs text-[#ff7a00] font-sans focus:outline-none"
                  >
                    {SOUND_PRESETS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2 flex-1 max-w-[200px] px-1">
                  {chimeVolume === 0 ? (
                    <VolumeX size={14} className="text-neutral-500 shrink-0" />
                  ) : chimeVolume < 0.5 ? (
                    <Volume1 size={14} className="text-[#ff7a00] shrink-0" />
                  ) : (
                    <Volume2 size={14} className="text-[#ff7a00] shrink-0" />
                  )}
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={chimeVolume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    className="w-full accent-[#ff7a00] h-1.5 bg-[#262638] rounded-lg cursor-pointer"
                  />
                  <span className="text-[10px] text-neutral-400 shrink-0 w-7 text-right">
                    {Math.round(chimeVolume * 100)}%
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isPlayingTestSound && (
                    <div className="flex items-center gap-1 h-4 px-1.5 py-0.5 rounded bg-[#ff7a00]/10 border border-[#ff7a00]/30 animate-in fade-in">
                      <span className="h-1.5 w-1 bg-[#ff7a00] rounded-full animate-bounce" style={{ animationDelay: "-0.3s" }} />
                      <span className="h-2.5 w-1 bg-[#ff7a00] rounded-full animate-bounce" style={{ animationDelay: "-0.15s" }} />
                      <span className="h-3 w-1 bg-[#ff7a00] rounded-full animate-bounce" />
                      <span className="h-2 w-1 bg-[#ff7a00] rounded-full animate-bounce" style={{ animationDelay: "-0.2s" }} />
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => handleTestSpeakerChime()}
                    disabled={isPlayingTestSound}
                    className={`px-3 py-1 rounded text-[11px] font-sans font-medium transition-all cursor-pointer ${
                      isPlayingTestSound
                        ? "bg-[#ff7a00] text-black font-semibold shadow-sm"
                        : "bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10"
                    }`}
                  >
                    {isPlayingTestSound ? "Playing..." : "Test Chime"}
                  </button>
                </div>
              </div>
            </div>

            {/* Mode selector */}

            <div className="grid grid-cols-3 gap-2 text-xs font-mono">
              <button
                type="button"
                onClick={() => handleVadModeChange("continuous")}
                className={`px-2.5 py-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                  vadMode === "continuous"
                    ? "bg-[#ff7a00]/20 border-[#ff7a00] text-white font-semibold"
                    : "bg-[#1c1c28] border-[#28283a] text-neutral-400 hover:text-white"
                }`}
              >
                Auto Silence
              </button>
              <button
                type="button"
                onClick={() => handleVadModeChange("manual")}
                className={`px-2.5 py-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                  vadMode === "manual"
                    ? "bg-[#ff7a00]/20 border-[#ff7a00] text-white font-semibold"
                    : "bg-[#1c1c28] border-[#28283a] text-neutral-400 hover:text-white"
                }`}
              >
                Manual Toggle
              </button>
              <button
                type="button"
                onClick={() => handleVadModeChange("push_to_talk")}
                className={`px-2.5 py-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                  vadMode === "push_to_talk"
                    ? "bg-[#ff7a00]/20 border-[#ff7a00] text-white font-semibold"
                    : "bg-[#1c1c28] border-[#28283a] text-neutral-400 hover:text-white"
                }`}
              >
                Push-to-Talk
              </button>
            </div>

            {/* Silence threshold slider if continuous */}
            {vadMode === "continuous" && (
              <div className="pt-1 flex items-center justify-between text-xs font-mono text-neutral-400">
                <span>Silence Threshold:</span>
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
          <span>Skyer Hardware Security Sandbox</span>
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
