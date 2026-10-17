import React, { useState } from "react";
import {
  X,
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
} from "lucide-react";
import { useTheme, ThemeMode } from "../context/ThemeContext";
import { useTranslation, LanguageSelection } from "../i18n/LanguageContext";
import { SOUND_PRESETS, SoundPreset, playNotificationChime } from "../services/notificationService";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  // External action handlers passed from workspace
  onOpenPermissions?: () => void;
  onStartTour?: () => void;
  onResetChecklist?: () => void;
  onExportMarkdown?: () => void;
  onExportJson?: () => void;
  onExportCertificate?: () => void;
  onInstallPwa?: () => void;
  isPwaInstallable?: boolean;
}

type SettingsTab = "appearance" | "language" | "audio" | "privacy_export";

export function SettingsModal({
  isOpen,
  onClose,
  onOpenPermissions,
  onStartTour,
  onResetChecklist,
  onExportMarkdown,
  onExportJson,
  onExportCertificate,
  onInstallPwa,
  isPwaInstallable,
}: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("appearance");

  // Theme state
  const { themeMode, resolvedTheme, setThemeMode } = useTheme();

  // Language state
  const { language, selection, setLanguageSelection, detectedTimezone, t } = useTranslation();

  // Sound preset state
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
      label: "Hệ thống (System Auto)",
      desc: "Tự động đồng bộ với chế độ sáng/tối của hệ điều hành",
      icon: <Monitor size={16} />,
    },
    {
      id: "dark",
      label: "Tối (Dark OLED)",
      desc: "Độ tương phản cao, tối ưu pin và giảm mỏi mắt ban đêm",
      icon: <Moon size={16} className="text-blue-400" />,
    },
    {
      id: "light",
      label: "Sáng (Light Mode)",
      desc: "Giao diện thanh lịch, tương phản rõ ràng ban ngày",
      icon: <Sun size={16} className="text-amber-500" />,
    },
  ];

  const langOptions: { id: LanguageSelection; label: string; desc: string; flag: string }[] = [
    {
      id: "auto",
      label: "Tự động (Auto Detect)",
      desc: `Vị trí máy: ${detectedTimezone} • ${language === "vi" ? "Tiếng Việt" : "English"}`,
      flag: "🌐",
    },
    {
      id: "vi",
      label: "Tiếng Việt",
      desc: "Giao diện và trợ lý hiển thị bằng Tiếng Việt (vi-VN)",
      flag: "🇻🇳",
    },
    {
      id: "en",
      label: "English",
      desc: "Default international workspace locale (en-US)",
      flag: "🇺🇸",
    },
  ];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-[#121218] border border-[#262634] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-neutral-200 font-sans animate-in zoom-in-95 duration-150 max-h-[85vh]"
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[#22222e] flex items-center justify-between bg-[#161620]">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-[#ff7a00]/10 border border-[#ff7a00]/20 flex items-center justify-center text-[#ff7a00]">
              <Settings size={18} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Cài đặt Workspace & Hệ thống</h3>
              <p className="text-[11px] text-neutral-400">
                Tuỳ chỉnh giao diện, ngôn ngữ, âm báo và bảo mật thiết bị
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

        {/* Modal Body: Left Tab Nav & Right Content Panel */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          {/* Navigation Tabs */}
          <div className="w-full md:w-48 bg-[#0f0f15] border-b md:border-b-0 md:border-r border-[#20202c] p-2 space-y-1 shrink-0 flex md:flex-col overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab("appearance")}
              className={`flex-1 md:flex-initial flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === "appearance"
                  ? "bg-[#ff7a00]/15 text-[#ff7a00] font-semibold"
                  : "text-neutral-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Palette size={15} />
              <span>Giao diện (Theme)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("language")}
              className={`flex-1 md:flex-initial flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === "language"
                  ? "bg-[#ff7a00]/15 text-[#ff7a00] font-semibold"
                  : "text-neutral-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Globe size={15} />
              <span>Ngôn ngữ (Locale)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("audio")}
              className={`flex-1 md:flex-initial flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === "audio"
                  ? "bg-[#ff7a00]/15 text-[#ff7a00] font-semibold"
                  : "text-neutral-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Volume2 size={15} />
              <span>Âm báo (Chime)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("privacy_export")}
              className={`flex-1 md:flex-initial flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === "privacy_export"
                  ? "bg-[#ff7a00]/15 text-[#ff7a00] font-semibold"
                  : "text-neutral-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <ShieldCheck size={15} />
              <span>Dữ liệu & Quyền</span>
            </button>
          </div>

          {/* Right Panel Content */}
          <div className="flex-1 p-5 overflow-y-auto space-y-5 bg-[#14141c]">
            {/* 1. APPEARANCE TAB */}
            {activeTab === "appearance" && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div>
                  <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                    Chủ đề giao diện (Theme Mode)
                  </h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Hiện tại đang áp dụng: <span className="text-[#ff7a00] font-semibold capitalize">{themeMode} ({resolvedTheme})</span>
                  </p>
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
                            ? "bg-[#ff7a00]/10 border-[#ff7a00] text-white shadow-sm"
                            : "bg-[#181822] border-[#262634] text-neutral-300 hover:border-[#38384c]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${isSelected ? "bg-[#ff7a00]/20 text-[#ff7a00]" : "bg-[#20202c] text-neutral-400"}`}>
                            {opt.icon}
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-white">{opt.label}</div>
                            <div className="text-[11px] text-neutral-400 mt-0.5">{opt.desc}</div>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="h-6 w-6 rounded-full bg-[#ff7a00] text-black flex items-center justify-center shrink-0">
                            <Check size={14} className="stroke-[3]" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. LANGUAGE TAB */}
            {activeTab === "language" && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div>
                  <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                    Ngôn ngữ hiển thị (Interface Language)
                  </h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Tự động nhận diện khu vực & múi giờ hoặc ghim ngôn ngữ ưu tiên
                  </p>
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
                            ? "bg-[#ff7a00]/10 border-[#ff7a00] text-white shadow-sm"
                            : "bg-[#181822] border-[#262634] text-neutral-300 hover:border-[#38384c]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-xl shrink-0">{opt.flag}</div>
                          <div>
                            <div className="text-xs font-semibold text-white">{opt.label}</div>
                            <div className="text-[11px] text-neutral-400 mt-0.5">{opt.desc}</div>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="h-6 w-6 rounded-full bg-[#ff7a00] text-black flex items-center justify-center shrink-0">
                            <Check size={14} className="stroke-[3]" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. AUDIO TAB */}
            {activeTab === "audio" && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div>
                  <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                    Âm thanh phản hồi & Chuông thông báo
                  </h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Chọn chuông báo khi agent hoàn thành nhiệm vụ hoặc trả lời tin nhắn
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {SOUND_PRESETS.map((preset) => {
                    const isSelected = selectedPreset === preset.id;
                    return (
                      <div
                        key={preset.id}
                        onClick={() => handleSelectPreset(preset.id as SoundPreset)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          isSelected
                            ? "bg-[#ff7a00]/10 border-[#ff7a00] text-white"
                            : "bg-[#181822] border-[#262634] text-neutral-300 hover:border-[#38384c]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-1.5 rounded-lg ${isSelected ? "bg-[#ff7a00]/20 text-[#ff7a00]" : "bg-[#20202c] text-neutral-400"}`}>
                            <Volume2 size={15} />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-white">{preset.name}</div>
                            <div className="text-[10px] text-neutral-400">{preset.description}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              playNotificationChime(preset.id as SoundPreset);
                            }}
                            className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-[11px] font-mono transition-colors"
                          >
                            Nghe thử
                          </button>
                          {isSelected && (
                            <div className="h-5 w-5 rounded-full bg-[#ff7a00] text-black flex items-center justify-center shrink-0">
                              <Check size={12} className="stroke-[3]" />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. DATA & PERMISSIONS TAB */}
            {activeTab === "privacy_export" && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div>
                  <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                    Quyền hạn thiết bị & Onboarding
                  </h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Quản lý micro, thông báo và hỗ trợ người dùng mới
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {onOpenPermissions && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenPermissions();
                      }}
                      className="p-3 rounded-xl bg-[#181822] border border-[#262634] hover:border-[#ff7a00]/50 text-left transition-all cursor-pointer flex items-center gap-2.5"
                    >
                      <div className="p-2 rounded-lg bg-[#ff7a00]/15 text-[#ff7a00]">
                        <ShieldCheck size={16} />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">Quản lý Quyền Browser</div>
                        <div className="text-[10px] text-neutral-400">Microphone, Audio, Clipboard</div>
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
                      className="p-3 rounded-xl bg-[#181822] border border-[#262634] hover:border-[#ff7a00]/50 text-left transition-all cursor-pointer flex items-center gap-2.5"
                    >
                      <div className="p-2 rounded-lg bg-[#ff7a00]/15 text-[#ff7a00]">
                        <Sparkles size={16} />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">Chạy App Tour</div>
                        <div className="text-[10px] text-neutral-400">Hướng dẫn Driver.js tương tác</div>
                      </div>
                    </button>
                  )}

                  {onResetChecklist && (
                    <button
                      type="button"
                      onClick={() => {
                        onResetChecklist();
                      }}
                      className="p-3 rounded-xl bg-[#181822] border border-[#262634] hover:border-amber-500/50 text-left transition-all cursor-pointer flex items-center gap-2.5"
                    >
                      <div className="p-2 rounded-lg bg-amber-500/15 text-amber-400">
                        <Sparkles size={16} />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">Mở lại Checklist</div>
                        <div className="text-[10px] text-neutral-400">Hiện lại bảng mốc tiến độ</div>
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
                      className="p-3 rounded-xl bg-[#181822] border border-[#262634] hover:border-[#ff7a00]/50 text-left transition-all cursor-pointer flex items-center gap-2.5"
                    >
                      <div className="p-2 rounded-lg bg-[#ff7a00]/15 text-[#ff7a00]">
                        <Smartphone size={16} />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">Cài đặt Skyer PWA</div>
                        <div className="text-[10px] text-neutral-400">Chạy như ứng dụng desktop / mobile</div>
                      </div>
                    </button>
                  )}
                </div>

                <div className="pt-2 border-t border-[#222230]">
                  <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                    Xuất dữ liệu phiên hội thoại
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                    {onExportMarkdown && (
                      <button
                        type="button"
                        onClick={onExportMarkdown}
                        className="p-2.5 rounded-xl bg-[#181822] hover:bg-[#20202e] border border-[#262634] text-left transition-all cursor-pointer flex items-center gap-2 text-xs text-neutral-200"
                      >
                        <Download size={14} className="text-[#ff7a00] shrink-0" />
                        <span className="truncate">Markdown (.md)</span>
                      </button>
                    )}
                    {onExportJson && (
                      <button
                        type="button"
                        onClick={onExportJson}
                        className="p-2.5 rounded-xl bg-[#181822] hover:bg-[#20202e] border border-[#262634] text-left transition-all cursor-pointer flex items-center gap-2 text-xs text-neutral-200"
                      >
                        <FileText size={14} className="text-cyan-400 shrink-0" />
                        <span className="truncate">Audit Trail (.json)</span>
                      </button>
                    )}
                    {onExportCertificate && (
                      <button
                        type="button"
                        onClick={onExportCertificate}
                        className="p-2.5 rounded-xl bg-[#181822] hover:bg-[#20202e] border border-[#262634] text-left transition-all cursor-pointer flex items-center gap-2 text-xs text-neutral-200"
                      >
                        <Shield size={14} className="text-emerald-400 shrink-0" />
                        <span className="truncate">Certificate (.html)</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-[#0f0f15] border-t border-[#1e1e28] flex items-center justify-between text-[11px] font-mono text-neutral-500">
          <span>Skyer Platform Control Center</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-200 hover:text-white transition-colors cursor-pointer text-xs font-sans font-medium"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
