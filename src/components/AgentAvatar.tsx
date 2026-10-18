import React from "react";
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
} from "lucide-react";
import { InfraAgent } from "../types/agent";

interface AgentAvatarProps {
  agent: {
    id?: string;
    slug?: string;
    name?: string;
    roleTag?: string;
  };
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

// Deterministic role & name color / icon pairing with dedicated Light Mode & Dark Mode palettes
export function getAgentVisualProfile(roleTag?: string, nameOrId: string = "") {
  const norm = (nameOrId + " " + (roleTag || "")).toLowerCase();

  if (norm.includes("fullstack") || norm.includes("swe") || norm.includes("code") || norm.includes("dev")) {
    return {
      lightBg: "bg-blue-50 hover:bg-blue-100/80 border-blue-200 hover:border-blue-300 shadow-blue-500/10",
      lightIconColor: "text-blue-600",
      darkBg: "dark:bg-gradient-to-tr dark:from-blue-600 dark:via-indigo-600 dark:to-cyan-400 dark:border-blue-400/30 dark:hover:border-white/40",
      darkIconColor: "dark:text-blue-100",
      icon: Code,
    };
  }
  if (norm.includes("sre") || norm.includes("fleet") || norm.includes("ops") || norm.includes("sentinel")) {
    return {
      lightBg: "bg-emerald-50 hover:bg-emerald-100/80 border-emerald-200 hover:border-emerald-300 shadow-emerald-500/10",
      lightIconColor: "text-emerald-600",
      darkBg: "dark:bg-gradient-to-tr dark:from-emerald-600 dark:via-teal-600 dark:to-emerald-400 dark:border-emerald-400/30 dark:hover:border-white/40",
      darkIconColor: "dark:text-emerald-100",
      icon: Activity,
    };
  }
  if (norm.includes("qa") || norm.includes("vision") || norm.includes("test")) {
    return {
      lightBg: "bg-amber-50 hover:bg-amber-100/80 border-amber-200 hover:border-amber-300 shadow-amber-500/10",
      lightIconColor: "text-amber-600",
      darkBg: "dark:bg-gradient-to-tr dark:from-amber-600 dark:via-orange-500 dark:to-yellow-300 dark:border-amber-400/30 dark:hover:border-white/40",
      darkIconColor: "dark:text-amber-100",
      icon: Eye,
    };
  }
  if (norm.includes("kb") || norm.includes("knowledge") || norm.includes("docs")) {
    return {
      lightBg: "bg-purple-50 hover:bg-purple-100/80 border-purple-200 hover:border-purple-300 shadow-purple-500/10",
      lightIconColor: "text-purple-600",
      darkBg: "dark:bg-gradient-to-tr dark:from-purple-600 dark:via-violet-600 dark:to-pink-400 dark:border-purple-400/30 dark:hover:border-white/40",
      darkIconColor: "dark:text-purple-100",
      icon: BookOpen,
    };
  }
  if (norm.includes("telegram") || norm.includes("chat") || norm.includes("social") || norm.includes("marketing")) {
    return {
      lightBg: "bg-sky-50 hover:bg-sky-100/80 border-sky-200 hover:border-sky-300 shadow-sky-500/10",
      lightIconColor: "text-sky-600",
      darkBg: "dark:bg-gradient-to-tr dark:from-cyan-600 dark:via-blue-500 dark:to-sky-300 dark:border-cyan-400/30 dark:hover:border-white/40",
      darkIconColor: "dark:text-cyan-100",
      icon: Send,
    };
  }
  if (norm.includes("db") || norm.includes("database") || norm.includes("sql") || norm.includes("data")) {
    return {
      lightBg: "bg-rose-50 hover:bg-rose-100/80 border-rose-200 hover:border-rose-300 shadow-rose-500/10",
      lightIconColor: "text-rose-600",
      darkBg: "dark:bg-gradient-to-tr dark:from-rose-600 dark:via-red-500 dark:to-amber-400 dark:border-rose-400/30 dark:hover:border-white/40",
      darkIconColor: "dark:text-rose-100",
      icon: Database,
    };
  }
  if (norm.includes("gateway") || norm.includes("router") || norm.includes("proxy")) {
    return {
      lightBg: "bg-orange-50 hover:bg-orange-100/80 border-orange-200 hover:border-orange-300 shadow-orange-500/10",
      lightIconColor: "text-orange-600",
      darkBg: "dark:bg-gradient-to-tr dark:from-orange-600 dark:via-amber-500 dark:to-yellow-400 dark:border-orange-400/30 dark:hover:border-white/40",
      darkIconColor: "dark:text-orange-100",
      icon: Radio,
    };
  }
  if (norm.includes("security") || norm.includes("guard") || norm.includes("constitution")) {
    return {
      lightBg: "bg-red-50 hover:bg-red-100/80 border-red-200 hover:border-red-300 shadow-red-500/10",
      lightIconColor: "text-red-600",
      darkBg: "dark:bg-gradient-to-tr dark:from-red-600 dark:via-rose-600 dark:to-orange-400 dark:border-red-400/30 dark:hover:border-white/40",
      darkIconColor: "dark:text-red-100",
      icon: Shield,
    };
  }
  if (norm.includes("agentteams") || norm.includes("manager") || norm.includes("swarm")) {
    return {
      lightBg: "bg-fuchsia-50 hover:bg-fuchsia-100/80 border-fuchsia-200 hover:border-fuchsia-300 shadow-fuchsia-500/10",
      lightIconColor: "text-fuchsia-600",
      darkBg: "dark:bg-gradient-to-tr dark:from-fuchsia-600 dark:via-purple-600 dark:to-indigo-400 dark:border-fuchsia-400/30 dark:hover:border-white/40",
      darkIconColor: "dark:text-fuchsia-100",
      icon: Layers,
    };
  }

  // Default fallback visual
  return {
    lightBg: "bg-slate-100 hover:bg-slate-200/80 border-slate-300 hover:border-slate-400 shadow-slate-500/10",
    lightIconColor: "text-slate-700",
    darkBg: "dark:bg-gradient-to-tr dark:from-neutral-700 dark:via-neutral-600 dark:to-neutral-400 dark:border-white/20 dark:hover:border-white/40",
    darkIconColor: "dark:text-neutral-200",
    icon: Cpu,
  };
}

export function AgentAvatar({ agent, size = "md", className = "" }: AgentAvatarProps) {
  const profile = getAgentVisualProfile(agent.roleTag, agent.name || agent.slug || agent.id);
  const IconComponent = profile.icon;

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

  return (
    <div
      className={`relative flex items-center justify-center shrink-0 border shadow-xs transition-all duration-300 ease-out hover:scale-110 hover:shadow-md cursor-pointer group/avatar select-none ${profile.lightBg} ${profile.darkBg} ${sizeBox} ${className}`}
    >
      <IconComponent
        size={iconSize}
        className={`${profile.lightIconColor} ${profile.darkIconColor} transition-transform duration-300 ease-out group-hover/avatar:scale-110 group-hover/avatar:-rotate-6`}
      />
    </div>
  );
}
