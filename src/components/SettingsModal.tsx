import { useEffect } from "react";
import { User, Mail, Key, LogOut, ChevronDown, ChevronRight, Loader2, Lock, ArrowRight, AlertCircle } from "lucide-react";
import { initiateSkyerSignOut, initiatePasswordReset } from "../services/pkceAuth";
import { getCurrentUserProfile, UserProfile, updateUserProfile, changeCurrentUserPassword, getCurrentUserPasswordStatus } from "../services/userService";
import { Edit3, Save } from "lucide-react";
import { authConfig } from "../config/authConfig";
import React, { useState } from "react";
import { CustomSelect } from "./ui/CustomSelect";
import { ToggleSwitch } from "./ui/ToggleSwitch";
import {
  X,
  Search,
  Settings,
  Palette,
  Globe,
  Volume2,
  ShieldCheck,
  Download,
  FileText,
  Shield,
  Smartphone,
  Check,
  Sun,
  Moon,
  Monitor,
  Sparkles,
  ExternalLink,
  Laptop,
  Star,
  Command,
} from "lucide-react";
import { useTheme, ThemeMode } from "../context/ThemeContext";
import { useTranslation, LanguageSelection } from "../i18n/LanguageContext";
import { SOUND_PRESETS, SoundPreset, playNotificationChime } from "../services/notificationService";
import {
  getStoredSpeechSettings,
  saveStoredSpeechSettings,
  getAvailableVoices,
  speakText,
  stopSpeaking,
} from "../services/speechService";
import { Sliders, RefreshCw, Play, Square, Bell, Mic, Wifi, Activity, CheckCircle2 } from "lucide-react";
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

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: SettingsTab;
  // External action handlers passed from workspace
  onOpenPermissions?: () => void;
  onStartTour?: () => void;
  onResetChecklist?: () => void;
  onExportMarkdown?: () => void;
  onExportJson?: () => void;
  onExportCertificate?: () => void;
  onInstallPwa?: () => void;
  isPwaInstallable?: boolean;
  onOpenStarredAndShortcuts?: () => void;
  starredCount?: number;
  // Voice Recording props
  sttLang?: "vi-VN" | "en-US";
  onSttLangChange?: (lang: "vi-VN" | "en-US") => void;
  agentId?: string;
  agentName?: string;
}

export type SettingsTab = "profile" | "appearance" | "language" | "audio" | "privacy_export" | "voice_record";

export function SettingsModal({
  isOpen,
  onClose,
  initialTab = "profile",
  onOpenPermissions,
  onStartTour,
  onResetChecklist,
  onExportMarkdown,
  onExportJson,
  onExportCertificate,
  onInstallPwa,
  isPwaInstallable,
  onOpenStarredAndShortcuts,
  starredCount = 0,
  sttLang = "vi-VN",
  onSttLangChange,
  agentId,
  agentName,
}: SettingsModalProps) {
    const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>("");
  const [editAvatar, setEditAvatar] = useState<string>("");
  const [profileSaveSuccess, setProfileSaveSuccess] = useState<boolean>(false);
  const [showPasswordForm, setShowPasswordForm] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [savingPassword, setSavingPassword] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [hasPasswordSet, setHasPasswordSet] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    getCurrentUserProfile().then((u) => {
      if (u) {
        setCurrentUser(u);
        setEditName(u.name || "");
        setEditAvatar(u.picture || "");
      }
    });
    getCurrentUserPasswordStatus().then((has) => {
      setHasPasswordSet(has);
    });
  }, [isOpen]);


  // Clean user display info without exposing internal subject IDs or dummy sub emails
  const cleanDisplayName = (() => {
    if (currentUser?.name && currentUser.name !== "User Skyer" && currentUser.name !== "User") {
      return currentUser.name;
    }
    if (currentUser?.email === "hmzonehub@gmail.com" || currentUser?.sub === "1my9xeouvb48") {
      return "Tech Zone";
    }
    return currentUser?.name || "Skyer User";
  })();

  const cleanDisplayEmail = (() => {
    const email = currentUser?.email || "";
    const isInternalSubEmail = email.includes("@skyer.hmz.one") && (email.startsWith(currentUser?.sub || "###") || /^[a-z0-9]{10,}@/i.test(email));
    if (email && !isInternalSubEmail) {
      return email;
    }
    if (currentUser?.sub === "1my9xeouvb48") {
      return "hmzonehub@gmail.com";
    }
    return email && !isInternalSubEmail ? email : "hmzonehub@gmail.com";
  })();

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = await updateUserProfile({
      name: editName.trim(),
      picture: editAvatar.trim(),
    });
    if (updated) {
      setCurrentUser(updated);
      setIsEditingProfile(false);
      setProfileSaveSuccess(true);
      setTimeout(() => setProfileSaveSuccess(false), 3000);
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab || "profile");
    }
  }, [isOpen, initialTab]);

  // Voice Recording state
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
  const [voiceProfile, setVoiceProfileState] = useState<VoiceAudioProfile>(() => getVoiceAudioProfile());

  // Layout Density State
    const [isTestRecording, setIsTestRecording] = useState(false);
  const [testAudioUrl, setTestAudioUrl] = useState<string | null>(null);
  const [testSecondsLeft, setTestSecondsLeft] = useState(0);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const testChunksRef = React.useRef<Blob[]>([]);

  const [layoutDensity, setLayoutDensity] = useState<"compact" | "normal" | "comfortable">(() => {
    try {
      return (localStorage.getItem("skyer_layout_density") as any) || "normal";
    } catch {
      return "normal";
    }
  });

  const handleDensityChange = (density: "compact" | "normal" | "comfortable") => {
    setLayoutDensity(density);
    try {
      localStorage.setItem("skyer_layout_density", density);
      window.dispatchEvent(new CustomEvent("skyer_density_changed", { detail: { density } }));
    } catch {}
  };


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

    const start3SecondTest = async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) return;
      setTestAudioUrl(null);
      testChunksRef.current = [];
      const constraints: MediaStreamConstraints = {
        audio: selectedMicId ? { deviceId: { exact: selectedMicId } } : true,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) testChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(testChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setTestAudioUrl(url);
        setIsTestRecording(false);
        setTestSecondsLeft(0);
      };

      recorder.start();
      setIsTestRecording(true);
      setTestSecondsLeft(3);

      let countdown = 3;
      const interval = setInterval(() => {
        countdown -= 1;
        setTestSecondsLeft(countdown);
        if (countdown <= 0) {
          clearInterval(interval);
          if (recorder.state === 'recording') recorder.stop();
        }
      }, 1000);
    } catch (err) {
      console.warn('3s test error:', err);
      setIsTestRecording(false);
    }
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

        let bassSum = 0;
        for (let i = 0; i < 4; i++) bassSum += dataArray[i] || 0;
        const bass = Math.min(100, Math.round((bassSum / (4 * 255)) * 100));

        let midSum = 0;
        for (let i = 4; i < 20; i++) midSum += dataArray[i] || 0;
        const mid = Math.min(100, Math.round((midSum / (16 * 255)) * 100));

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

  React.useEffect(() => {
    return () => {
      stopLiveTest();
    };
  }, []);

  React.useEffect(() => {
    if (!isOpen) {
      stopLiveTest();
    }
  }, [isOpen]);

  React.useEffect(() => {
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

  // Theme state
  const { themeMode, resolvedTheme, setThemeMode } = useTheme();

  // Language state
  const { language, selection, setLanguageSelection, detectedTimezone, t } = useTranslation();

  // Sound preset state
  // Notification Sound & Speech Synthesis state
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem("agent360_sound_enabled") !== "false";
    } catch {
      return true;
    }
  });

  const [speechRate, setSpeechRate] = useState<number>(() => getStoredSpeechSettings().rate);
  const [speechPitch, setSpeechPitch] = useState<number>(() => getStoredSpeechSettings().pitch);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>(() => getStoredSpeechSettings().voiceURI || "");
  const [systemVoices, setSystemVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isTestingSpeech, setIsTestingSpeech] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      const voices = getAvailableVoices();
      setSystemVoices(voices);
      const handleVoices = () => setSystemVoices(getAvailableVoices());
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.addEventListener("voiceschanged", handleVoices);
        return () => window.speechSynthesis.removeEventListener("voiceschanged", handleVoices);
      }
    }
  }, [isOpen]);

  const [selectedPreset, setSelectedPreset] = useState<SoundPreset>(() => {
    try {
      return (localStorage.getItem("agent360_sound_preset") as SoundPreset) || "modern";
    } catch {
      return "modern";
    }
  });

  if (!isOpen) return null;

  const handleSelectPreset = (presetId: SoundPreset) => {
    setSelectedPreset(presetId);
    try {
      localStorage.setItem("agent360_sound_preset", presetId);
      playNotificationChime(presetId);
    } catch {}
  };

  const themeOptions: { id: ThemeMode; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      id: "system",
      label: t("settings.themeSystemLabel"),
      desc: t("settings.themeSystemDesc"),
      icon: <Monitor size={16} />,
    },
    {
      id: "dark",
      label: t("settings.themeDarkLabel"),
      desc: t("settings.themeDarkDesc"),
      icon: <Moon size={16} className="text-blue-400" />,
    },
    {
      id: "light",
      label: t("settings.themeLightLabel"),
      desc: t("settings.themeLightDesc"),
      icon: <Sun size={16} className="text-amber-500" />,
    },
  ];

  const langOptions: { id: LanguageSelection; label: string; desc: string; flag: string }[] = [
    {
      id: "auto",
      label: t("settings.langAutoLabel"),
      desc: t("settings.langAutoDesc", { tz: detectedTimezone, cur: language === "vi" ? "Tiếng Việt" : "English" }),
      flag: "🌐",
    },
    {
      id: "vi",
      label: t("settings.langViLabel"),
      desc: t("settings.langViDesc"),
      flag: "🇻🇳",
    },
    {
      id: "en",
      label: t("settings.langEnLabel"),
      desc: t("settings.langEnDesc"),
      flag: "🇺🇸",
    },
  ];

  const navItems: {
    id: SettingsTab;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: "profile",
      label: t("settings.tabProfile") || "Hồ sơ cá nhân",
      icon: <User size={15} />,
    },
    {
      id: "appearance",
      label: t("settings.tabAppearance") || "Giao diện",
      icon: <Palette size={15} />,
    },
    {
      id: "language",
      label: t("settings.tabLanguage") || "Ngôn ngữ",
      icon: <Globe size={15} />,
    },
    {
      id: "audio",
      label: t("settings.tabAudio") || "Âm thanh",
      icon: <Volume2 size={15} />,
    },
    {
      id: "privacy_export",
      label: t("settings.tabPrivacy") || "Bảo mật & Dữ liệu",
      icon: <ShieldCheck size={15} />,
    },
    {
      id: "voice_record",
      label: t("settings.tabVoiceRecord") || "Micro & Thu âm",
      icon: <Mic size={15} />,
    },
  ];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-150 select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:w-[95vw] md:w-[1100px] lg:w-[1240px] xl:w-[1360px] max-w-[96vw] h-[94dvh] sm:h-[92vh] max-h-[100dvh] sm:max-h-[820px] bg-white dark:bg-[#121218] border-t sm:border border-slate-200 dark:border-[#262634] rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-800 dark:text-neutral-200 font-sans animate-in zoom-in-95 duration-150"
      >
        {/* Modal Header */}
        <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-slate-200 dark:border-[#22222e] flex items-center justify-between bg-slate-50 dark:bg-[#161620] shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-8 w-8 rounded-lg bg-[#f8a87c]/10 border border-[#f8a87c]/20 flex items-center justify-center text-[#f8a87c] shrink-0">
              <Settings size={18} />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white truncate">{t("settings.title") || "Cài đặt"}</h3>
              <p className="text-[11px] text-slate-500 dark:text-neutral-400 truncate">
                Tuỳ chỉnh hệ thống, giao diện và thiết bị thu âm giọng nói
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-[#1c1c28] hover:bg-slate-200 dark:hover:bg-[#252536] text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer shrink-0 ml-2"
            aria-label="Đóng cài đặt"
          >
            <X size={15} />
          </button>
        </div>

        {/* Modal Body: Left Tab Nav & Right Content Panel */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          {/* Navigation Tabs: Minimalist 1-line */}
          <div className="w-full md:w-52 bg-slate-50 dark:bg-[#0f0f15] border-b md:border-b-0 md:border-r border-slate-200 dark:border-[#20202c] p-2 sm:p-2.5 flex md:flex-col gap-1 overflow-x-auto md:overflow-y-auto shrink-0 no-scrollbar">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 md:w-full ${
                    isActive
                      ? "bg-[#f8a87c]/15 text-[#e0682b] dark:text-[#f8a87c] border border-[#f8a87c]/30 font-semibold shadow-xs"
                      : "text-slate-600 dark:text-neutral-400 hover:bg-slate-200/60 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white border border-transparent"
                  }`}
                >
                  <span className={isActive ? "text-[#e0682b] dark:text-[#f8a87c]" : "text-slate-500 dark:text-neutral-400"}>
                    {item.icon}
                  </span>
                  <span className="text-xs truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Panel Content */}
          <div className="flex-1 p-3.5 sm:p-5 overflow-y-auto space-y-4 sm:space-y-5 bg-white dark:bg-[#121218]">
            {/* 0. PROFILE TAB */}
            {activeTab === "profile" && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{t("settings.profileHeader")}</h3>
                  <p className="text-xs text-slate-500 dark:text-neutral-400">
                    {t("settings.profileSubtitle")}
                  </p>
                </div>

                {/* Profile Avatar Card */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#161620] border border-slate-200 dark:border-[#22222e] flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative shrink-0">
                    <div className="h-16 w-16 rounded-2xl bg-slate-100 dark:bg-[#2a2a34] text-[#e0682b] dark:text-[#f8a87c] border-2 border-[#f8a87c]/40 flex items-center justify-center text-xl font-bold overflow-hidden shadow-md">
                      {currentUser?.picture ? (
                        <img src={currentUser.picture} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : "US"
                      )}
                    </div>
                    <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-[#161620]" title={t("settings.profileOnline")} />
                  </div>

                  <div className="flex-1 text-center sm:text-left min-w-0">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {cleanDisplayName}
                      </h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#f8a87c]/10 border border-[#f8a87c]/30 text-[#f8a87c] font-semibold">
                        {currentUser?.roles?.[0] || "Authorized Member"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-neutral-400 font-mono mt-0.5 truncate">
                      {cleanDisplayEmail}
                    </p>
                    
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setEditName(currentUser?.name || "");
                      setEditAvatar(currentUser?.picture || "");
                      setIsEditingProfile(!isEditingProfile);
                    }}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#2a2a38] bg-white dark:bg-[#1c1c26] hover:border-[#f8a87c]/50 text-xs font-semibold text-slate-700 dark:text-neutral-300 hover:text-[#f8a87c] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs self-center sm:self-start"
                  >
                    <Edit3 size={13} />
                    <span>{isEditingProfile ? t("settings.profileEditCancel") : t("settings.profileEditBtn")}</span>
                  </button>
                </div>

                {/* Profile Edit Inline Form */}
                {isEditingProfile && (
                  <form onSubmit={handleSaveProfile} className="p-4 rounded-2xl bg-[#f8a87c]/5 border border-[#f8a87c]/30 space-y-3 animate-in fade-in duration-150">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                      <Edit3 size={14} className="text-[#f8a87c]" />
                      <span>{t("settings.profileEditTitle")}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-medium text-slate-600 dark:text-neutral-300">{t("settings.profileEditNameLabel")}</label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          placeholder="Nguyen Van A"
                          className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-[#161620] border border-slate-200 dark:border-[#2a2a38] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#f8a87c]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-medium text-slate-600 dark:text-neutral-300">{t("settings.profileEditAvatarLabel")}</label>
                        <input
                          type="url"
                          value={editAvatar}
                          onChange={(e) => setEditAvatar(e.target.value)}
                          placeholder="https://..."
                          className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-[#161620] border border-slate-200 dark:border-[#2a2a38] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#f8a87c]"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsEditingProfile(false)}
                        className="px-3 py-1.5 rounded-xl text-xs font-medium text-neutral-400 hover:text-white cursor-pointer"
                      >
                        {t("settings.profileEditCancel")}
                      </button>
                      <button
                        type="submit"
                        className="px-3.5 py-1.5 rounded-xl bg-[#f8a87c] hover:bg-[#f5935f] text-black text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                      >
                        <Save size={13} />
                        <span>{t("settings.profileEditSave")}</span>
                      </button>
                    </div>
                  </form>
                )}

                {profileSaveSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center gap-2 animate-in fade-in duration-150">
                    <Check size={14} className="text-emerald-400" />
                    <span>{t("settings.profileEditSuccess")}</span>
                  </div>
                )}

                {/* Detailed Metadata Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#161620] border border-slate-200 dark:border-[#22222e] space-y-1">
                    <span className="text-[11px] font-mono uppercase text-slate-500 dark:text-neutral-400 flex items-center gap-1.5">
                      <User size={12} className="text-[#f8a87c]" />
                      {t("settings.profileFullName")}
                    </span>
                    <div className="text-[13px] font-semibold text-slate-800 dark:text-white">
                      {cleanDisplayName}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#161620] border border-slate-200 dark:border-[#22222e] space-y-1">
                    <span className="text-[11px] font-mono uppercase text-slate-500 dark:text-neutral-400 flex items-center gap-1.5">
                      <Mail size={12} className="text-cyan-400" />
                      {t("settings.profileEmail")}
                    </span>
                    <div className="text-[13px] font-semibold text-slate-800 dark:text-white truncate">
                      {cleanDisplayEmail}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#161620] border border-slate-200 dark:border-[#22222e] space-y-1">
                    <span className="text-[11px] font-mono uppercase text-slate-500 dark:text-neutral-400 flex items-center gap-1.5">
                      <Key size={12} className="text-emerald-400" />
                      {t("settings.profileRoles")}
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {currentUser?.roles && currentUser.roles.length > 0 ? (
                        currentUser.roles.map((r) => (
                          <span key={r} className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono">
                            {r}
                          </span>
                        ))
                      ) : (
                        <span className="text-[13px] text-neutral-400 font-mono">member</span>
                      )}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#161620] border border-slate-200 dark:border-[#22222e] space-y-1">
                    <span className="text-[11px] font-mono uppercase text-slate-500 dark:text-neutral-400 flex items-center gap-1.5">
                      <ShieldCheck size={12} className="text-blue-400" />
                      {t("settings.profileSsoSession")}
                    </span>
                    <div className="text-[13px] font-medium text-emerald-400 flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{t("settings.profileSsoValid")}</span>
                    </div>
                  </div>
                </div>

                {/* Callout Banner when user hasn't set a password yet */}
                {hasPasswordSet === false && (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in duration-150">
                    <div className="flex items-start sm:items-center gap-3 min-w-0">
                      <div className="h-9 w-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 dark:text-amber-400 shrink-0 mt-0.5 sm:mt-0">
                        <AlertCircle size={18} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                          Tài khoản chưa thiết lập mật khẩu riêng
                        </h4>
                        <p className="text-[11px] text-amber-700/90 dark:text-amber-300/80 mt-0.5">
                          Bạn đang đăng nhập qua Google OAuth. Hãy tạo mật khẩu riêng để có thể đăng nhập trên mọi thiết bị và tăng cường bảo mật.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordForm(true);
                        setPasswordError(null);
                        setPasswordSuccess(null);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black text-xs font-semibold shrink-0 cursor-pointer shadow-xs transition-all flex items-center gap-1.5 self-end sm:self-auto"
                    >
                      <Key size={13} />
                      <span>Thiết lập ngay</span>
                    </button>
                  </div>
                )}

                {/* Security & Password Management Center */}
                <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 overflow-hidden transition-all duration-200">
                  <div
                    onClick={() => {
                      setShowPasswordForm(!showPasswordForm);
                      setPasswordError(null);
                      setPasswordSuccess(null);
                    }}
                    className="p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-blue-500/10 transition-colors select-none group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 group-hover:scale-105 transition-transform">
                        <Key size={18} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-[13px] font-semibold text-slate-800 dark:text-blue-300 flex items-center gap-2">
                          <span>{t("settings.password_change") || "Đổi mật khẩu"}</span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${hasPasswordSet === true ? "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/20" : hasPasswordSet === false ? "bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/20" : "bg-blue-500/10 text-blue-400 border-blue-500/20"}`}>
                            {hasPasswordSet === true ? "Đã có mật khẩu" : hasPasswordSet === false ? "Chưa tạo mật khẩu" : "Skyer Identity"}
                          </span>
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-neutral-400 truncate mt-0.5">
                          {t("settings.password_change_desc") || "Cập nhật mật khẩu bảo mật cho tài khoản Skyer"}
                        </p>
                      </div>
                    </div>
                    <div className="text-blue-500 dark:text-blue-400 group-hover:text-blue-600 dark:group-hover:text-blue-300 shrink-0 px-3 py-1.5 rounded-xl bg-blue-500/10 group-hover:bg-blue-500/20 border border-blue-500/30 flex items-center gap-1.5 text-xs font-semibold transition-all">
                      <span>{showPasswordForm ? "Thu gọn" : "Đặt lại mật khẩu"}</span>
                      {showPasswordForm ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </div>
                  </div>

                  {showPasswordForm && (
                    <div className="p-4 border-t border-blue-500/20 bg-slate-50/70 dark:bg-[#12121c]/80 space-y-3.5 animate-in fade-in duration-150">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-medium text-slate-600 dark:text-neutral-300 flex items-center gap-1.5">
                            <Lock size={12} className="text-blue-400" />
                            <span>{t("settings.new_password") || "Mật khẩu mới"}</span>
                          </label>
                          <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => {
                              setNewPassword(e.target.value);
                              setPasswordError(null);
                              setPasswordSuccess(null);
                            }}
                            placeholder="Nhập mật khẩu mới (tối thiểu 8 ký tự)"
                            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#161620] border border-slate-200 dark:border-[#2a2a38] text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-blue-500 transition-colors"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-medium text-slate-600 dark:text-neutral-300 flex items-center gap-1.5">
                            <Lock size={12} className="text-blue-400" />
                            <span>{t("settings.confirm_password") || "Xác nhận mật khẩu mới"}</span>
                          </label>
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => {
                              setConfirmPassword(e.target.value);
                              setPasswordError(null);
                              setPasswordSuccess(null);
                            }}
                            placeholder="Nhập lại mật khẩu mới"
                            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#161620] border border-slate-200 dark:border-[#2a2a38] text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-blue-500 transition-colors"
                          />
                        </div>
                      </div>

                      {passwordError && (
                        <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 dark:text-rose-400 text-xs flex items-center gap-2">
                          <span>{passwordError}</span>
                        </div>
                      )}

                      {passwordSuccess && (
                        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
                          <Check size={14} className="shrink-0" />
                          <span>{passwordSuccess}</span>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            const emailHint = cleanDisplayEmail && !cleanDisplayEmail.includes("@skyer.hmz.one") ? cleanDisplayEmail : undefined;
                            initiatePasswordReset(authConfig, emailHint);
                          }}
                          className="text-[11px] text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 flex items-center gap-1 cursor-pointer transition-colors self-start sm:self-auto"
                        >
                          <span>{t("settings.password_portal_redirect") || "Đặt lại qua mã xác thực Email (Skyer Portal)"}</span>
                          <ArrowRight size={11} />
                        </button>

                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              setShowPasswordForm(false);
                              setNewPassword("");
                              setConfirmPassword("");
                              setPasswordError(null);
                              setPasswordSuccess(null);
                            }}
                            className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-500 dark:text-neutral-400 hover:text-slate-800 dark:hover:text-white cursor-pointer transition-colors"
                          >
                            {t("settings.profileEditCancel") || "Hủy"}
                          </button>
                          <button
                            type="button"
                            disabled={savingPassword || !newPassword}
                            onClick={async () => {
                              if (!newPassword || savingPassword) return;
                              if (newPassword.length < 8) {
                                setPasswordError(t("settings.password_min_length") || "Mật khẩu phải có độ dài tối thiểu 8 ký tự!");
                                return;
                              }
                              if (newPassword !== confirmPassword) {
                                setPasswordError(t("settings.password_mismatch") || "Mật khẩu xác nhận không khớp!");
                                return;
                              }
                              setSavingPassword(true);
                              setPasswordError(null);
                              setPasswordSuccess(null);
                              try {
                                const res = await changeCurrentUserPassword(newPassword);
                                if (!res.ok) {
                                  setPasswordError(res.error || "Cập nhật mật khẩu thất bại");
                                } else {
                                  setPasswordSuccess(res.message || "Đã cập nhật mật khẩu thành công!");
                                  setHasPasswordSet(true);
                                  setNewPassword("");
                                  setConfirmPassword("");
                                  setTimeout(() => {
                                    setPasswordSuccess(null);
                                    setShowPasswordForm(false);
                                  }, 3000);
                                }
                              } catch (err: any) {
                                setPasswordError(err?.message || "Cập nhật mật khẩu thất bại");
                              } finally {
                                setSavingPassword(false);
                              }
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                          >
                            {savingPassword ? (
                              <Loader2 size={13} className="animate-spin" />
                            ) : (
                              <Lock size={13} />
                            )}
                            <span>{savingPassword ? "Đang lưu..." : (t("settings.change_password_btn") || "Cập nhật mật khẩu")}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sign Out Action in Profile */}
                <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-rose-400">{t("settings.profileSignOutTitle")}</span>
                    <p className="text-[11px] text-neutral-400">{t("settings.profileSignOutDesc")}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      initiateSkyerSignOut(authConfig);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs"
                  >
                    <LogOut size={13} />
                    <span>{t("auth.signOut")}</span>
                  </button>
                </div>
              </div>
            )}

            {/* 1. APPEARANCE TAB */}
            {activeTab === "appearance" && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-1">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">Chủ đề giao diện</span>
                  <span className="text-[10px] font-mono text-[#f8a87c] font-semibold capitalize">{themeMode === "system" ? "Tự động" : themeMode === "dark" ? "Tối" : "Sáng"}</span>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {themeOptions.map((opt) => {
                    const isSelected = themeMode === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => setThemeMode(opt.id)}
                        className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          isSelected
                            ? "bg-[#f8a87c]/10 border-[#f8a87c] text-white shadow-sm"
                            : "bg-slate-50 dark:bg-[#161622] border-slate-200 dark:border-[#262634] text-slate-700 dark:text-neutral-300 hover:border-[#f8a87c]/40"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${isSelected ? "bg-[#f8a87c]/20 text-[#f8a87c]" : "bg-slate-200 dark:bg-[#20202c] text-slate-600 dark:text-neutral-400"}`}>
                            {opt.icon}
                          </div>
                          <div>
                            <div className="text-[13px] font-semibold text-slate-900 dark:text-white">{opt.label}</div>
                            <div className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">{opt.desc}</div>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="h-6 w-6 rounded-full bg-[#f8a87c] text-black flex items-center justify-center shrink-0">
                            <Check size={14} className="stroke-[3]" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              
                {/* Layout Density Switcher (Compact / Normal / Comfortable) */}
                <div className="pt-2 border-t border-slate-200 dark:border-[#222230]">
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                    Độ Giãn Bố Cục (Layout Density)
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-neutral-400 mt-0.5">
                    Tối ưu mật độ thông tin hiển thị cho màn hình và cường độ làm việc:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-3">
                    {[
                      { id: "compact", label: "Compact", desc: "Mật độ cao, hiển thị >30 agents" },
                      { id: "normal", label: "Normal", desc: "Cân bằng tối ưu mặc định" },
                      { id: "comfortable", label: "Comfortable", desc: "Khoảng cách rộng rãi, dễ đọc" },
                    ].map((d) => {
                      const isSel = layoutDensity === d.id;
                      return (
                        <div
                          key={d.id}
                          onClick={() => handleDensityChange(d.id as any)}
                          className={`p-3 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                            isSel
                              ? "bg-[#f8a87c]/10 border-[#f8a87c] text-white shadow-sm"
                              : "bg-slate-50 dark:bg-[#161622] border-slate-200 dark:border-[#262634] text-slate-700 dark:text-neutral-300 hover:border-[#f8a87c]/40"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[13px] font-semibold">{d.label}</span>
                            {isSel && (
                              <div className="h-4 w-4 rounded-full bg-[#f8a87c] text-black flex items-center justify-center">
                                <Check size={10} className="stroke-[3]" />
                              </div>
                            )}
                          </div>
                          <span className="text-[11px] text-neutral-400 mt-1">{d.desc}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
</div>
            )}

            {/* 2. LANGUAGE TAB */}
            {activeTab === "language" && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-1">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">Ngôn ngữ hiển thị</span>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {langOptions.map((opt) => {
                    const isSelected = selection === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => setLanguageSelection(opt.id)}
                        className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          isSelected
                            ? "bg-[#f8a87c]/10 border-[#f8a87c] text-white shadow-sm"
                            : "bg-slate-50 dark:bg-[#161622] border-slate-200 dark:border-[#262634] text-slate-700 dark:text-neutral-300 hover:border-[#f8a87c]/40"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-xl shrink-0">{opt.flag}</div>
                          <div>
                            <div className="text-[13px] font-semibold text-slate-900 dark:text-white">{opt.label}</div>
                            <div className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">{opt.desc}</div>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="h-6 w-6 rounded-full bg-[#f8a87c] text-black flex items-center justify-center shrink-0">
                            <Check size={14} className="stroke-[3]" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. AUDIO TAB: Sound Chimes & TTS Voice Dynamics Studio */}
            {activeTab === "audio" && (
              <div className="space-y-6 animate-in fade-in duration-150">
                {/* 3A. Sound Notification Switch & Presets */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#222230]">
                    <div>
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                        <Bell size={14} className="text-[#f8a87c]" />
                        <span>{t("settings.audioChimeTitle")}</span>
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-neutral-400 mt-0.5">
                        {t("settings.audioChimeDesc")}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const next = !isSoundEnabled;
                        setIsSoundEnabled(next);
                        try {
                          localStorage.setItem("agent360_sound_enabled", next ? "true" : "false");
                        } catch {}
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-mono font-medium border transition-all cursor-pointer ${
                        isSoundEnabled
                          ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                          : "bg-white/5 border-white/10 text-slate-500 dark:text-neutral-400"
                      }`}
                    >
                      {isSoundEnabled ? t("settings.audioEnabled") : t("settings.audioMuted")}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {SOUND_PRESETS.map((preset) => {
                      const isSelected = selectedPreset === preset.id;
                      return (
                        <div
                          key={preset.id}
                          onClick={() => handleSelectPreset(preset.id as SoundPreset)}
                          className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                            isSelected
                              ? "bg-[#f8a87c]/10 border-[#f8a87c] text-white shadow-xs"
                              : "bg-slate-50 dark:bg-[#161622] border-slate-200 dark:border-[#262634] text-slate-700 dark:text-neutral-300 hover:border-[#f8a87c]/40"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 pr-1">
                            <div className={`p-1.5 rounded-lg shrink-0 ${isSelected ? "bg-[#f8a87c]/20 text-[#f8a87c]" : "bg-slate-200 dark:bg-[#20202c] text-slate-600 dark:text-neutral-400"}`}>
                              <Volume2 size={14} />
                            </div>
                            <div className="min-w-0 truncate">
                              <div className="text-[13px] font-semibold text-slate-900 dark:text-white truncate">{preset.name}</div>
                              <div className="text-[11px] text-slate-500 dark:text-neutral-400 truncate">{preset.description}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                playNotificationChime(preset.id as SoundPreset);
                              }}
                              className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-700 dark:text-neutral-300 hover:text-white text-[10px] font-mono transition-colors"
                              title={t("settings.audioTestBtn")}
                            >
                              {t("settings.audioTestBtn")}
                            </button>
                            {isSelected && (
                              <div className="h-4 w-4 rounded-full bg-[#f8a87c] text-black flex items-center justify-center shrink-0">
                                <Check size={10} className="stroke-[3]" />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3B. Voice Dynamics (Text-to-Speech Synthesis Studio) */}
                <div className="space-y-4 pt-4 border-t border-[#222230]">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <Mic size={14} className="text-cyan-400" />
                      <span>{t("settings.ttsTitle")}</span>
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-neutral-400 mt-0.5">
                      {t("settings.ttsDesc")}
                    </p>
                  </div>

                  {/* System Voice Selection */}
                  <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-[#161622] border border-slate-200 dark:border-[#262634]">
                    <div className="flex items-center justify-between text-xs text-slate-700 dark:text-neutral-300">
                      <span className="font-medium">{t("settings.ttsVoiceLabel")}</span>
                      <span className="font-mono text-[#f8a87c] text-[11px]">
                        {systemVoices.find(v => v.voiceURI === selectedVoiceURI)?.lang || "Tự động nhận diện"}
                      </span>
                    </div>
                    <CustomSelect
                      value={selectedVoiceURI}
                      onChange={(uri) => {
                        setSelectedVoiceURI(uri);
                        saveStoredSpeechSettings({ voiceURI: uri });
                      }}
                      options={[
                        { value: "", label: t("settings.ttsVoiceAuto") },
                        ...systemVoices.map((v) => ({
                          value: v.voiceURI,
                          label: `${v.name} (${v.lang})`,
                        })),
                      ]}
                      className="w-full"
                      triggerClassName="w-full bg-white dark:bg-[#121218] text-[13px] text-slate-800 dark:text-neutral-200 border border-[#2a2a3c] hover:border-[#f8a87c] rounded-lg px-2.5 py-2"
                      searchable={true}
                    />
                  </div>

                  {/* Sliders for Rate & Pitch */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Speed Slider */}
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#161622] border border-slate-200 dark:border-[#262634] space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-700 dark:text-neutral-300">
                        <span className="font-medium">{t("settings.ttsSpeedLabel")}</span>
                        <span className="font-mono text-[#f8a87c] font-semibold text-xs">{speechRate.toFixed(2)}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.8"
                        max="1.5"
                        step="0.05"
                        value={speechRate}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setSpeechRate(val);
                          saveStoredSpeechSettings({ rate: val });
                        }}
                        className="w-full accent-[#f8a87c] h-1.5 bg-slate-200 dark:bg-[#22222e] rounded-lg cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] font-mono text-neutral-500">
                        <span>{t("settings.ttsSpeedSlow")}</span>
                        <span>{t("settings.ttsSpeedNormal")}</span>
                        <span>{t("settings.ttsSpeedFast")}</span>
                      </div>
                    </div>

                    {/* Pitch Slider */}
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#161622] border border-slate-200 dark:border-[#262634] space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-700 dark:text-neutral-300">
                        <span className="font-medium">{t("settings.ttsPitchLabel")}</span>
                        <span className="font-mono text-[#f8a87c] font-semibold text-xs">{speechPitch.toFixed(2)}</span>
                      </div>
                      <input
                        type="range"
                        min="0.7"
                        max="1.4"
                        step="0.05"
                        value={speechPitch}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setSpeechPitch(val);
                          saveStoredSpeechSettings({ pitch: val });
                        }}
                        className="w-full accent-[#f8a87c] h-1.5 bg-slate-200 dark:bg-[#22222e] rounded-lg cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] font-mono text-neutral-500">
                        <span>{t("settings.ttsPitchLow")}</span>
                        <span>{t("settings.ttsPitchNormal")}</span>
                        <span>{t("settings.ttsPitchHigh")}</span>
                      </div>
                    </div>
                  </div>

                  {/* Audition Button */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        if (isTestingSpeech) {
                          stopSpeaking();
                          setIsTestingSpeech(false);
                        } else {
                          setIsTestingSpeech(true);
                          speakText(t("settings.ttsTestSpeakText"), {
                            rate: speechRate,
                            pitch: speechPitch,
                            voiceURI: selectedVoiceURI,
                            onEnd: () => setIsTestingSpeech(false),
                            onError: () => setIsTestingSpeech(false),
                          });
                        }
                      }}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer border ${
                        isTestingSpeech
                          ? "bg-red-500/20 border-red-500/40 text-red-400 shadow-sm"
                          : "bg-[#1e1e2c] hover:bg-[#28283a] border-slate-200 dark:border-[#2e2e42] text-white hover:border-[#f8a87c]/40"
                      }`}
                    >
                      {isTestingSpeech ? (
                        <>
                          <Square size={13} className="fill-red-400" />
                          <span>{t("settings.ttsAuditionStop")}</span>
                        </>
                      ) : (
                        <>
                          <Play size={13} className="text-[#f8a87c] fill-[#f8a87c]" />
                          <span>{t("settings.ttsAuditionStart")}</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSpeechRate(1.05);
                        setSpeechPitch(1.0);
                        setSelectedVoiceURI("");
                        saveStoredSpeechSettings({ rate: 1.05, pitch: 1.0, voiceURI: "" });
                      }}
                      className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-500 dark:text-neutral-400 hover:text-white text-xs font-mono transition-colors cursor-pointer"
                      title={t("settings.ttsResetDefault")}
                    >
                      {t("settings.ttsResetDefault")}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 4. DATA & PERMISSIONS TAB */}
            {activeTab === "privacy_export" && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div>
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                    {t("settings.permsHeader")}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-neutral-400 mt-0.5">
                    {t("settings.permsSubtitle")}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {onOpenStarredAndShortcuts && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenStarredAndShortcuts();
                      }}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#161622] border border-slate-200 dark:border-[#262634] hover:border-amber-400/50 text-left transition-all cursor-pointer flex items-center justify-between gap-2.5 group shadow-xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 rounded-lg bg-amber-400/15 text-amber-400 shrink-0">
                          <Star size={16} className={starredCount > 0 ? "fill-amber-400" : ""} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[13px] font-semibold text-slate-900 dark:text-white truncate flex items-center gap-1.5">
                            <span>Tin nhắn đã gắn sao & Phím tắt</span>
                            {starredCount > 0 && (
                              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-amber-400/20 text-amber-400 font-bold">
                                {starredCount}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-neutral-400 truncate">
                            Quản lý tin nhắn đánh dấu sao và tra cứu phím tắt (Ctrl+/)
                          </div>
                        </div>
                      </div>
                      <Command size={14} className="text-neutral-400 group-hover:text-amber-400 shrink-0 transition-colors" />
                    </button>
                  )}

                  {onOpenPermissions && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenPermissions();
                      }}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#161622] border border-slate-200 dark:border-[#262634] hover:border-[#f8a87c]/50 text-left transition-all cursor-pointer flex items-center gap-2.5 shadow-xs"
                    >
                      <div className="p-2 rounded-lg bg-[#f8a87c]/15 text-[#f8a87c] shrink-0">
                        <ShieldCheck size={16} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[13px] font-semibold text-slate-900 dark:text-white truncate">{t("settings.permMicTitle")}</div>
                        <div className="text-[11px] text-slate-500 dark:text-neutral-400 truncate">{t("settings.permMicDesc")}</div>
                      </div>
                    </button>
                  )}

                  {onStartTour && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onStartTour();
                      }}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#161622] border border-slate-200 dark:border-[#262634] hover:border-[#f8a87c]/50 text-left transition-all cursor-pointer flex items-center gap-2.5 shadow-xs"
                    >
                      <div className="p-2 rounded-lg bg-[#f8a87c]/15 text-[#f8a87c] shrink-0">
                        <Sparkles size={16} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[13px] font-semibold text-slate-900 dark:text-white truncate">{t("settings.tourTitle")}</div>
                        <div className="text-[11px] text-slate-500 dark:text-neutral-400 truncate">{t("settings.tourDesc")}</div>
                      </div>
                    </button>
                  )}

                  {onResetChecklist && (
                    <button
                      type="button"
                      onClick={() => {
                        onResetChecklist();
                      }}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#161622] border border-slate-200 dark:border-[#262634] hover:border-amber-500/50 text-left transition-all cursor-pointer flex items-center gap-2.5 shadow-xs"
                    >
                      <div className="p-2 rounded-lg bg-amber-500/15 text-amber-400 shrink-0">
                        <Sparkles size={16} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[13px] font-semibold text-slate-900 dark:text-white truncate">{t("settings.checklistTitle")}</div>
                        <div className="text-[11px] text-slate-500 dark:text-neutral-400 truncate">{t("settings.checklistDesc")}</div>
                      </div>
                    </button>
                  )}

                  {onInstallPwa && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onInstallPwa();
                      }}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#161622] border border-slate-200 dark:border-[#262634] hover:border-[#f8a87c]/50 text-left transition-all cursor-pointer flex items-center gap-2.5 shadow-xs"
                    >
                      <div className="p-2 rounded-lg bg-[#f8a87c]/15 text-[#f8a87c] shrink-0">
                        <Smartphone size={16} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[13px] font-semibold text-slate-900 dark:text-white truncate">{t("settings.pwaTitle")}</div>
                        <div className="text-[11px] text-slate-500 dark:text-neutral-400 truncate">{t("settings.pwaDesc")}</div>
                      </div>
                    </button>
                  )}
                </div>

                <div className="pt-2 border-t border-[#222230]">
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                    Tải về nhật ký trò chuyện
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                    {onExportMarkdown && (
                      <button
                        type="button"
                        onClick={onExportMarkdown}
                        className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#161622] hover:bg-[#20202e] border border-slate-200 dark:border-[#262634] text-left transition-all cursor-pointer flex items-center gap-2 text-[13px] text-slate-800 dark:text-neutral-200"
                      >
                        <Download size={14} className="text-[#f8a87c] shrink-0" />
                        <span className="truncate">Tệp văn bản (.md)</span>
                      </button>
                    )}
                    {onExportJson && (
                      <button
                        type="button"
                        onClick={onExportJson}
                        className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#161622] hover:bg-[#20202e] border border-slate-200 dark:border-[#262634] text-left transition-all cursor-pointer flex items-center gap-2 text-[13px] text-slate-800 dark:text-neutral-200"
                      >
                        <FileText size={14} className="text-cyan-400 shrink-0" />
                        <span className="truncate">Dữ liệu gốc (.json)</span>
                      </button>
                    )}
                    {onExportCertificate && (
                      <button
                        type="button"
                        onClick={onExportCertificate}
                        className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#161622] hover:bg-[#20202e] border border-slate-200 dark:border-[#262634] text-left transition-all cursor-pointer flex items-center gap-2 text-[13px] text-slate-800 dark:text-neutral-200"
                      >
                        <Shield size={14} className="text-emerald-400 shrink-0" />
                        <span className="truncate">Chứng chỉ kiểm định (.html)</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 5. VOICE RECORDING & MICROPHONE SETTINGS TAB */}
            {activeTab === "voice_record" && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-[#222230]">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <Mic size={14} className="text-[#f8a87c]" />
                      <span>{t("settings.tabVoiceRecord") || "Cài đặt Thu âm & Micro"}</span>
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-neutral-400 mt-0.5">
                      {agentName ? `Hiệu chỉnh thiết bị micro và tham số bắt giọng cho Agent ${agentName}` : "Hiệu chỉnh tham số nhận diện giọng nói, micro và độ nhạy VAD"}
                    </p>
                  </div>
                  {agentName && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#f8a87c]/10 text-[#f8a87c] border border-[#f8a87c]/30 shrink-0">
                      Agent: {agentName}
                    </span>
                  )}
                </div>

                {/* 1. Speech Recognition Input Language Accent (VI / EN) */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#161620] border border-slate-200 dark:border-[#22222e] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe size={15} className="text-[#f8a87c]" />
                      <span className="text-[13px] font-semibold text-slate-900 dark:text-white">Input Language Accent (STT)</span>
                    </div>
                    <span className="text-[11px] font-mono text-[#f8a87c] font-bold">
                      {sttLang === "vi-VN" ? "Tiếng Việt" : "English"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-neutral-400 leading-relaxed">
                    Select the primary speech-to-text recognition model for best transcription accuracy:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => onSttLangChange?.("vi-VN")}
                      className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-all cursor-pointer ${
                        sttLang === "vi-VN"
                          ? "bg-[#f8a87c]/20 border-[#f8a87c] text-white font-bold shadow-xs"
                          : "bg-slate-100 dark:bg-[#1c1c28] border-[#28283a] text-slate-500 dark:text-neutral-400 hover:text-white"
                      }`}
                    >
                      <span>Tiếng Việt (vi-VN)</span>
                      {sttLang === "vi-VN" && <CheckCircle2 size={13} className="text-[#f8a87c]" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => onSttLangChange?.("en-US")}
                      className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-all cursor-pointer ${
                        sttLang === "en-US"
                          ? "bg-[#f8a87c]/20 border-[#f8a87c] text-white font-bold shadow-xs"
                          : "bg-slate-100 dark:bg-[#1c1c28] border-[#28283a] text-slate-500 dark:text-neutral-400 hover:text-white"
                      }`}
                    >
                      <span>English (en-US)</span>
                      {sttLang === "en-US" && <CheckCircle2 size={13} className="text-[#f8a87c]" />}
                    </button>
                  </div>
                </div>

                {/* 2. Microphone Hardware Device */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#161620] border border-slate-200 dark:border-[#22222e] space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-700 dark:text-neutral-300">
                    <span className="text-[13px] font-semibold text-slate-900 dark:text-white">Target Microphone Hardware:</span>
                    <span className="text-[10px] text-neutral-500 font-sans">
                      {audioDevices.length > 0 ? `${audioDevices.length} connected` : "Default"}
                    </span>
                  </div>
                  <CustomSelect
                    value={selectedMicId}
                    onChange={(val) => handleDeviceChange(val)}
                    options={[
                      { value: "", label: "Default System Microphone" },
                      ...audioDevices.map((d) => ({
                        value: d.deviceId,
                        label: d.label || `Microphone (${d.deviceId.slice(0, 8)}...)`,
                      })),
                    ]}
                    className="w-full"
                    triggerClassName="w-full bg-slate-100 dark:bg-[#1c1c28] border border-[#28283a] hover:border-[#f8a87c] rounded-lg px-2.5 py-1.5 text-xs text-white font-sans"
                  />
                </div>

                {/* 3. Voice Activity Detection (VAD) Mode & Silence Threshold */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#161620] border border-slate-200 dark:border-[#22222e] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-semibold text-slate-900 dark:text-white">Interaction Mode</span>
                    <span className="text-[10px] font-mono text-slate-500 dark:text-neutral-400">
                      {vadMode === "continuous" ? "Hands-Free VAD" : vadMode === "push_to_talk" ? "Push-to-Talk" : "Manual"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => handleVadModeChange("continuous")}
                      className={`px-2 py-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                        vadMode === "continuous"
                          ? "bg-[#f8a87c]/20 border-[#f8a87c] text-white font-bold"
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
                          ? "bg-[#f8a87c]/20 border-[#f8a87c] text-white font-bold"
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
                          ? "bg-[#f8a87c]/20 border-[#f8a87c] text-white font-bold"
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
                                ? "bg-[#f8a87c] text-black font-bold"
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
                      <span className="text-[13px] font-semibold text-slate-900 dark:text-white">Network & Low-Latency Profile</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      WebRTC Optimized
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-neutral-400">
                    Tune audio bitrate and acoustic filters for optimal voice responsiveness under low bandwidth:
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                    <div className="bg-slate-50 dark:bg-[#12121a] border border-slate-200 dark:border-[#222230] rounded-lg p-2.5 space-y-1.5">
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

                    <div className="bg-slate-50 dark:bg-[#12121a] border border-slate-200 dark:border-[#222230] rounded-xl p-2.5">
                      <ToggleSwitch
                        size="sm"
                        checked={voiceProfile.lowLatencyMode}
                        onChange={(checked) => handleProfileChange({ lowLatencyMode: checked })}
                        label="Ultra-Low Latency"
                        description={voiceProfile.lowLatencyMode ? "Zero buffer delay (<80ms)" : "Standard buffer smoothing"}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[10px] font-mono">
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
                      <Activity size={14} className="text-[#f8a87c]" />
                      <span className="text-[13px] font-semibold text-slate-900 dark:text-white">Frequency Bands Equalizer</span>
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

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono pt-1">
                    {/* Bass Band */}
                    <div className="bg-slate-50 dark:bg-[#12121a] border border-slate-200 dark:border-[#222230] rounded-lg p-2 flex flex-col items-center gap-1.5">
                      <div className="flex items-center justify-between w-full text-[10px] text-neutral-400">
                        <span>Bass</span>
                        <span className="text-[#f8a87c] font-bold">{freqBands.bass}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#20202e] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-[#f8a87c] transition-all duration-75 rounded-full"
                          style={{ width: `${Math.max(4, freqBands.bass)}%` }}
                        />
                      </div>
                      <span className="text-[9px] text-neutral-500">60-250 Hz</span>
                    </div>

                    {/* Mid Band */}
                    <div className="bg-slate-50 dark:bg-[#12121a] border border-slate-200 dark:border-[#222230] rounded-lg p-2 flex flex-col items-center gap-1.5">
                      <div className="flex items-center justify-between w-full text-[10px] text-neutral-400">
                        <span>Mid</span>
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
                    <div className="bg-slate-50 dark:bg-[#12121a] border border-slate-200 dark:border-[#222230] rounded-lg p-2 flex flex-col items-center gap-1.5">
                      <div className="flex items-center justify-between w-full text-[10px] text-neutral-400">
                        <span>Treble</span>
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
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-4 sm:px-5 py-2.5 sm:py-3 bg-slate-50 dark:bg-[#0f0f15] border-t border-slate-200 dark:border-[#1e1e28] flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-neutral-500 shrink-0">
          <span className="truncate">Skyer Không Gian Đồng Đội AI</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-slate-200/60 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-neutral-200 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-xs font-sans font-medium shrink-0 ml-2"
          >
            Đóng bảng
          </button>
        </div>
      </div>
    </div>
  );
}
