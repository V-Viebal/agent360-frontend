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
      desc: "Tự động đổi sáng hoặc tối theo cài đặt máy tính của bạn",
      icon: <Monitor size={16} />,
    },
    {
      id: "dark",
      label: "Ban đêm (Dark OLED)",
      desc: "Nền đen êm mắt, đỡ chói khi làm việc buổi tối",
      icon: <Moon size={16} className="text-blue-400" />,
    },
    {
      id: "light",
      label: "Ban ngày (Light Mode)",
      desc: "Giao diện sáng sủa, dễ nhìn dưới ánh sáng phòng",
      icon: <Sun size={16} className="text-amber-500" />,
    },
  ];

  const langOptions: { id: LanguageSelection; label: string; desc: string; flag: string }[] = [
    {
      id: "auto",
      label: "Tự động (Theo vị trí máy)",
      desc: `Vị trí máy: ${detectedTimezone} • ${language === "vi" ? "Tiếng Việt" : "English"}`,
      flag: "🌐",
    },
    {
      id: "vi",
      label: "Tiếng Việt",
      desc: "Toàn bộ giao diện và trao đổi hiển thị bằng Tiếng Việt thân thiện",
      flag: "🇻🇳",
    },
    {
      id: "en",
      label: "English",
      desc: "Giao diện chuẩn tiếng Anh quốc tế (en-US)",
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
              <h3 className="text-sm font-semibold text-white">Cài đặt không gian làm việc</h3>
              <p className="text-[11px] text-neutral-400">
                Tuỳ chỉnh cách nhìn, ngôn ngữ, chuông báo và quyền hạn thiết bị
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
              <span>Giao diện (Màu sắc)</span>
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
              <span>Ngôn ngữ (Tiếng nói)</span>
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
              <span>Âm báo (Chuông tin nhắn)</span>
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
              <span>Quyền & Hướng dẫn</span>
            </button>
          </div>

          {/* Right Panel Content */}
          <div className="flex-1 p-5 overflow-y-auto space-y-5 bg-[#14141c]">
            {/* 1. APPEARANCE TAB */}
            {activeTab === "appearance" && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div>
                  <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                    Chọn màu sắc hiển thị
                  </h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Đang chọn: <span className="text-[#ff7a00] font-semibold capitalize">{themeMode === "system" ? "Tự động theo máy" : themeMode === "dark" ? "Ban đêm" : "Ban ngày"}</span>
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
                    Ngôn ngữ trò chuyện & hiển thị
                  </h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Hệ thống có thể tự chọn theo vị trí máy của bạn hoặc bạn tự chọn ngôn ngữ thích hợp
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
                    Chuông báo khi đồng đội hoàn thành việc
                  </h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Bật tiếng chuông nhẹ nhàng để biết ngay khi bạn đồng đội AI trả lời xong
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
                            Nghe thử chuông
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
                    Quyền hạn thiết bị & Hướng dẫn bắt đầu
                  </h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Cho phép dùng micro để nói chuyện và xem lại các bước hướng dẫn
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
                        <div className="text-xs font-semibold text-white">Quyền Micro & Âm thanh</div>
                        <div className="text-[10px] text-neutral-400">Bật micro để nói chuyện trực tiếp</div>
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
                        <div className="text-xs font-semibold text-white">Tham quan 1 vòng ứng dụng</div>
                        <div className="text-[10px] text-neutral-400">Xem nhanh các góc làm việc chính</div>
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
                        <div className="text-xs font-semibold text-white">Mở lại bảng Checklist</div>
                        <div className="text-[10px] text-neutral-400">Xem lại các bước làm quen ban đầu</div>
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
                        <div className="text-xs font-semibold text-white">Cài app về máy tính / điện thoại</div>
                        <div className="text-[10px] text-neutral-400">Dùng như một ứng dụng độc lập</div>
                      </div>
                    </button>
                  )}
                </div>

                <div className="pt-2 border-t border-[#222230]">
                  <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                    Tải về nhật ký trò chuyện
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                    {onExportMarkdown && (
                      <button
                        type="button"
                        onClick={onExportMarkdown}
                        className="p-2.5 rounded-xl bg-[#181822] hover:bg-[#20202e] border border-[#262634] text-left transition-all cursor-pointer flex items-center gap-2 text-xs text-neutral-200"
                      >
                        <Download size={14} className="text-[#ff7a00] shrink-0" />
                        <span className="truncate">Tệp văn bản (.md)</span>
                      </button>
                    )}
                    {onExportJson && (
                      <button
                        type="button"
                        onClick={onExportJson}
                        className="p-2.5 rounded-xl bg-[#181822] hover:bg-[#20202e] border border-[#262634] text-left transition-all cursor-pointer flex items-center gap-2 text-xs text-neutral-200"
                      >
                        <FileText size={14} className="text-cyan-400 shrink-0" />
                        <span className="truncate">Dữ liệu gốc (.json)</span>
                      </button>
                    )}
                    {onExportCertificate && (
                      <button
                        type="button"
                        onClick={onExportCertificate}
                        className="p-2.5 rounded-xl bg-[#181822] hover:bg-[#20202e] border border-[#262634] text-left transition-all cursor-pointer flex items-center gap-2 text-xs text-neutral-200"
                      >
                        <Shield size={14} className="text-emerald-400 shrink-0" />
                        <span className="truncate">Chứng chỉ kiểm định (.html)</span>
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
          <span>Skyer Không Gian Đồng Đội AI</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-200 hover:text-white transition-colors cursor-pointer text-xs font-sans font-medium"
          >
            Đóng bảng
          </button>
        </div>
      </div>
    </div>
  );
}
