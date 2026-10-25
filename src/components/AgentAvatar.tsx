import React, { useState, useEffect } from "react";
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
  "idle.2.4,wink.1.6",
  "idle.2.4,nod.1.4",
  "idle.2.4,happy.2",
  "idle.2.4,thinking.2.6",
  "idle.2.4,wave.1.6",
  "idle.2.4,love.2",
  "idle.2.4,play.2",
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
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  overrideConfig?: CustomAvatarConfig | null;
  interactive?: boolean;
  forcedAnimation?: string;
}

export function AgentAvatar({
  agent,
  size = "md",
  className = "",
  overrideConfig,
  interactive = true,
  forcedAnimation,
}: AgentAvatarProps) {
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
    xs: "h-6 w-6 rounded-lg",
    sm: "h-7 w-7 rounded-xl",
    md: "h-8 w-8 rounded-xl",
    lg: "h-11 w-11 rounded-2xl",
    xl: "h-14 w-14 rounded-2xl",
  }[size];

  const iconSize = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 22,
    xl: 28,
  }[size];

  const emojiSizeClass = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-2xl",
    xl: "text-3xl",
  }[size];

  const hoverEffects = interactive
    ? "transition-all duration-300 ease-out hover:scale-110 hover:shadow-md cursor-pointer group/avatar"
    : "";

  const blobPixelSize = {
    xs: 20,
    sm: 24,
    md: 28,
    lg: 38,
    xl: 48,
  }[size];

  // 0. Custom Blob or Default Blob Avatar (from c0le0ni/blob-avatar)
  const isDefaultBlob = !customConfig || customConfig.type === "blob" || customConfig.type === "role";
  if (isDefaultBlob) {
    const defaultBlob = getAgentBlobProfile(agent.id || agent.slug, agent.name, agent.roleTag);
    const blobProps = customConfig?.blob || defaultBlob;
    return (
      <div
        className={`relative flex items-center justify-center shrink-0 border border-slate-200/60 dark:border-white/10 shadow-xs select-none bg-slate-50 dark:bg-[#161622] overflow-hidden ${sizeBox} ${hoverEffects} ${className}`}
      >
        <BlobAvatar
          shape={blobProps.shape as any || defaultBlob.shape}
          expression={blobProps.expression as any || defaultBlob.expression}
          color={blobProps.color || defaultBlob.color}
          animation={forcedAnimation || blobProps.animation || defaultBlob.animation}
          seed={blobProps.seed || defaultBlob.seed}
          size={blobPixelSize}
          gaze={interactive}
          reaction={interactive}
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
