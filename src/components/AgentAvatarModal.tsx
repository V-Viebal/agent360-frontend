import React, { useState, useEffect } from "react";
import {
  X,
  Sparkles,
  RotateCcw,
  Check,
  Upload,
} from "lucide-react";
import {
  AgentAvatar,
  BLOB_SHAPES,
  BLOB_EXPRESSIONS,
  BLOB_COLORS,
  BLOB_ANIMATIONS,
  getAgentBlobProfile,
  getAgentColorTheme,
} from "./AgentAvatar";
import {
  CustomAvatarConfig,
  getAgentAvatarConfig,
  saveAgentAvatarConfig,
  resetAgentAvatarConfig,
  saveCustomAgentName,
  uploadAgentAvatarImage,
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

export function AgentAvatarModal({ isOpen, onClose, agent }: AgentAvatarModalProps) {
  const defaultBlob = getAgentBlobProfile(agent.id || agent.slug, agent.name, agent.roleTag);
  const [selectedBlobShape, setSelectedBlobShape] = useState<string>(defaultBlob.shape);
  const [selectedBlobExpression, setSelectedBlobExpression] = useState<string>(defaultBlob.expression);
  const [selectedBlobColor, setSelectedBlobColor] = useState<string>(defaultBlob.color);
  const [selectedBlobAnimation, setSelectedBlobAnimation] = useState<string>(defaultBlob.animation);
  const [isCustomBlob, setIsCustomBlob] = useState<boolean>(false);
  const [customImageUrl, setCustomImageUrl] = useState<string>("");
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
  const [editedName, setEditedName] = useState<string>(agent.name || "");

  useEffect(() => {
    if (!isOpen) return;
    setEditedName(agent.name || "");
    const current = getAgentAvatarConfig(agent.id) || getAgentAvatarConfig(agent.slug);
    if (current) {
      if (current.type === "image" && current.imageUrl) {
        setCustomImageUrl(current.imageUrl);
      } else {
        setCustomImageUrl("");
      }

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
    } else {
      setIsCustomBlob(false);
      setSelectedBlobShape(defaultBlob.shape);
      setSelectedBlobExpression(defaultBlob.expression);
      setSelectedBlobColor(defaultBlob.color);
      setSelectedBlobAnimation(defaultBlob.animation);
      setCustomImageUrl("");
    }
  }, [isOpen, agent.id]);

  if (!isOpen) return null;

  const currentTheme = getAgentColorTheme(
    agent.id,
    agent.name,
    agent.roleTag
  );
  // Dynamic theme based on currently picked color in preview
  const activeColorKey = customImageUrl ? currentTheme.primary : (isCustomBlob ? selectedBlobColor : defaultBlob.color);

  // Build temporary preview config
  const previewConfig: CustomAvatarConfig | null = (() => {
    if (customImageUrl) {
      return { type: "image", imageUrl: customImageUrl };
    }
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
  })();

  const handleSave = () => {
    const targetKey = agent.slug || agent.id;
    const trimmed = editedName.trim();
    if (trimmed && trimmed !== agent.name) {
      saveCustomAgentName(targetKey, trimmed);
      if (agent.id && agent.id !== targetKey) saveCustomAgentName(agent.id, trimmed);
    }
    if (customImageUrl) {
      saveAgentAvatarConfig(targetKey, { type: "image", imageUrl: customImageUrl });
      if (agent.id && agent.id !== targetKey) saveAgentAvatarConfig(agent.id, { type: "image", imageUrl: customImageUrl });
    } else if (!isCustomBlob) {
      resetAgentAvatarConfig(targetKey);
      if (agent.id && agent.id !== targetKey) resetAgentAvatarConfig(agent.id);
    } else if (previewConfig) {
      saveAgentAvatarConfig(targetKey, previewConfig);
      if (agent.id && agent.id !== targetKey) saveAgentAvatarConfig(agent.id, previewConfig);
    }
    onClose();
  };

  const handleReset = () => {
    const targetKey = agent.slug || agent.id;
    resetAgentAvatarConfig(targetKey);
    if (agent.id && agent.id !== targetKey) resetAgentAvatarConfig(agent.id);
    saveCustomAgentName(targetKey, "");
    if (agent.id && agent.id !== targetKey) saveCustomAgentName(agent.id, "");
    setEditedName(agent.name || "");
    setIsCustomBlob(false);
    setSelectedBlobShape(defaultBlob.shape);
    setSelectedBlobExpression(defaultBlob.expression);
    setSelectedBlobColor(defaultBlob.color);
    setSelectedBlobAnimation(defaultBlob.animation);
    setCustomImageUrl("");
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("Vui lòng chọn ảnh dung lượng dưới 10MB.");
      return;
    }

    // Instant local preview via Object URL
    const localPreview = URL.createObjectURL(file);
    setCustomImageUrl(localPreview);
    setIsCustomBlob(false);
    setIsUploadingImage(true);

    try {
      const serverUrl = await uploadAgentAvatarImage(file);
      setCustomImageUrl(serverUrl);
    } catch (err) {
      console.warn("[AgentAvatarModal] Direct media upload failed, falling back to base64:", err);
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const base64 = uploadEvent.target?.result as string;
        if (base64) {
          setCustomImageUrl(base64);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploadingImage(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#14141e] border border-slate-200 dark:border-[#272738] shadow-2xl overflow-hidden flex flex-col font-sans select-none"
      >
        {/* Header: Lean & Clean */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-[#20202e]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              style={{ backgroundColor: `${activeColorKey}25`, color: activeColorKey }}
              className="h-7 w-7 rounded-xl flex items-center justify-center shrink-0"
            >
              <Sparkles size={14} />
            </div>
            <div className="min-w-0">
              <h2 className="text-xs font-semibold text-neutral-900 dark:text-white truncate">
                Chỉnh sửa Hồ sơ & Avatar · {editedName.trim() || agent.name}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#20202e] transition-colors cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Live Preview Box */}
        <div className="p-5 bg-slate-50/70 dark:bg-[#101018] border-b border-slate-100 dark:border-[#20202e] flex flex-col items-center justify-center text-center">
          <div className="relative mb-2 group">
            <AgentAvatar
              agent={agent}
              size="xl"
              className="shadow-xl"
              overrideConfig={previewConfig}
              alwaysAnimate={true}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-neutral-900 dark:text-white">
              {editedName.trim() || agent.name}
            </span>
            <span
              style={{
                backgroundColor: `${activeColorKey}20`,
                color: activeColorKey,
                borderColor: `${activeColorKey}40`,
              }}
              className="text-[10px] font-mono px-2 py-0.5 rounded-full border font-semibold"
            >
              {agent.roleTag || "Agent"}
            </span>
          </div>
        </div>

        {/* Studio Controls: Lean, direct & focused */}
        <div className="p-5 overflow-y-auto max-h-[380px] space-y-4">
          {/* 0. Tên hiển thị Agent */}
          <div>
            <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 block mb-1.5 font-semibold">
              Tên Agent (Agent Name)
            </label>
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSave();
                }
              }}
              placeholder="Nhập tên hiển thị của Agent..."
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-[#101018] border border-slate-200 dark:border-[#272738] text-slate-900 dark:text-white focus:outline-none focus:border-[var(--agent-primary)] font-medium transition-colors"
            />
          </div>

          {/* 1. Body Color Palette (The single primary color of this agent) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-semibold">
                Màu sắc Agent (Primary Color)
              </label>
              {isCustomBlob && (
                <button
                  type="button"
                  onClick={() => {
                    setIsCustomBlob(false);
                    setSelectedBlobShape(defaultBlob.shape);
                    setSelectedBlobExpression(defaultBlob.expression);
                    setSelectedBlobColor(defaultBlob.color);
                    setSelectedBlobAnimation(defaultBlob.animation);
                    setCustomImageUrl("");
                  }}
                  style={{ color: activeColorKey }}
                  className="text-[10px] font-mono hover:underline cursor-pointer"
                >
                  Mặc định
                </button>
              )}
            </div>
            <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
              {BLOB_COLORS.map((c) => {
                const isSelected = !customImageUrl && (isCustomBlob ? selectedBlobColor : defaultBlob.color) === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setCustomImageUrl("");
                      setIsCustomBlob(true);
                      setSelectedBlobColor(c);
                    }}
                    style={{ backgroundColor: c }}
                    className={`h-7 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
                      isSelected
                        ? "border-white dark:border-black ring-2 ring-neutral-900 dark:ring-white scale-110 shadow-sm"
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

          {/* 2. Shape Selection */}
          <div>
            <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 block mb-2 font-semibold">
              Hình dáng (Shape)
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 max-h-32 overflow-y-auto pr-1 scrollbar-hover">
              {BLOB_SHAPES.map((sh) => {
                const isSelected = !customImageUrl && (isCustomBlob ? selectedBlobShape : defaultBlob.shape) === sh;
                return (
                  <button
                    key={sh}
                    type="button"
                    onClick={() => {
                      setCustomImageUrl("");
                      setIsCustomBlob(true);
                      setSelectedBlobShape(sh);
                    }}
                    style={
                      isSelected
                        ? {
                            borderColor: activeColorKey,
                            backgroundColor: `${activeColorKey}20`,
                            color: activeColorKey,
                          }
                        : undefined
                    }
                    className={`px-2 py-1.5 rounded-lg border text-xs capitalize transition-all cursor-pointer truncate ${
                      isSelected
                        ? "font-semibold shadow-xs"
                        : "border-slate-200 dark:border-[#272738] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1f1f2e]"
                    }`}
                  >
                    {sh}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Expression Selection */}
          <div>
            <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 block mb-2 font-semibold">
              Biểu cảm (Expression)
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
              {BLOB_EXPRESSIONS.map((expr) => {
                const isSelected = !customImageUrl && (isCustomBlob ? selectedBlobExpression : defaultBlob.expression) === expr;
                return (
                  <button
                    key={expr}
                    type="button"
                    onClick={() => {
                      setCustomImageUrl("");
                      setIsCustomBlob(true);
                      setSelectedBlobExpression(expr);
                    }}
                    style={
                      isSelected
                        ? {
                            borderColor: activeColorKey,
                            backgroundColor: `${activeColorKey}20`,
                            color: activeColorKey,
                          }
                        : undefined
                    }
                    className={`px-2 py-1.5 rounded-lg border text-xs capitalize transition-all cursor-pointer truncate ${
                      isSelected
                        ? "font-semibold shadow-xs"
                        : "border-slate-200 dark:border-[#272738] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1f1f2e]"
                    }`}
                  >
                    {expr}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Animation Cycle */}
          <div>
            <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 block mb-2 font-semibold">
              Chuyển động (Animation)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {BLOB_ANIMATIONS.map((anim, idx) => {
                const isSelected = !customImageUrl && (isCustomBlob ? selectedBlobAnimation : defaultBlob.animation) === anim;
                const cleanName = anim.replace(/idle\.2\.4,/g, "").split(".")[0];
                return (
                  <button
                    key={anim}
                    type="button"
                    onClick={() => {
                      setCustomImageUrl("");
                      setIsCustomBlob(true);
                      setSelectedBlobAnimation(anim);
                    }}
                    style={
                      isSelected
                        ? {
                            borderColor: activeColorKey,
                            backgroundColor: `${activeColorKey}20`,
                            color: activeColorKey,
                          }
                        : undefined
                    }
                    className={`px-2 py-1.5 rounded-lg border text-xs capitalize transition-all cursor-pointer truncate flex items-center justify-between ${
                      isSelected
                        ? "font-semibold shadow-xs"
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

          {/* 5. Custom Photo Upload (Minimalist) */}
          <div className="pt-1 border-t border-slate-100 dark:border-[#222230]">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-semibold">
                Tải ảnh riêng (Tùy chọn)
              </label>
              {customImageUrl && (
                <button
                  type="button"
                  onClick={() => setCustomImageUrl("")}
                  className="text-[10px] text-red-500 hover:underline cursor-pointer"
                >
                  Gỡ ảnh
                </button>
              )}
            </div>
            <label className="mt-1.5 flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-slate-300 dark:border-[#28283a] hover:border-slate-400 cursor-pointer bg-slate-50 dark:bg-[#12121a] text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
              <Upload size={14} />
              <span>{isUploadingImage ? "Đang tải ảnh lên máy chủ..." : customImageUrl ? "Đã tải ảnh lên (Bấm để đổi ảnh khác)" : "Tải ảnh đại diện từ máy (PNG, JPG, SVG)"}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 dark:border-[#20202e] bg-slate-50/70 dark:bg-[#12121a]">
          <button
            onClick={handleReset}
            type="button"
            className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 font-mono transition-colors cursor-pointer"
          >
            <RotateCcw size={12} />
            <span>Mặc định</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              type="button"
              className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:bg-slate-200 dark:hover:bg-[#20202e] transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              type="button"
              disabled={isUploadingImage}
              style={{ backgroundColor: activeColorKey, color: "#ffffff" }}
              className="px-4 py-1.5 rounded-xl text-xs font-semibold hover:opacity-90 transition-all cursor-pointer active:scale-95 shadow-sm"
            >
              Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
