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
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

// Deterministic role & name color / icon pairing
export function getAgentVisualProfile(roleTag?: string, nameOrId: string = "") {
  const norm = (nameOrId + " " + (roleTag || "")).toLowerCase();

  if (norm.includes("fullstack") || norm.includes("swe") || norm.includes("code") || norm.includes("dev")) {
    return {
      gradient: "from-blue-600 via-indigo-600 to-cyan-400",
      iconColor: "text-blue-100",
      accentBorder: "border-blue-400/30",
      icon: Code,
    };
  }
  if (norm.includes("sre") || norm.includes("fleet") || norm.includes("ops") || norm.includes("sentinel")) {
    return {
      gradient: "from-emerald-600 via-teal-600 to-emerald-400",
      iconColor: "text-emerald-100",
      accentBorder: "border-emerald-400/30",
      icon: Activity,
    };
  }
  if (norm.includes("qa") || norm.includes("vision") || norm.includes("test")) {
    return {
      gradient: "from-amber-600 via-orange-500 to-yellow-300",
      iconColor: "text-amber-100",
      accentBorder: "border-amber-400/30",
      icon: Eye,
    };
  }
  if (norm.includes("kb") || norm.includes("knowledge") || norm.includes("docs")) {
    return {
      gradient: "from-purple-600 via-violet-600 to-pink-400",
      iconColor: "text-purple-100",
      accentBorder: "border-purple-400/30",
      icon: BookOpen,
    };
  }
  if (norm.includes("telegram") || norm.includes("chat") || norm.includes("social") || norm.includes("marketing")) {
    return {
      gradient: "from-cyan-600 via-blue-500 to-sky-300",
      iconColor: "text-cyan-100",
      accentBorder: "border-cyan-400/30",
      icon: Send,
    };
  }
  if (norm.includes("db") || norm.includes("database") || norm.includes("sql") || norm.includes("data")) {
    return {
      gradient: "from-rose-600 via-red-500 to-amber-400",
      iconColor: "text-rose-100",
      accentBorder: "border-rose-400/30",
      icon: Database,
    };
  }
  if (norm.includes("gateway") || norm.includes("router") || norm.includes("proxy")) {
    return {
      gradient: "from-orange-600 via-amber-500 to-yellow-400",
      iconColor: "text-orange-100",
      accentBorder: "border-orange-400/30",
      icon: Radio,
    };
  }
  if (norm.includes("security") || norm.includes("guard") || norm.includes("constitution")) {
    return {
      gradient: "from-red-600 via-rose-600 to-orange-400",
      iconColor: "text-red-100",
      accentBorder: "border-red-400/30",
      icon: Shield,
    };
  }
  if (norm.includes("agentteams") || norm.includes("manager") || norm.includes("swarm")) {
    return {
      gradient: "from-fuchsia-600 via-purple-600 to-indigo-400",
      iconColor: "text-fuchsia-100",
      accentBorder: "border-fuchsia-400/30",
      icon: Layers,
    };
  }

  // Default fallback visual
  return {
    gradient: "from-neutral-700 via-neutral-600 to-neutral-400",
    iconColor: "text-neutral-200",
    accentBorder: "border-white/20",
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
  }[size];

  const iconSize = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 22,
  }[size];

  return (
    <div
      className={`relative flex items-center justify-center shrink-0 bg-gradient-to-tr ${profile.gradient} shadow-md border ${profile.accentBorder} ${sizeBox} ${className}`}
    >
      <IconComponent size={iconSize} className={profile.iconColor} />
    </div>
  );
}
