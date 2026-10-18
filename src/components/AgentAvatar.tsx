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
  blue: {
    name: "Cyber Blue",
    lightBg: "bg-blue-50 hover:bg-blue-100/80 border-blue-200 hover:border-blue-300 shadow-blue-500/10",
    lightIconColor: "text-blue-600",
    darkBg: "dark:bg-gradient-to-tr dark:from-blue-600 dark:via-indigo-600 dark:to-cyan-400 dark:border-blue-400/30 dark:hover:border-white/40",
    darkIconColor: "dark:text-blue-100",
  },
  emerald: {
    name: "Emerald Ops",
    lightBg: "bg-emerald-50 hover:bg-emerald-100/80 border-emerald-200 hover:border-emerald-300 shadow-emerald-500/10",
    lightIconColor: "text-emerald-600",
    darkBg: "dark:bg-gradient-to-tr dark:from-emerald-600 dark:via-teal-600 dark:to-emerald-400 dark:border-emerald-400/30 dark:hover:border-white/40",
    darkIconColor: "dark:text-emerald-100",
  },
  amber: {
    name: "Amber Vision",
    lightBg: "bg-amber-50 hover:bg-amber-100/80 border-amber-200 hover:border-amber-300 shadow-amber-500/10",
    lightIconColor: "text-amber-600",
    darkBg: "dark:bg-gradient-to-tr dark:from-amber-600 dark:via-orange-500 dark:to-yellow-300 dark:border-amber-400/30 dark:hover:border-white/40",
    darkIconColor: "dark:text-amber-100",
  },
  purple: {
    name: "Purple Scholar",
    lightBg: "bg-purple-50 hover:bg-purple-100/80 border-purple-200 hover:border-purple-300 shadow-purple-500/10",
    lightIconColor: "text-purple-600",
    darkBg: "dark:bg-gradient-to-tr dark:from-purple-600 dark:via-violet-600 dark:to-pink-400 dark:border-purple-400/30 dark:hover:border-white/40",
    darkIconColor: "dark:text-purple-100",
  },
  sky: {
    name: "Sky Beacon",
    lightBg: "bg-sky-50 hover:bg-sky-100/80 border-sky-200 hover:border-sky-300 shadow-sky-500/10",
    lightIconColor: "text-sky-600",
    darkBg: "dark:bg-gradient-to-tr dark:from-cyan-600 dark:via-blue-500 dark:to-sky-300 dark:border-cyan-400/30 dark:hover:border-white/40",
    darkIconColor: "dark:text-cyan-100",
  },
  rose: {
    name: "Rose Ledger",
    lightBg: "bg-rose-50 hover:bg-rose-100/80 border-rose-200 hover:border-rose-300 shadow-rose-500/10",
    lightIconColor: "text-rose-600",
    darkBg: "dark:bg-gradient-to-tr dark:from-rose-600 dark:via-red-500 dark:to-amber-400 dark:border-rose-400/30 dark:hover:border-white/40",
    darkIconColor: "dark:text-rose-100",
  },
  orange: {
    name: "Solar Orange",
    lightBg: "bg-orange-50 hover:bg-orange-100/80 border-orange-200 hover:border-orange-300 shadow-orange-500/10",
    lightIconColor: "text-orange-600",
    darkBg: "dark:bg-gradient-to-tr dark:from-orange-600 dark:via-amber-500 dark:to-yellow-400 dark:border-orange-400/30 dark:hover:border-white/40",
    darkIconColor: "dark:text-orange-100",
  },
  red: {
    name: "Crimson Guard",
    lightBg: "bg-red-50 hover:bg-red-100/80 border-red-200 hover:border-red-300 shadow-red-500/10",
    lightIconColor: "text-red-600",
    darkBg: "dark:bg-gradient-to-tr dark:from-red-600 dark:via-rose-600 dark:to-orange-400 dark:border-red-400/30 dark:hover:border-white/40",
    darkIconColor: "dark:text-red-100",
  },
  fuchsia: {
    name: "Fuchsia Swarm",
    lightBg: "bg-fuchsia-50 hover:bg-fuchsia-100/80 border-fuchsia-200 hover:border-fuchsia-300 shadow-fuchsia-500/10",
    lightIconColor: "text-fuchsia-600",
    darkBg: "dark:bg-gradient-to-tr dark:from-fuchsia-600 dark:via-purple-600 dark:to-indigo-400 dark:border-fuchsia-400/30 dark:hover:border-white/40",
    darkIconColor: "dark:text-fuchsia-100",
  },
  slate: {
    name: "Monochrome Stealth",
    lightBg: "bg-slate-100 hover:bg-slate-200/80 border-slate-300 hover:border-slate-400 shadow-slate-500/10",
    lightIconColor: "text-slate-700",
    darkBg: "dark:bg-gradient-to-tr dark:from-neutral-700 dark:via-neutral-600 dark:to-neutral-400 dark:border-white/20 dark:hover:border-white/40",
    darkIconColor: "dark:text-neutral-200",
  },
};

export function getAgentVisualProfile(roleTag?: string, nameOrId: string = "") {
  const norm = (nameOrId + " " + (roleTag || "")).toLowerCase();

  if (norm.includes("fullstack") || norm.includes("swe") || norm.includes("code") || norm.includes("dev")) {
    return {
      ...AVATAR_COLOR_PRESETS.blue,
      icon: Code,
    };
  }
  if (norm.includes("sre") || norm.includes("fleet") || norm.includes("ops") || norm.includes("sentinel")) {
    return {
      ...AVATAR_COLOR_PRESETS.emerald,
      icon: Activity,
    };
  }
  if (norm.includes("qa") || norm.includes("vision") || norm.includes("test")) {
    return {
      ...AVATAR_COLOR_PRESETS.amber,
      icon: Eye,
    };
  }
  if (norm.includes("kb") || norm.includes("knowledge") || norm.includes("docs")) {
    return {
      ...AVATAR_COLOR_PRESETS.purple,
      icon: BookOpen,
    };
  }
  if (norm.includes("telegram") || norm.includes("chat") || norm.includes("social") || norm.includes("marketing")) {
    return {
      ...AVATAR_COLOR_PRESETS.sky,
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
      ...AVATAR_COLOR_PRESETS.orange,
      icon: Radio,
    };
  }
  if (norm.includes("security") || norm.includes("guard") || norm.includes("constitution")) {
    return {
      ...AVATAR_COLOR_PRESETS.red,
      icon: Shield,
    };
  }
  if (norm.includes("agentteams") || norm.includes("manager") || norm.includes("swarm")) {
    return {
      ...AVATAR_COLOR_PRESETS.fuchsia,
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
}

export function AgentAvatar({
  agent,
  size = "md",
  className = "",
  overrideConfig,
  interactive = true,
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
