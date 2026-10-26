import React, { useState, useEffect } from "react";
import {
  X,
  Sparkles,
  RotateCcw,
  Check,
  Upload,
  Image as ImageIcon,
  Smile,
  Palette,
  Info,
} from "lucide-react";
import {
  AgentAvatar,
  AVATAR_ICON_MAP,
  AVATAR_COLOR_PRESETS,
  getAgentVisualProfile,
  BLOB_SHAPES,
  BLOB_EXPRESSIONS,
  BLOB_COLORS,
  BLOB_ANIMATIONS,
  getAgentBlobProfile,
} from "./AgentAvatar";
import { BlobAvatar } from "blob-avatar";
import {
  CustomAvatarConfig,
  getAgentAvatarConfig,
  saveAgentAvatarConfig,
  resetAgentAvatarConfig,
} from "../services/avatarService";

interface AgentAvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: {
    id: string;
    slug?: string;
    name: string;
    roleTag?: string;
  };
}

const COMMON_EMOJIS = [
  "🤖", "🧠", "⚡", "🚀", "🛡️", "🦉", "🔥", "✨",
  "💻", "🦾", "🛰️", "🛸", "👾", "🎯", "🧩", "🔬",
  "💎", "🔮", "🛠️", "⚙️", "🌐", "🦊", "🐯", "🦁",
  "🐉", "🦄", "🦅", "🐺", "🐼", "🐙", "🌸", "⭐",
];

export function AgentAvatarModal({ isOpen, onClose, agent }: AgentAvatarModalProps) {
  const [activeTab, setActiveTab] = useState<"blob" | "role" | "icon" | "emoji" | "image">("blob");

  const defaultBlob = getAgentBlobProfile(agent.id || agent.slug, agent.name, agent.roleTag);
  const [selectedBlobShape, setSelectedBlobShape] = useState<string>(defaultBlob.shape);
  const [selectedBlobExpression, setSelectedBlobExpression] = useState<string>(defaultBlob.expression);
  const [selectedBlobColor, setSelectedBlobColor] = useState<string>(defaultBlob.color);
  const [selectedBlobAnimation, setSelectedBlobAnimation] = useState<string>(defaultBlob.animation);
  const [isCustomBlob, setIsCustomBlob] = useState<boolean>(false);

  const [selectedIcon, setSelectedIcon] = useState<string>("Bot");
  const [selectedColor, setSelectedColor] = useState<string>("blue");
  const [selectedEmoji, setSelectedEmoji] = useState<string>("🤖");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [customEmojiInput, setCustomEmojiInput] = useState<string>("");

  useEffect(() => {
    if (!isOpen) return;
    const current = getAgentAvatarConfig(agent.id);
    if (current) {
      setActiveTab(current.type === "role" ? "blob" : current.type);
      if (current.type === "blob" && current.blob) {
        setIsCustomBlob(true);
        if (current.blob.shape) setSelectedBlobShape(current.blob.shape);
        if (current.blob.expression) setSelectedBlobExpression(current.blob.expression);
        if (current.blob.color) setSelectedBlobColor(current.blob.color);
        if (current.blob.animation) setSelectedBlobAnimation(current.blob.animation);
      } else {
        setIsCustomBlob(false);
        setSelectedBlobShape(defaultBlob.shape);
        setSelectedBlobExpression(defaultBlob.expression);
        setSelectedBlobColor(defaultBlob.color);
        setSelectedBlobAnimation(defaultBlob.animation);
      }
      if (current.iconName) setSelectedIcon(current.iconName);
      if (current.colorPreset) setSelectedColor(current.colorPreset);
      if (current.emoji) setSelectedEmoji(current.emoji);
      if (current.imageUrl) setImageUrl(current.imageUrl);
    } else {
      setActiveTab("blob");
      setIsCustomBlob(false);
      setSelectedBlobShape(defaultBlob.shape);
      setSelectedBlobExpression(defaultBlob.expression);
      setSelectedBlobColor(defaultBlob.color);
      setSelectedBlobAnimation(defaultBlob.animation);
      setSelectedIcon("Bot");
      setSelectedColor("blue");
      setSelectedEmoji("🤖");
      setImageUrl("");
    }
  }, [isOpen, agent.id]);

  if (!isOpen) return null;

  // Build temporary preview config
  const previewConfig: CustomAvatarConfig | null = (() => {
    if (activeTab === "blob" || activeTab === "role") {
      if (!isCustomBlob) return null;
      return {
        type: "blob",
        blob: {
          shape: selectedBlobShape,
          expression: selectedBlobExpression,
          color: selectedBlobColor,
          animation: selectedBlobAnimation,
          seed: defaultBlob.seed,
        },
      };
    }
    if (activeTab === "icon") {
      return { type: "icon", iconName: selectedIcon, colorPreset: selectedColor };
    }
    if (activeTab === "emoji") {
      return { type: "emoji", emoji: selectedEmoji, colorPreset: selectedColor };
    }
    if (activeTab === "image") {
      return { type: "image", imageUrl: imageUrl.trim() };
    }
    return null;
  })();

  const handleSave = () => {
    if ((activeTab === "blob" || activeTab === "role") && !isCustomBlob) {
      resetAgentAvatarConfig(agent.id);
    } else if (previewConfig) {
      saveAgentAvatarConfig(agent.id, previewConfig);
    }
    onClose();
  };

  const handleReset = () => {
    resetAgentAvatarConfig(agent.id);
    setActiveTab("blob");
    setIsCustomBlob(false);
    setSelectedBlobShape(defaultBlob.shape);
    setSelectedBlobExpression(defaultBlob.expression);
    setSelectedBlobColor(defaultBlob.color);
    setSelectedBlobAnimation(defaultBlob.animation);
    setImageUrl("");
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Vui lòng chọn ảnh dung lượng dưới 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64 = uploadEvent.target?.result as string;
      if (base64) {
        setImageUrl(base64);
        setActiveTab("image");
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl rounded-2xl bg-white dark:bg-[#14141e] border border-slate-200 dark:border-[#272738] shadow-2xl overflow-hidden flex flex-col font-sans"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-[#20202e]">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-[#f8a87c]/10 flex items-center justify-center text-[#f8a87c]">
              <Sparkles size={16} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Cài đặt Avatar cho {agent.name}
              </h2>
              <p className="text-[11px] font-mono text-neutral-500">
                Tuỳ biến biểu tượng nhận diện trên toàn bộ giao diện workspace
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#20202e] transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Live Preview Box */}
        <div className="p-6 bg-slate-50 dark:bg-[#101018] border-b border-slate-100 dark:border-[#20202e] flex flex-col items-center justify-center text-center">
          <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-3">
            Xem trước giao diện
          </div>
          <div className="relative group">
            <AgentAvatar
              agent={agent}
              size="xl"
              className="shadow-xl"
              overrideConfig={previewConfig}
              alwaysAnimate={true}
            />
            <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-[#101018] shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          </div>
          <div className="mt-3">
            <span className="text-sm font-semibold text-neutral-900 dark:text-white">
              {agent.name}
            </span>
            <span className="ml-2 text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              {agent.roleTag || "Autonomous Agent"}
            </span>
          </div>
        </div>

        {/* Style Selector Tabs */}
        <div className="flex border-b border-slate-100 dark:border-[#20202e] px-6 bg-white dark:bg-[#14141e]">
          <button
            onClick={() => setActiveTab("blob")}
            className={`py-3 px-3.5 text-xs font-medium border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              (activeTab === "blob" || activeTab === "role")
                ? "border-[#f8a87c] text-[#f8a87c]"
                : "border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            <Sparkles size={13} />
            <span>Blob Mascot (Mặc định)</span>
          </button>
          <button
            onClick={() => setActiveTab("icon")}
            className={`py-3 px-3.5 text-xs font-medium border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "icon"
                ? "border-[#f8a87c] text-[#f8a87c]"
                : "border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            <Palette size={13} />
            <span>Icon & Màu sắc</span>
          </button>
          <button
            onClick={() => setActiveTab("emoji")}
            className={`py-3 px-3.5 text-xs font-medium border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "emoji"
                ? "border-[#f8a87c] text-[#f8a87c]"
                : "border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            <Smile size={13} />
            <span>Emoji Mascots</span>
          </button>
          <button
            onClick={() => setActiveTab("image")}
            className={`py-3 px-3.5 text-xs font-medium border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "image"
                ? "border-[#f8a87c] text-[#f8a87c]"
                : "border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            <ImageIcon size={13} />
            <span>Ảnh / URL</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto max-h-[340px] space-y-5">
          {/* TAB 1: Blob Mascot Studio */}
          {(activeTab === "blob" || activeTab === "role") && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#181824] border border-slate-200 dark:border-[#272738] flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Info size={16} className="text-[#f8a87c] shrink-0" />
                  <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-snug truncate">
                    {isCustomBlob
                      ? "Đang áp dụng cấu hình Blob Mascot thủ công cho agent này."
                      : "Đang áp dụng thuật toán phân phối Blob Mascot tự động theo ID."}
                  </p>
                </div>
                {isCustomBlob && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomBlob(false);
                      setSelectedBlobShape(defaultBlob.shape);
                      setSelectedBlobExpression(defaultBlob.expression);
                      setSelectedBlobColor(defaultBlob.color);
                      setSelectedBlobAnimation(defaultBlob.animation);
                    }}
                    className="text-[11px] font-mono text-[#f8a87c] hover:underline shrink-0 font-medium cursor-pointer"
                  >
                    Về ngẫu nhiên
                  </button>
                )}
              </div>

              {/* Color Palette */}
              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 block mb-2 font-semibold">
                  Màu sắc Blob (Body Color)
                </label>
                <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
                  {BLOB_COLORS.map((c) => {
                    const isSelected = (isCustomBlob ? selectedBlobColor : defaultBlob.color) === c;
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => {
                          setIsCustomBlob(true);
                          setSelectedBlobColor(c);
                        }}
                        style={{ backgroundColor: c }}
                        className={`h-7 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
                          isSelected
                            ? "border-white dark:border-black ring-2 ring-[#f8a87c] scale-110 shadow-sm"
                            : "border-black/10 hover:scale-105 opacity-85 hover:opacity-100"
                        }`}
                        title={c}
                      >
                        {isSelected && <Check size={12} className="text-white drop-shadow" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Shape Selection */}
              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 block mb-2 font-semibold">
                  Hình dạng hình học & sinh vật (Shape)
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {BLOB_SHAPES.map((sh) => {
                    const isSelected = (isCustomBlob ? selectedBlobShape : defaultBlob.shape) === sh;
                    return (
                      <button
                        key={sh}
                        type="button"
                        onClick={() => {
                          setIsCustomBlob(true);
                          setSelectedBlobShape(sh);
                        }}
                        className={`px-2 py-1.5 rounded-lg border text-xs capitalize transition-all cursor-pointer truncate ${
                          isSelected
                            ? "border-[#f8a87c] bg-[#f8a87c]/15 text-[#f8a87c] font-semibold"
                            : "border-slate-200 dark:border-[#272738] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1f1f2e]"
                        }`}
                      >
                        {sh}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Expression Selection */}
              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 block mb-2 font-semibold">
                  Biểu cảm khuôn mặt (Expression)
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                  {BLOB_EXPRESSIONS.map((expr) => {
                    const isSelected = (isCustomBlob ? selectedBlobExpression : defaultBlob.expression) === expr;
                    return (
                      <button
                        key={expr}
                        type="button"
                        onClick={() => {
                          setIsCustomBlob(true);
                          setSelectedBlobExpression(expr);
                        }}
                        className={`px-2 py-1.5 rounded-lg border text-xs capitalize transition-all cursor-pointer truncate ${
                          isSelected
                            ? "border-[#f8a87c] bg-[#f8a87c]/15 text-[#f8a87c] font-semibold"
                            : "border-slate-200 dark:border-[#272738] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1f1f2e]"
                        }`}
                      >
                        {expr}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Animation Cycle */}
              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 block mb-2 font-semibold">
                  Hoạt cảnh chuyển động (Animation Cycle)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {BLOB_ANIMATIONS.map((anim, idx) => {
                    const isSelected = (isCustomBlob ? selectedBlobAnimation : defaultBlob.animation) === anim;
                    const cleanName = anim.replace(/idle\.2\.4,/g, "").split(".")[0];
                    return (
                      <button
                        key={anim}
                        type="button"
                        onClick={() => {
                          setIsCustomBlob(true);
                          setSelectedBlobAnimation(anim);
                        }}
                        className={`px-2 py-1.5 rounded-lg border text-xs capitalize transition-all cursor-pointer truncate flex items-center justify-between ${
                          isSelected
                            ? "border-[#f8a87c] bg-[#f8a87c]/15 text-[#f8a87c] font-semibold"
                            : "border-slate-200 dark:border-[#272738] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1f1f2e]"
                        }`}
                      >
                        <span>{cleanName}</span>
                        <span className="text-[9px] font-mono opacity-60">#{idx + 1}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Icon & Theme */}
          {activeTab === "icon" && (
            <div className="space-y-4">
              {/* Palette Choice */}
              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 block mb-2 font-semibold">
                  Bộ màu (Theme Palette)
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {Object.entries(AVATAR_COLOR_PRESETS).map(([key, preset]) => {
                    const isSelected = selectedColor === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setSelectedColor(key)}
                        type="button"
                        className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                          isSelected
                            ? "border-[#f8a87c] bg-[#f8a87c]/10 shadow-xs"
                            : "border-slate-200 dark:border-[#272738] hover:border-slate-300 dark:hover:border-neutral-600"
                        }`}
                      >
                        <div
                          className={`h-5 w-5 rounded-lg border ${preset.lightBg} ${preset.darkBg} flex items-center justify-center`}
                        >
                          {isSelected && <Check size={11} className="text-white drop-shadow" />}
                        </div>
                        <span className="text-[10px] font-mono text-neutral-600 dark:text-neutral-400 truncate w-full text-center">
                          {preset.name.split(" ")[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Icon Grid */}
              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 block mb-2 font-semibold">
                  Biểu tượng kỹ thuật (Icons)
                </label>
                <div className="grid grid-cols-6 sm:grid-cols-10 gap-2 max-h-48 overflow-y-auto pr-1">
                  {Object.entries(AVATAR_ICON_MAP).map(([name, IconComponent]) => {
                    const isSelected = selectedIcon === name;
                    return (
                      <button
                        key={name}
                        onClick={() => setSelectedIcon(name)}
                        type="button"
                        title={name}
                        className={`h-9 w-9 rounded-xl flex items-center justify-center border transition-all cursor-pointer ${
                          isSelected
                            ? "border-[#f8a87c] bg-[#f8a87c]/15 text-[#f8a87c] scale-105 shadow-sm"
                            : "border-slate-200 dark:border-[#272738] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1f1f2e]"
                        }`}
                      >
                        <IconComponent size={16} />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Emoji Mascots */}
          {activeTab === "emoji" && (
            <div className="space-y-4">
              {/* Palette Choice for Emoji Background */}
              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 block mb-2 font-semibold">
                  Bộ màu nền cho Emoji
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {Object.entries(AVATAR_COLOR_PRESETS).map(([key, preset]) => {
                    const isSelected = selectedColor === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setSelectedColor(key)}
                        type="button"
                        className={`p-1.5 rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          isSelected
                            ? "border-[#f8a87c] bg-[#f8a87c]/10"
                            : "border-slate-200 dark:border-[#272738] hover:border-slate-300"
                        }`}
                      >
                        <div className={`h-4 w-4 rounded-md border ${preset.lightBg} ${preset.darkBg}`} />
                        <span className="text-[10px] font-mono text-neutral-600 dark:text-neutral-400">
                          {key}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Emoji Grid */}
              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 block mb-2 font-semibold">
                  Chọn Mascot Emoji
                </label>
                <div className="grid grid-cols-8 gap-2">
                  {COMMON_EMOJIS.map((em) => {
                    const isSelected = selectedEmoji === em;
                    return (
                      <button
                        key={em}
                        onClick={() => setSelectedEmoji(em)}
                        type="button"
                        className={`h-10 rounded-xl flex items-center justify-center text-lg border transition-all cursor-pointer ${
                          isSelected
                            ? "border-[#f8a87c] bg-[#f8a87c]/15 scale-110 shadow-sm"
                            : "border-slate-200 dark:border-[#272738] hover:bg-slate-100 dark:hover:bg-[#1f1f2e]"
                        }`}
                      >
                        {em}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Emoji Input */}
              <div className="pt-2">
                <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 block mb-1.5 font-semibold">
                  Hoặc nhập Emoji bất kỳ:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={2}
                    value={customEmojiInput}
                    onChange={(e) => setCustomEmojiInput(e.target.value)}
                    placeholder="VD: 🦊"
                    className="w-24 text-center px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#1a1a26] border border-slate-200 dark:border-[#2d2d3e] text-base focus:border-[#f8a87c] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customEmojiInput.trim()) {
                        setSelectedEmoji(customEmojiInput.trim());
                      }
                    }}
                    className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-[#202030] hover:bg-slate-300 dark:hover:bg-[#2a2a3e] text-xs font-medium cursor-pointer transition-colors"
                  >
                    Áp dụng
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Image Upload / URL */}
          {activeTab === "image" && (
            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 block mb-1.5 font-semibold">
                  Đường dẫn ảnh (URL Image)
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/avatar.png"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#181824] border border-slate-200 dark:border-[#2d2d3e] text-xs focus:border-[#f8a87c] focus:outline-none font-mono"
                />
              </div>

              <div className="relative flex items-center justify-center my-2">
                <div className="border-t border-slate-200 dark:border-[#242434] w-full" />
                <span className="bg-white dark:bg-[#14141e] px-2 text-[10px] font-mono text-neutral-400 absolute uppercase">
                  hoặc tải từ máy tính
                </span>
              </div>

              <div>
                <label className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-slate-200 dark:border-[#28283a] hover:border-[#f8a87c]/50 transition-colors cursor-pointer bg-slate-50 dark:bg-[#12121a]">
                  <Upload size={22} className="text-neutral-400 mb-2" />
                  <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                    Chọn tệp ảnh (PNG, JPG, SVG, WebP)
                  </span>
                  <span className="text-[10px] text-neutral-500 mt-0.5">Tối đa 2MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-[#20202e] bg-slate-50 dark:bg-[#12121a]">
          <button
            onClick={handleReset}
            type="button"
            className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 font-mono transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Khôi phục mặc định</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              type="button"
              className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:bg-slate-200 dark:hover:bg-[#20202e] transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              type="button"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#f8a87c] hover:bg-[#f5935f] text-black shadow-[0_0_12px_rgba(248,168,124,0.3)] transition-all cursor-pointer active:scale-95"
            >
              Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
