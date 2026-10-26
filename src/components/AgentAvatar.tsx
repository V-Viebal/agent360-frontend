import React, { useState, useEffect, useRef } from "react";
import {
  Code,
  Terminal,
  Activity,
  Eye,
  BookOpen,
  Send,
  Database,
  Globe,
  Radio,
  Cpu,
  Bot,
  Shield,
  Layers,
  Sparkles,
  Zap,
  Flame,
  Rocket,
  Compass,
  Fingerprint,
  Box,
  Brain,
  ShieldCheck,
  Server,
  Cloud,
  Headphones,
  Laptop,
  Gauge,
  Workflow,
  Wrench,
  Search,
} from "lucide-react";
import { getAgentAvatarConfig, CustomAvatarConfig } from "../services/avatarService";
import { BlobAvatar } from "blob-avatar";

export const BLOB_SHAPES = [
  "circle", "pebble", "squircle", "capsule", "triangle", "diamond", "hexagon",
  "star", "cloud", "droplet", "heart", "ghost", "cat", "bear", "bunny",
  "amoeba", "flower", "clover", "leaf", "gem", "bubble",
] as const;

export const BLOB_EXPRESSIONS = [
  "happy", "laughing", "wink", "content", "dreamy", "proud", "smug",
  "excited", "attentive", "focused", "curious", "neutral", "shy",
] as const;

export const BLOB_COLORS = [
  "#f8a87c", // Skyer Orange
  "#38bdf8", // Sky Blue
  "#34d399", // Emerald Mint
  "#a78bfa", // Lavender Violet
  "#fb7185", // Rose Pink
  "#fbbf24", // Amber Gold
  "#2dd4bf", // Teal
  "#a3e635", // Lime Green
  "#f472b6", // Hot Pink
  "#60a5fa", // Royal Blue
  "#c084fc", // Purple
  "#4ade80", // Fresh Green
] as const;

export const BLOB_ANIMATIONS = [
  "wink.1.6,nod.1.4,idle.1.2",
  "nod.1.4,jump.1.4,idle.1.2",
  "jump.1.5,wink.1.4,idle.1.2",
  "shake.1.4,nod.1.4,idle.1.2",
  "spin.1.6,wink.1.4,idle.1.2",
  "party.1.8,nod.1.4,idle.1.2",
  "play.1.8,wink.1.4,idle.1.2",
] as const;

export function getAgentBlobProfile(agentId: string = "", name: string = "", roleTag: string = "") {
  const seedStr = `${agentId || ""}-${name || ""}-${roleTag || ""}`.toLowerCase();
  let h = 0;
  for (let i = 0; i < seedStr.length; i++) {
    h = ((h << 5) - h) + seedStr.charCodeAt(i);
    h |= 0;
  }
  const pos = Math.abs(h);
  return {
    shape: BLOB_SHAPES[pos % BLOB_SHAPES.length],
    expression: BLOB_EXPRESSIONS[(pos >> 3) % BLOB_EXPRESSIONS.length],
    color: BLOB_COLORS[(pos >> 6) % BLOB_COLORS.length],
    animation: BLOB_ANIMATIONS[(pos >> 9) % BLOB_ANIMATIONS.length],
    seed: (pos % 999) + 1,
  };
}


export const BLOB_COLOR_THEMES: Record<
  string,
  {
    light: string;
    dark: string;
    bgLight: string;
    bgDark: string;
    borderLight: string;
    borderDark: string;
  }
> = {
  "#f8a87c": { light: "#b44808", dark: "#f8a87c", bgLight: "rgba(248,168,124,0.15)", bgDark: "rgba(248,168,124,0.20)", borderLight: "rgba(248,168,124,0.40)", borderDark: "rgba(248,168,124,0.30)" },
  "#38bdf8": { light: "#0369a1", dark: "#38bdf8", bgLight: "rgba(56,189,248,0.15)", bgDark: "rgba(56,189,248,0.20)", borderLight: "rgba(56,189,248,0.40)", borderDark: "rgba(56,189,248,0.30)" },
  "#34d399": { light: "#047857", dark: "#34d399", bgLight: "rgba(52,211,153,0.15)", bgDark: "rgba(52,211,153,0.20)", borderLight: "rgba(52,211,153,0.40)", borderDark: "rgba(52,211,153,0.30)" },
  "#a78bfa": { light: "#6d28d9", dark: "#a78bfa", bgLight: "rgba(167,139,250,0.15)", bgDark: "rgba(167,139,250,0.20)", borderLight: "rgba(167,139,250,0.40)", borderDark: "rgba(167,139,250,0.30)" },
  "#fb7185": { light: "#be123c", dark: "#fb7185", bgLight: "rgba(251,113,133,0.15)", bgDark: "rgba(251,113,133,0.20)", borderLight: "rgba(251,113,133,0.40)", borderDark: "rgba(251,113,133,0.30)" },
  "#fbbf24": { light: "#b45309", dark: "#fbbf24", bgLight: "rgba(251,191,36,0.15)", bgDark: "rgba(251,191,36,0.20)", borderLight: "rgba(251,191,36,0.40)", borderDark: "rgba(251,191,36,0.30)" },
  "#2dd4bf": { light: "#0f766e", dark: "#2dd4bf", bgLight: "rgba(45,212,191,0.15)", bgDark: "rgba(45,212,191,0.20)", borderLight: "rgba(45,212,191,0.40)", borderDark: "rgba(45,212,191,0.30)" },
  "#a3e635": { light: "#4d7c0f", dark: "#a3e635", bgLight: "rgba(163,230,53,0.15)", bgDark: "rgba(163,230,53,0.20)", borderLight: "rgba(163,230,53,0.40)", borderDark: "rgba(163,230,53,0.30)" },
  "#f472b6": { light: "#be185d", dark: "#f472b6", bgLight: "rgba(244,114,182,0.15)", bgDark: "rgba(244,114,182,0.20)", borderLight: "rgba(244,114,182,0.40)", borderDark: "rgba(244,114,182,0.30)" },
  "#60a5fa": { light: "#1d4ed8", dark: "#60a5fa", bgLight: "rgba(96,165,250,0.15)", bgDark: "rgba(96,165,250,0.20)", borderLight: "rgba(96,165,250,0.40)", borderDark: "rgba(96,165,250,0.30)" },
  "#c084fc": { light: "#7e22ce", dark: "#c084fc", bgLight: "rgba(192,132,252,0.15)", bgDark: "rgba(192,132,252,0.20)", borderLight: "rgba(192,132,252,0.40)", borderDark: "rgba(192,132,252,0.30)" },
  "#4ade80": { light: "#15803d", dark: "#4ade80", bgLight: "rgba(74,222,128,0.15)", bgDark: "rgba(74,222,128,0.20)", borderLight: "rgba(74,222,128,0.40)", borderDark: "rgba(74,222,128,0.30)" },
};

export function getAgentColorTheme(agentId: string = "", name: string = "", roleTag: string = "") {
  const cfg = getAgentAvatarConfig(agentId);
  if (cfg?.blob?.color && BLOB_COLOR_THEMES[cfg.blob.color]) {
    return BLOB_COLOR_THEMES[cfg.blob.color];
  }
  const defaultBlob = getAgentBlobProfile(agentId, name, roleTag);
  return BLOB_COLOR_THEMES[defaultBlob.color] || BLOB_COLOR_THEMES["#f8a87c"];
}


export const AVATAR_ICON_MAP: Record<string, React.ElementType> = {
  Code,
  Terminal,
  Activity,
  Eye,
  BookOpen,
  Send,
  Database,
  Globe,
  Radio,
  Cpu,
  Bot,
  Shield,
  Layers,
  Sparkles,
  Zap,
  Flame,
  Rocket,
  Compass,
  Fingerprint,
  Box,
  Brain,
  ShieldCheck,
  Server,
  Cloud,
  Headphones,
  Laptop,
  Gauge,
  Workflow,
  Wrench,
  Search,
};

export const AVATAR_COLOR_PRESETS: Record<
  string,
  {
    name: string;
    lightBg: string;
    lightIconColor: string;
    darkBg: string;
    darkIconColor: string;
  }
> = {
  peach: {
    name: "Pastel Peach",
    lightBg: "bg-[#FFF5EE] hover:bg-[#FFE8DC] border-[#FED7AA] hover:border-[#FDBA74] shadow-amber-500/5",
    lightIconColor: "text-[#EA580C]",
    darkBg: "dark:bg-gradient-to-tr dark:from-[#38261F] dark:via-[#2A1E1A] dark:to-[#1E1715] dark:border-[#F8A87C]/30 dark:hover:border-[#F8A87C]/50",
    darkIconColor: "dark:text-[#FDBA74]",
  },
  mint: {
    name: "Pastel Mint",
    lightBg: "bg-[#F0FDF4] hover:bg-[#DCFCE7] border-[#BBF7D0] hover:border-[#86EFAC] shadow-emerald-500/5",
    lightIconColor: "text-[#16A34A]",
    darkBg: "dark:bg-gradient-to-tr dark:from-[#173326] dark:via-[#13281E] dark:to-[#0F1E17] dark:border-[#86EFAC]/30 dark:hover:border-[#86EFAC]/50",
    darkIconColor: "dark:text-[#86EFAC]",
  },
  sky: {
    name: "Pastel Sky",
    lightBg: "bg-[#F0F9FF] hover:bg-[#E0F2FE] border-[#BAE6FD] hover:border-[#7DD3FC] shadow-sky-500/5",
    lightIconColor: "text-[#0284C7]",
    darkBg: "dark:bg-gradient-to-tr dark:from-[#14293D] dark:via-[#102030] dark:to-[#0C1824] dark:border-[#7DD3FC]/30 dark:hover:border-[#7DD3FC]/50",
    darkIconColor: "dark:text-[#7DD3FC]",
  },
  lavender: {
    name: "Pastel Lavender",
    lightBg: "bg-[#F5F3FF] hover:bg-[#EDE9FE] border-[#DDD6FE] hover:border-[#C4B5FD] shadow-indigo-500/5",
    lightIconColor: "text-[#7C3AED]",
    darkBg: "dark:bg-gradient-to-tr dark:from-[#271E3D] dark:via-[#1F1830] dark:to-[#171224] dark:border-[#C4B5FD]/30 dark:hover:border-[#C4B5FD]/50",
    darkIconColor: "dark:text-[#C4B5FD]",
  },
  rose: {
    name: "Pastel Rose",
    lightBg: "bg-[#FFF1F2] hover:bg-[#FFE4E6] border-[#FECDD3] hover:border-[#FDA4AF] shadow-rose-500/5",
    lightIconColor: "text-[#E11D48]",
    darkBg: "dark:bg-gradient-to-tr dark:from-[#3A1B24] dark:via-[#2D161D] dark:to-[#211116] dark:border-[#FDA4AF]/30 dark:hover:border-[#FDA4AF]/50",
    darkIconColor: "dark:text-[#FDA4AF]",
  },
  apricot: {
    name: "Pastel Apricot",
    lightBg: "bg-[#FEFCE8] hover:bg-[#FEF9C3] border-[#FEF08A] hover:border-[#FDE047] shadow-yellow-500/5",
    lightIconColor: "text-[#CA8A04]",
    darkBg: "dark:bg-gradient-to-tr dark:from-[#352D18] dark:via-[#292314] dark:to-[#1E1A0F] dark:border-[#FDE047]/30 dark:hover:border-[#FDE047]/50",
    darkIconColor: "dark:text-[#FDE047]",
  },
  sage: {
    name: "Pastel Sage",
    lightBg: "bg-[#F7FEE7] hover:bg-[#ECFCCB] border-[#D9F99D] hover:border-[#BEF264] shadow-lime-500/5",
    lightIconColor: "text-[#65A30D]",
    darkBg: "dark:bg-gradient-to-tr dark:from-[#233314] dark:via-[#1C2810] dark:to-[#151E0D] dark:border-[#BEF264]/30 dark:hover:border-[#BEF264]/50",
    darkIconColor: "dark:text-[#BEF264]",
  },
  lilac: {
    name: "Pastel Lilac",
    lightBg: "bg-[#FAF5FF] hover:bg-[#F3E8FF] border-[#E9D5FF] hover:border-[#D8B4FE] shadow-purple-500/5",
    lightIconColor: "text-[#9333EA]",
    darkBg: "dark:bg-gradient-to-tr dark:from-[#301B3E] dark:via-[#261631] dark:to-[#1D1125] dark:border-[#D8B4FE]/30 dark:hover:border-[#D8B4FE]/50",
    darkIconColor: "dark:text-[#D8B4FE]",
  },
  teal: {
    name: "Pastel Teal",
    lightBg: "bg-[#F0FDFA] hover:bg-[#CCFBF1] border-[#99F6E4] hover:border-[#5EEAD4] shadow-teal-500/5",
    lightIconColor: "text-[#0D9488]",
    darkBg: "dark:bg-gradient-to-tr dark:from-[#133230] dark:via-[#102726] dark:to-[#0D1D1C] dark:border-[#5EEAD4]/30 dark:hover:border-[#5EEAD4]/50",
    darkIconColor: "dark:text-[#5EEAD4]",
  },
  slate: {
    name: "Pastel Slate",
    lightBg: "bg-[#F8FAFC] hover:bg-[#F1F5F9] border-[#CBD5E1] hover:border-[#94A3B8] shadow-slate-500/5",
    lightIconColor: "text-[#475569]",
    darkBg: "dark:bg-gradient-to-tr dark:from-[#1E2530] dark:via-[#171D26] dark:to-[#12161E] dark:border-white/15 dark:hover:border-white/30",
    darkIconColor: "dark:text-[#94A3B8]",
  },
  // Compatibility fallbacks for legacy saved configs
  blue: {
    name: "Pastel Sky",
    lightBg: "bg-[#F0F9FF] hover:bg-[#E0F2FE] border-[#BAE6FD] hover:border-[#7DD3FC] shadow-sky-500/5",
    lightIconColor: "text-[#0284C7]",
    darkBg: "dark:bg-gradient-to-tr dark:from-[#14293D] dark:via-[#102030] dark:to-[#0C1824] dark:border-[#7DD3FC]/30 dark:hover:border-[#7DD3FC]/50",
    darkIconColor: "dark:text-[#7DD3FC]",
  },
  emerald: {
    name: "Pastel Mint",
    lightBg: "bg-[#F0FDF4] hover:bg-[#DCFCE7] border-[#BBF7D0] hover:border-[#86EFAC] shadow-emerald-500/5",
    lightIconColor: "text-[#16A34A]",
    darkBg: "dark:bg-gradient-to-tr dark:from-[#173326] dark:via-[#13281E] dark:to-[#0F1E17] dark:border-[#86EFAC]/30 dark:hover:border-[#86EFAC]/50",
    darkIconColor: "dark:text-[#86EFAC]",
  },
  amber: {
    name: "Pastel Peach",
    lightBg: "bg-[#FFF5EE] hover:bg-[#FFE8DC] border-[#FED7AA] hover:border-[#FDBA74] shadow-amber-500/5",
    lightIconColor: "text-[#EA580C]",
    darkBg: "dark:bg-gradient-to-tr dark:from-[#38261F] dark:via-[#2A1E1A] dark:to-[#1E1715] dark:border-[#F8A87C]/30 dark:hover:border-[#F8A87C]/50",
    darkIconColor: "dark:text-[#FDBA74]",
  },
  purple: {
    name: "Pastel Lavender",
    lightBg: "bg-[#F5F3FF] hover:bg-[#EDE9FE] border-[#DDD6FE] hover:border-[#C4B5FD] shadow-indigo-500/5",
    lightIconColor: "text-[#7C3AED]",
    darkBg: "dark:bg-gradient-to-tr dark:from-[#271E3D] dark:via-[#1F1830] dark:to-[#171224] dark:border-[#C4B5FD]/30 dark:hover:border-[#C4B5FD]/50",
    darkIconColor: "dark:text-[#C4B5FD]",
  },
  orange: {
    name: "Pastel Apricot",
    lightBg: "bg-[#FEFCE8] hover:bg-[#FEF9C3] border-[#FEF08A] hover:border-[#FDE047] shadow-yellow-500/5",
    lightIconColor: "text-[#CA8A04]",
    darkBg: "dark:bg-gradient-to-tr dark:from-[#352D18] dark:via-[#292314] dark:to-[#1E1A0F] dark:border-[#FDE047]/30 dark:hover:border-[#FDE047]/50",
    darkIconColor: "dark:text-[#FDE047]",
  },
  red: {
    name: "Pastel Rose",
    lightBg: "bg-[#FFF1F2] hover:bg-[#FFE4E6] border-[#FECDD3] hover:border-[#FDA4AF] shadow-rose-500/5",
    lightIconColor: "text-[#E11D48]",
    darkBg: "dark:bg-gradient-to-tr dark:from-[#3A1B24] dark:via-[#2D161D] dark:to-[#211116] dark:border-[#FDA4AF]/30 dark:hover:border-[#FDA4AF]/50",
    darkIconColor: "dark:text-[#FDA4AF]",
  },
  fuchsia: {
    name: "Pastel Lilac",
    lightBg: "bg-[#FAF5FF] hover:bg-[#F3E8FF] border-[#E9D5FF] hover:border-[#D8B4FE] shadow-purple-500/5",
    lightIconColor: "text-[#9333EA]",
    darkBg: "dark:bg-gradient-to-tr dark:from-[#301B3E] dark:via-[#261631] dark:to-[#1D1125] dark:border-[#D8B4FE]/30 dark:hover:border-[#D8B4FE]/50",
    darkIconColor: "dark:text-[#D8B4FE]",
  },
};

export function getAgentVisualProfile(roleTag?: string, nameOrId: string = "") {
  const norm = (nameOrId + " " + (roleTag || "")).toLowerCase();

  if (norm.includes("fullstack") || norm.includes("swe") || norm.includes("code") || norm.includes("dev")) {
    return {
      ...AVATAR_COLOR_PRESETS.sky,
      icon: Code,
    };
  }
  if (norm.includes("sre") || norm.includes("fleet") || norm.includes("ops") || norm.includes("sentinel")) {
    return {
      ...AVATAR_COLOR_PRESETS.mint,
      icon: Activity,
    };
  }
  if (norm.includes("qa") || norm.includes("vision") || norm.includes("test")) {
    return {
      ...AVATAR_COLOR_PRESETS.peach,
      icon: Eye,
    };
  }
  if (norm.includes("kb") || norm.includes("knowledge") || norm.includes("docs")) {
    return {
      ...AVATAR_COLOR_PRESETS.lavender,
      icon: BookOpen,
    };
  }
  if (norm.includes("telegram") || norm.includes("chat") || norm.includes("social") || norm.includes("marketing")) {
    return {
      ...AVATAR_COLOR_PRESETS.teal,
      icon: Send,
    };
  }
  if (norm.includes("db") || norm.includes("database") || norm.includes("sql") || norm.includes("data")) {
    return {
      ...AVATAR_COLOR_PRESETS.rose,
      icon: Database,
    };
  }
  if (norm.includes("gateway") || norm.includes("router") || norm.includes("proxy")) {
    return {
      ...AVATAR_COLOR_PRESETS.apricot,
      icon: Radio,
    };
  }
  if (norm.includes("security") || norm.includes("guard") || norm.includes("constitution")) {
    return {
      ...AVATAR_COLOR_PRESETS.rose,
      icon: Shield,
    };
  }
  if (norm.includes("agentteams") || norm.includes("manager") || norm.includes("swarm")) {
    return {
      ...AVATAR_COLOR_PRESETS.lilac,
      icon: Layers,
    };
  }

  // Default fallback visual
  return {
    ...AVATAR_COLOR_PRESETS.slate,
    icon: Cpu,
  };
}

interface AgentAvatarProps {
  agent: {
    id?: string;
    slug?: string;
    name?: string;
    roleTag?: string;
  };
  size?: "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
  overrideConfig?: CustomAvatarConfig | null;
  interactive?: boolean;
  forcedAnimation?: string;
  alwaysAnimate?: boolean;
}

export function AgentAvatar({
  agent,
  size = "md",
  className = "",
  overrideConfig,
  interactive = true,
  forcedAnimation,
  alwaysAnimate = false,
}: AgentAvatarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const parentTarget = el.closest("button, a, [role=\"button\"], [data-testid^=\"agent-mention-chip\"], .group") || el;
    const onEnter = () => setIsHovered(true);
    const onLeave = () => setIsHovered(false);
    parentTarget.addEventListener("pointerenter", onEnter);
    parentTarget.addEventListener("pointerleave", onLeave);
    return () => {
      parentTarget.removeEventListener("pointerenter", onEnter);
      parentTarget.removeEventListener("pointerleave", onLeave);
    };
  }, []);
  const [customConfig, setCustomConfig] = useState<CustomAvatarConfig | null>(
    overrideConfig !== undefined ? overrideConfig : getAgentAvatarConfig(agent.id)
  );

  useEffect(() => {
    if (overrideConfig !== undefined) {
      setCustomConfig(overrideConfig);
      return;
    }

    const handler = (e: any) => {
      const detail = e.detail;
      if (detail && detail.agentId === agent.id) {
        setCustomConfig(detail.config);
      }
    };
    window.addEventListener("agent-avatar-updated", handler);
    return () => window.removeEventListener("agent-avatar-updated", handler);
  }, [agent.id, overrideConfig]);

  const defaultProfile = getAgentVisualProfile(agent.roleTag, agent.name || agent.slug || agent.id);

  // Compute profile based on customConfig if present
  let visualProfile = defaultProfile;
  if (customConfig && customConfig.type === "icon") {
    const preset = (customConfig.colorPreset && AVATAR_COLOR_PRESETS[customConfig.colorPreset]) || defaultProfile;
    const IconComp = ((customConfig.iconName && AVATAR_ICON_MAP[customConfig.iconName]) || defaultProfile.icon) as any;
    visualProfile = {
      ...preset,
      icon: IconComp,
    };
  }

  const sizeBox = {
    "2xs": "h-4.5 w-4.5 rounded-md",
    xs: "h-6 w-6 rounded-lg",
    sm: "h-7 w-7 rounded-xl",
    md: "h-12 w-12 rounded-xl",
    lg: "h-18 w-18 rounded-2xl",
    xl: "h-24 w-24 rounded-3xl",
    "2xl": "h-32 w-32 rounded-3xl",
  }[size];

  const iconSize = {
    "2xs": 10,
    xs: 12,
    sm: 15,
    md: 24,
    lg: 32,
    xl: 44,
    "2xl": 56,
  }[size];

  const emojiSizeClass = {
    "2xs": "text-[10px]",
    xs: "text-xs",
    sm: "text-sm",
    md: "text-xl",
    lg: "text-3xl",
    xl: "text-5xl",
    "2xl": "text-6xl",
  }[size];

  const hoverEffects = interactive
    ? "transition-transform duration-300 ease-out hover:scale-110 cursor-pointer group/avatar"
    : "transition-transform duration-300 ease-out";

  const blobPixelSize = {
    "2xs": 18,
    xs: 24,
    sm: 28,
    md: 52,
    lg: 76,
    xl: 104,
    "2xl": 136,
  }[size];

  // 0. Custom Blob or Default Blob Avatar (from c0le0ni/blob-avatar)
  const isDefaultBlob = !customConfig || customConfig.type === "blob" || customConfig.type === "role";
  if (isDefaultBlob) {
    const defaultBlob = getAgentBlobProfile(agent.id || agent.slug, agent.name, agent.roleTag);
    const blobProps = customConfig?.blob || defaultBlob;
    const rawAnim = forcedAnimation || blobProps.animation || defaultBlob.animation;
    // Prevent "thinking" clip which morphs the blob into 3 dots
    const safeAnim = typeof rawAnim === "string" ? rawAnim.replace(/thinking(\.\d+(\.\d+)?)?/g, "nod.1.4,jump.1.4") : rawAnim;
    const shouldAnimate = Boolean(forcedAnimation || alwaysAnimate || isHovered);
    const cleanClassName = className
      .replace(/ring-\d+/g, "")
      .replace(/ring-[^\s]+/g, "")
      .replace(/border[^\s]*/g, "")
      .replace(/shadow[^\s]*/g, "");
    return (
      <div
        ref={containerRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative inline-flex items-center justify-center shrink-0 select-none bg-transparent border-0 overflow-visible leading-none ${sizeBox} ${
          isHovered ? "scale-110" : ""
        } ${hoverEffects} ${cleanClassName}`}
      >
        <BlobAvatar
          shape={blobProps.shape as any || defaultBlob.shape}
          expression={blobProps.expression as any || defaultBlob.expression}
          color={blobProps.color || defaultBlob.color}
          paused={!shouldAnimate}
          animation={safeAnim}
          seed={blobProps.seed || defaultBlob.seed}
          size={blobPixelSize}
          gaze={shouldAnimate || interactive}
          reaction={interactive}
          className="flex items-center justify-center"
        />
      </div>
    );
  }

  // 1. Emoji Type
  if (customConfig?.type === "emoji" && customConfig.emoji) {
    const preset = (customConfig.colorPreset && AVATAR_COLOR_PRESETS[customConfig.colorPreset]) || defaultProfile;
    return (
      <div
        className={`relative flex items-center justify-center shrink-0 border shadow-xs select-none ${preset.lightBg} ${preset.darkBg} ${sizeBox} ${hoverEffects} ${className}`}
      >
        <span className={`${emojiSizeClass} leading-none transition-transform duration-300 group-hover/avatar:scale-110 group-hover/avatar:rotate-6`}>
          {customConfig.emoji}
        </span>
      </div>
    );
  }

  // 2. Custom Image Type
  if (customConfig?.type === "image" && customConfig.imageUrl) {
    return (
      <div
        className={`relative flex items-center justify-center shrink-0 border border-slate-200 dark:border-white/20 shadow-xs overflow-hidden select-none bg-slate-100 dark:bg-neutral-800 ${sizeBox} ${hoverEffects} ${className}`}
      >
        <img
          src={customConfig.imageUrl}
          alt={agent.name || "Agent Avatar"}
          className="h-full w-full object-cover transition-transform duration-300 group-hover/avatar:scale-110"
          onError={(e) => {
            // Fallback to role icon if image fails
            (e.target as HTMLElement).style.display = "none";
          }}
        />
      </div>
    );
  }

  // 3. Icon / Role Default
  const IconComponent = visualProfile.icon;
  return (
    <div
      className={`relative flex items-center justify-center shrink-0 border shadow-xs select-none ${visualProfile.lightBg} ${visualProfile.darkBg} ${sizeBox} ${hoverEffects} ${className}`}
    >
      <IconComponent
        size={iconSize}
        className={`${visualProfile.lightIconColor} ${visualProfile.darkIconColor} transition-transform duration-300 ease-out group-hover/avatar:scale-110 group-hover/avatar:-rotate-6`}
      />
    </div>
  );
}
