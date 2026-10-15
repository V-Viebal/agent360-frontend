import { useState } from "react";
import {
  Search,
  X,
  ExternalLink,
  Shield,
  Layers,
  Check,
  Plus,
  SlidersHorizontal,
} from "lucide-react";

export interface ConnectedAppItem {
  id: string;
  name: string;
  description: string;
  category: "Recommended" | "Password Managers" | "Productivity" | "Communication" | "Code" | "Data";
  iconText: string;
  iconBg: string;
  status: "connected" | "available";
}

const APPS_CATALOG: ConnectedAppItem[] = [
  // Recommended
  {
    id: "aws-location",
    name: "Amazon Location Service",
    description: "Guide developers through adding maps, tracking, geocoding and routing.",
    category: "Recommended",
    iconText: "aws",
    iconBg: "bg-[#232f3e] text-[#ff9900]",
    status: "available",
  },
  {
    id: "appwrite",
    name: "Appwrite",
    description: "The Appwrite plugin for Cursor and agent runtimes with Auth & DB.",
    category: "Recommended",
    iconText: "G",
    iconBg: "bg-pink-600/90 text-white",
    status: "available",
  },
  {
    id: "aws-amplify",
    name: "AWS Amplify",
    description: "Build full-stack apps with AWS Amplify Gen2 workflows.",
    category: "Recommended",
    iconText: "aws",
    iconBg: "bg-[#232f3e] text-[#ff9900]",
    status: "available",
  },
  {
    id: "aws-core",
    name: "AWS Core",
    description: "Build, deploy, and operate applications on AWS cloud infra.",
    category: "Recommended",
    iconText: "aws",
    iconBg: "bg-[#232f3e] text-[#ff9900]",
    status: "available",
  },
  {
    id: "aws-databases",
    name: "AWS Databases",
    description: "Expert database guidance for RDS, Aurora, DynamoDB and DocumentDB.",
    category: "Recommended",
    iconText: "aws",
    iconBg: "bg-[#232f3e] text-[#ff9900]",
    status: "available",
  },
  {
    id: "aws-deployments",
    name: "AWS Deployments",
    description: "Deploy applications to AWS with architectural best practices.",
    category: "Recommended",
    iconText: "aws",
    iconBg: "bg-[#232f3e] text-[#ff9900]",
    status: "available",
  },

  // Password Managers
  {
    id: "1password",
    name: "1Password",
    description: "Share a dedicated 1Password vault with Agent360 for secrets.",
    category: "Password Managers",
    iconText: "1P",
    iconBg: "bg-blue-600 text-white",
    status: "connected",
  },

  // Productivity
  {
    id: "notion",
    name: "Notion",
    description: "Search Notion pages and databases, create tasks, and sync knowledge.",
    category: "Productivity",
    iconText: "N",
    iconBg: "bg-white text-black font-serif",
    status: "available",
  },
  {
    id: "atlassian",
    name: "Atlassian",
    description: "Atlassian plugin for Jira tickets, Confluence docs and sprint boards.",
    category: "Productivity",
    iconText: "A",
    iconBg: "bg-blue-500 text-white",
    status: "available",
  },
  {
    id: "linear",
    name: "Linear",
    description: "The product development system for issue tracking and roadmaps.",
    category: "Productivity",
    iconText: "L",
    iconBg: "bg-[#5e6ad2] text-white",
    status: "available",
  },
  {
    id: "canva",
    name: "Canva",
    description: "Create, edit, review, resize, and brand-check graphics and visuals.",
    category: "Productivity",
    iconText: "Canva",
    iconBg: "bg-gradient-to-tr from-cyan-500 to-indigo-500 text-white",
    status: "available",
  },
  {
    id: "gitlab",
    name: "GitLab",
    description: "Connect agent workflows to GitLab repositories, pipelines and merge requests.",
    category: "Productivity",
    iconText: "🦊",
    iconBg: "bg-amber-600 text-white",
    status: "available",
  },
  {
    id: "onedrive",
    name: "OneDrive",
    description: "Browse, search, and read Microsoft OneDrive company assets.",
    category: "Productivity",
    iconText: "☁️",
    iconBg: "bg-sky-600 text-white",
    status: "available",
  },

  // Communication
  {
    id: "email",
    name: "Email",
    description: "Give Grok Bot its own email address for notifications and dispatch.",
    category: "Communication",
    iconText: "✉️",
    iconBg: "bg-pink-600 text-white",
    status: "connected",
  },
  {
    id: "gmail",
    name: "Gmail",
    description: "Search, read, draft, and manage Gmail messages securely.",
    category: "Communication",
    iconText: "M",
    iconBg: "bg-red-500 text-white",
    status: "available",
  },
  {
    id: "google-calendar",
    name: "Google Calendar",
    description: "Search events and schedule meetings with teammates automatically.",
    category: "Communication",
    iconText: "31",
    iconBg: "bg-blue-600 text-white font-bold",
    status: "available",
  },
  {
    id: "slack",
    name: "Slack",
    description: "Slack AI tools for channels, threads and developer incidents.",
    category: "Communication",
    iconText: "#",
    iconBg: "bg-emerald-600 text-white",
    status: "available",
  },
  {
    id: "outlook",
    name: "Outlook",
    description: "Search, read, and send Microsoft Outlook corporate emails.",
    category: "Communication",
    iconText: "O",
    iconBg: "bg-blue-700 text-white",
    status: "available",
  },
  {
    id: "x",
    name: "X",
    description: "Search posts, read timelines, pull trends and schedule updates.",
    category: "Communication",
    iconText: "𝕏",
    iconBg: "bg-black text-white border border-neutral-700",
    status: "available",
  },

  // Code
  {
    id: "datadog",
    name: "Datadog",
    description: "Inspect and query Datadog logs, metrics, APM traces and alerts.",
    category: "Code",
    iconText: "🐶",
    iconBg: "bg-purple-700 text-white",
    status: "available",
  },
  {
    id: "superpowers",
    name: "Superpowers",
    description: "Core skills library: TDD, debugging, test harness and benchmarks.",
    category: "Code",
    iconText: "⚡",
    iconBg: "bg-neutral-800 text-white",
    status: "available",
  },
  {
    id: "vercel",
    name: "Vercel",
    description: "Build and deploy frontend web apps and serverless agents.",
    category: "Code",
    iconText: "▲",
    iconBg: "bg-black text-white border border-neutral-700",
    status: "available",
  },
  {
    id: "supabase",
    name: "Supabase",
    description: "Access your Supabase projects, tables and perform Postgres migrations.",
    category: "Code",
    iconText: "⚡",
    iconBg: "bg-emerald-700 text-white",
    status: "available",
  },
  {
    id: "cloudflare",
    name: "Cloudflare",
    description: "Build, test, and deploy applications on Cloudflare Workers & KV.",
    category: "Code",
    iconText: "☁️",
    iconBg: "bg-orange-600 text-white",
    status: "available",
  },
  {
    id: "sentry",
    name: "Sentry",
    description: "Sentry plugin for real-time error tracking and performance profiling.",
    category: "Code",
    iconText: "S",
    iconBg: "bg-purple-800 text-white",
    status: "available",
  },

  // Data
  {
    id: "postman",
    name: "Postman",
    description: "Work with Postman collections directly from your agent console.",
    category: "Data",
    iconText: "P",
    iconBg: "bg-orange-500 text-white",
    status: "available",
  },
  {
    id: "huggingface",
    name: "Hugging Face",
    description: "Agent skills for AI/ML tasks including datasets, models and spaces.",
    category: "Data",
    iconText: "🤗",
    iconBg: "bg-yellow-500 text-black",
    status: "available",
  },
  {
    id: "firecrawl",
    name: "Firecrawl",
    description: "Web scraping, crawling, and search tailored for LLM pipelines.",
    category: "Data",
    iconText: "🔥",
    iconBg: "bg-red-600 text-white",
    status: "available",
  },
  {
    id: "apify",
    name: "Apify",
    description: "Official Apify agent skills for web automation and data harvesting.",
    category: "Data",
    iconText: "▲",
    iconBg: "bg-teal-600 text-white",
    status: "available",
  },
];

interface ConnectAppsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConnectAppsModal({ isOpen, onClose }: ConnectAppsModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [apps, setApps] = useState<ConnectedAppItem[]>(APPS_CATALOG);

  if (!isOpen) return null;

  const categories = [
    "All",
    "Password Managers",
    "Productivity",
    "Communication",
    "Design",
    "Code",
    "Data",
  ];

  const toggleConnect = (appId: string) => {
    setApps((prev) =>
      prev.map((app) =>
        app.id === appId
          ? { ...app, status: app.status === "connected" ? "available" : "connected" }
          : app
      )
    );
  };

  const connectedCount = apps.filter((a) => a.status === "connected").length;

  const filteredApps = apps.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" ||
      (selectedCategory === "Design"
        ? app.name.includes("Canva") || app.name.includes("Figma") || app.name.includes("Mobbin")
        : app.category === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  // Group by category for visual organization
  const displayCategories =
    selectedCategory === "All"
      ? (["Recommended", "Password Managers", "Productivity", "Communication", "Code", "Data"] as const)
      : [selectedCategory as any];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#141416] border border-[#222228] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-neutral-200 font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#1f1f26] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-white tracking-tight">Connect Apps</h2>
            <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-mono bg-[#1c1c24] px-2.5 py-1 rounded-full border border-[#262632]">
              <Shield size={12} className="text-emerald-400" />
              <span>{connectedCount} connected</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.open("/marketplace", "_blank")}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:text-white bg-[#1c1c24] hover:bg-[#252530] border border-[#282834] rounded-full transition-colors cursor-pointer"
            >
              <div className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>Bot templates</span>
              <ExternalLink size={12} className="text-neutral-500" />
            </button>
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-full hover:bg-[#22222c] flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Search Bar & Filter Pills */}
        <div className="p-5 pb-3 border-b border-[#1a1a20] space-y-3 shrink-0">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-3 text-neutral-500" />
            <input
              type="text"
              placeholder="Search across apps and skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1b1b22] border border-[#262630] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-neutral-400 transition-colors"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full transition-colors shrink-0 cursor-pointer text-xs font-medium ${
                  selectedCategory === cat
                    ? "bg-white text-black font-semibold"
                    : "bg-[#1c1c24] text-neutral-400 hover:text-white hover:bg-[#242430] border border-[#252530]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Apps List grouped by category */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {displayCategories.map((catGroup) => {
            const groupApps = filteredApps.filter(
              (a) => catGroup === "Recommended" || a.category === catGroup
            );
            if (groupApps.length === 0) return null;

            return (
              <div key={catGroup} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider font-mono">
                    {catGroup}
                  </h3>
                  <span className="text-[11px] text-neutral-500 hover:text-neutral-300 cursor-pointer">
                    View all
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {groupApps.map((app) => {
                    const isConnected = app.status === "connected";
                    return (
                      <div
                        key={app.id}
                        className="p-3.5 rounded-2xl bg-[#181820] hover:bg-[#1d1d28] border border-[#22222c] hover:border-[#2e2e3c] flex items-center justify-between gap-3 transition-colors group"
                      >
                        {/* App Icon */}
                        <div
                          className={`h-11 w-11 rounded-xl shrink-0 flex items-center justify-center font-bold text-sm shadow-md ${app.iconBg}`}
                        >
                          {app.iconText}
                        </div>

                        {/* Title & Description */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-white truncate block">
                              {app.name}
                            </span>
                            {isConnected && (
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                            )}
                          </div>
                          <p className="text-[11px] text-neutral-400 truncate mt-0.5 leading-snug">
                            {app.description}
                          </p>
                        </div>

                        {/* Action Button: Connect / Add */}
                        <button
                          onClick={() => toggleConnect(app.id)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer ${
                            isConnected
                              ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25"
                              : "bg-[#252532] hover:bg-white hover:text-black text-neutral-200 border border-[#303040]"
                          }`}
                        >
                          {isConnected ? "Connected" : "Add"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {filteredApps.length === 0 && (
            <div className="py-16 text-center text-xs text-neutral-500 font-mono space-y-2">
              <Layers size={24} className="mx-auto text-neutral-600 mb-1" />
              <div>No applications found matching "{searchQuery}".</div>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="text-[#ff7a00] hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
