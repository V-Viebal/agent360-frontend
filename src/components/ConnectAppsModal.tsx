import { useState } from "react";
import {
  Search,
  X,
  ExternalLink,
  Shield,
  Layers,
} from "lucide-react";

export interface ConnectedAppItem {
  id: string;
  name: string;
  description: string;
  category: "Recommended" | "Password Managers" | "Productivity" | "Communication" | "Code" | "Data";
  logoUrl: string;
  status: "connected" | "available";
}

// 100% verified SVG logos supported directly by Composio API (https://logos.composio.dev/api/:slug)
const APPS_CATALOG: ConnectedAppItem[] = [
  // Recommended
  {
    id: "aws",
    name: "Amazon Web Services",
    description: "Build, deploy, and operate applications on AWS cloud infra and serverless services.",
    category: "Recommended",
    logoUrl: "https://logos.composio.dev/api/aws",
    status: "available",
  },
  {
    id: "appwrite",
    name: "Appwrite",
    description: "The Appwrite plugin for agent runtimes with Auth, Databases, Storage and Cloud Functions.",
    category: "Recommended",
    logoUrl: "https://logos.composio.dev/api/appwrite",
    status: "available",
  },
  {
    id: "cloudflare",
    name: "Cloudflare",
    description: "Build, test, and deploy applications on Cloudflare Workers, KV, R2 and DNS.",
    category: "Recommended",
    logoUrl: "https://logos.composio.dev/api/cloudflare",
    status: "available",
  },
  {
    id: "supabase",
    name: "Supabase",
    description: "Access Postgres databases, perform schema migrations and trigger realtime webhook events.",
    category: "Recommended",
    logoUrl: "https://logos.composio.dev/api/supabase",
    status: "available",
  },
  {
    id: "github",
    name: "GitHub",
    description: "Manage pull requests, commit code, review diffs, and inspect GitHub Actions workflows.",
    category: "Recommended",
    logoUrl: "https://logos.composio.dev/api/github",
    status: "connected",
  },
  {
    id: "composio",
    name: "Composio Superpowers",
    description: "Core tool ecosystem powering 250+ enterprise integrations for autonomous AI bots.",
    category: "Recommended",
    logoUrl: "https://logos.composio.dev/api/composio",
    status: "connected",
  },

  // Password Managers
  {
    id: "1password",
    name: "1Password",
    description: "Share a dedicated 1Password vault with Agent360 for secrets, keys and credentials.",
    category: "Password Managers",
    logoUrl: "https://logos.composio.dev/api/1password",
    status: "connected",
  },

  // Productivity
  {
    id: "notion",
    name: "Notion",
    description: "Search Notion pages and databases, create tasks, and sync workspace knowledge bases.",
    category: "Productivity",
    logoUrl: "https://logos.composio.dev/api/notion",
    status: "available",
  },
  {
    id: "atlassian",
    name: "Atlassian",
    description: "Connect agent workflows to Jira sprint boards, backlogs, and Confluence documentation.",
    category: "Productivity",
    logoUrl: "https://logos.composio.dev/api/atlassian",
    status: "available",
  },
  {
    id: "jira",
    name: "Jira",
    description: "Automate issue creation, sprint status tracking, and release management.",
    category: "Productivity",
    logoUrl: "https://logos.composio.dev/api/jira",
    status: "available",
  },
  {
    id: "confluence",
    name: "Confluence",
    description: "Search team spaces, draft design specifications, and publish engineering runbooks.",
    category: "Productivity",
    logoUrl: "https://logos.composio.dev/api/confluence",
    status: "available",
  },
  {
    id: "linear",
    name: "Linear",
    description: "The product development system for issue tracking, cycle planning, and roadmaps.",
    category: "Productivity",
    logoUrl: "https://logos.composio.dev/api/linear",
    status: "available",
  },
  {
    id: "canva",
    name: "Canva",
    description: "Create, edit, review, resize, and brand-check graphics and presentation visuals.",
    category: "Productivity",
    logoUrl: "https://logos.composio.dev/api/canva",
    status: "available",
  },
  {
    id: "figma",
    name: "Figma",
    description: "Turn designs into code, inspect design tokens, and review UI/UX components.",
    category: "Productivity",
    logoUrl: "https://logos.composio.dev/api/figma",
    status: "available",
  },
  {
    id: "clickup",
    name: "ClickUp",
    description: "Tasks, docs, goals and sprint workflows connected to autonomous agent turns.",
    category: "Productivity",
    logoUrl: "https://logos.composio.dev/api/clickup",
    status: "available",
  },
  {
    id: "asana",
    name: "Asana",
    description: "Coordinate team tasks, project timelines, and cross-functional deliverables.",
    category: "Productivity",
    logoUrl: "https://logos.composio.dev/api/asana",
    status: "available",
  },
  {
    id: "trello",
    name: "Trello",
    description: "Manage visual Kanban boards, update card checklists, and automate list moves.",
    category: "Productivity",
    logoUrl: "https://logos.composio.dev/api/trello",
    status: "available",
  },
  {
    id: "monday",
    name: "Monday.com",
    description: "Operate customizable team workflows, track task statuses, and update boards.",
    category: "Productivity",
    logoUrl: "https://logos.composio.dev/api/monday",
    status: "available",
  },
  {
    id: "googledocs",
    name: "Google Docs",
    description: "Create, read, and append collaborative Google documents and research recaps.",
    category: "Productivity",
    logoUrl: "https://logos.composio.dev/api/googledocs",
    status: "available",
  },
  {
    id: "googledrive",
    name: "Google Drive",
    description: "Browse, upload, and organize corporate files, spreadsheets, and shared assets.",
    category: "Productivity",
    logoUrl: "https://logos.composio.dev/api/googledrive",
    status: "available",
  },
  {
    id: "onedrive",
    name: "OneDrive",
    description: "Browse, search, and synchronize Microsoft OneDrive corporate documents.",
    category: "Productivity",
    logoUrl: "https://logos.composio.dev/api/onedrive",
    status: "available",
  },
  {
    id: "dropbox",
    name: "Dropbox",
    description: "Store, retrieve, and share files across cloud folders with verified links.",
    category: "Productivity",
    logoUrl: "https://logos.composio.dev/api/dropbox",
    status: "available",
  },
  {
    id: "box",
    name: "Box",
    description: "Enterprise content management and secure file sharing for compliance workflows.",
    category: "Productivity",
    logoUrl: "https://logos.composio.dev/api/box",
    status: "available",
  },

  // Communication
  {
    id: "gmail",
    name: "Gmail",
    description: "Search, read, draft, and send emails with intelligent filtering and attachments.",
    category: "Communication",
    logoUrl: "https://logos.composio.dev/api/gmail",
    status: "connected",
  },
  {
    id: "googlecalendar",
    name: "Google Calendar",
    description: "Search upcoming events, schedule meetings with attendees, and resolve conflicts.",
    category: "Communication",
    logoUrl: "https://logos.composio.dev/api/googlecalendar",
    status: "available",
  },
  {
    id: "slack",
    name: "Slack",
    description: "Post notifications, listen to mention events, and chat in private channels.",
    category: "Communication",
    logoUrl: "https://logos.composio.dev/api/slack",
    status: "available",
  },
  {
    id: "discord",
    name: "Discord",
    description: "Interact with developer communities, send alerts, and manage server roles.",
    category: "Communication",
    logoUrl: "https://logos.composio.dev/api/discord",
    status: "available",
  },
  {
    id: "telegram",
    name: "Telegram",
    description: "Direct bot dispatch, send files and execution summaries to verified chat topics.",
    category: "Communication",
    logoUrl: "https://logos.composio.dev/api/telegram",
    status: "available",
  },
  {
    id: "outlook",
    name: "Microsoft Outlook",
    description: "Search, read, and send Microsoft Outlook corporate emails and invitations.",
    category: "Communication",
    logoUrl: "https://logos.composio.dev/api/outlook",
    status: "available",
  },
  {
    id: "x",
    name: "X (Twitter)",
    description: "Search posts, read timelines, monitor brand keywords, and schedule tweets.",
    category: "Communication",
    logoUrl: "https://logos.composio.dev/api/x",
    status: "available",
  },
  {
    id: "zoom",
    name: "Zoom",
    description: "Schedule instant or recurring video conferences and retrieve meeting summaries.",
    category: "Communication",
    logoUrl: "https://logos.composio.dev/api/zoom",
    status: "available",
  },
  {
    id: "intercom",
    name: "Intercom",
    description: "Deliver autonomous customer support turns and triage live user conversations.",
    category: "Communication",
    logoUrl: "https://logos.composio.dev/api/intercom",
    status: "available",
  },
  {
    id: "zendesk",
    name: "Zendesk",
    description: "Manage support tickets, customer satisfaction surveys, and resolution macros.",
    category: "Communication",
    logoUrl: "https://logos.composio.dev/api/zendesk",
    status: "available",
  },

  // Code
  {
    id: "gitlab",
    name: "GitLab",
    description: "Connect agent workflows to GitLab repositories, CI/CD pipelines, and merge requests.",
    category: "Code",
    logoUrl: "https://logos.composio.dev/api/gitlab",
    status: "available",
  },
  {
    id: "datadog",
    name: "Datadog",
    description: "Inspect and query Datadog logs, metrics, APM traces, and synthetic alerts.",
    category: "Code",
    logoUrl: "https://logos.composio.dev/api/datadog",
    status: "available",
  },
  {
    id: "sentry",
    name: "Sentry",
    description: "Real-time exception tracking, error alerts, and stack trace investigations.",
    category: "Code",
    logoUrl: "https://logos.composio.dev/api/sentry",
    status: "available",
  },
  {
    id: "vercel",
    name: "Vercel",
    description: "Trigger deployments, inspect serverless logs, and manage preview environments.",
    category: "Code",
    logoUrl: "https://logos.composio.dev/api/vercel",
    status: "available",
  },
  {
    id: "openai",
    name: "OpenAI",
    description: "State-of-the-art model reasoning, code execution, and embedding capabilities.",
    category: "Code",
    logoUrl: "https://logos.composio.dev/api/openai",
    status: "available",
  },
  {
    id: "anthropic",
    name: "Anthropic",
    description: "Claude models for long-context analysis, safety steerability, and coding tasks.",
    category: "Code",
    logoUrl: "https://logos.composio.dev/api/anthropic",
    status: "available",
  },
  {
    id: "groq",
    name: "Groq",
    description: "Ultra-low latency LPU inference engine for realtime streaming agent turns.",
    category: "Code",
    logoUrl: "https://logos.composio.dev/api/groq",
    status: "available",
  },
  {
    id: "mistral",
    name: "Mistral AI",
    description: "European open-weight and frontier models for reasoning, translation, and code.",
    category: "Code",
    logoUrl: "https://logos.composio.dev/api/mistral",
    status: "available",
  },
  {
    id: "langchain",
    name: "LangChain",
    description: "Framework abstractions for chaining agent tools, prompts, and memory stores.",
    category: "Code",
    logoUrl: "https://logos.composio.dev/api/langchain",
    status: "available",
  },
  {
    id: "llamaindex",
    name: "LlamaIndex",
    description: "Data orchestration framework connecting custom private data to LLM applications.",
    category: "Code",
    logoUrl: "https://logos.composio.dev/api/llamaindex",
    status: "available",
  },

  // Data & Search
  {
    id: "postman",
    name: "Postman",
    description: "Execute and test API collections, generate mock servers, and debug payloads.",
    category: "Data",
    logoUrl: "https://logos.composio.dev/api/postman",
    status: "available",
  },
  {
    id: "huggingface",
    name: "Hugging Face",
    description: "Access open-source models, curated datasets, and inference endpoints.",
    category: "Data",
    logoUrl: "https://logos.composio.dev/api/huggingface",
    status: "available",
  },
  {
    id: "firecrawl",
    name: "Firecrawl",
    description: "Turn entire websites into clean LLM-ready markdown with headless scraping.",
    category: "Data",
    logoUrl: "https://logos.composio.dev/api/firecrawl",
    status: "available",
  },
  {
    id: "apify",
    name: "Apify",
    description: "Web automation platform with ready-made scrapers for e-commerce, maps, and feeds.",
    category: "Data",
    logoUrl: "https://logos.composio.dev/api/apify",
    status: "available",
  },
  {
    id: "tavily",
    name: "Tavily Search",
    description: "AI-native search engine designed to return factual, cited research snippets.",
    category: "Data",
    logoUrl: "https://logos.composio.dev/api/tavily",
    status: "available",
  },
  {
    id: "serpapi",
    name: "SerpApi",
    description: "Real-time Google search results, shopping prices, and maps data scraping.",
    category: "Data",
    logoUrl: "https://logos.composio.dev/api/serpapi",
    status: "available",
  },
  {
    id: "perplexityai",
    name: "Perplexity AI",
    description: "Grounded web answers with real-time citations and domain-specific filters.",
    category: "Data",
    logoUrl: "https://logos.composio.dev/api/perplexityai",
    status: "available",
  },
  {
    id: "pinecone",
    name: "Pinecone",
    description: "Managed vector database for semantic search, similarity matching, and RAG.",
    category: "Data",
    logoUrl: "https://logos.composio.dev/api/pinecone",
    status: "available",
  },
  {
    id: "mongodb",
    name: "MongoDB",
    description: "Document database for modern apps with flexible schema and Atlas search.",
    category: "Data",
    logoUrl: "https://logos.composio.dev/api/mongodb",
    status: "available",
  },
  {
    id: "redis",
    name: "Redis",
    description: "In-memory cache, message broker, and fast key-value store for active state.",
    category: "Data",
    logoUrl: "https://logos.composio.dev/api/redis",
    status: "available",
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    description: "Enterprise relational database with pgvector, JSONB and ACID guarantees.",
    category: "Data",
    logoUrl: "https://logos.composio.dev/api/postgresql",
    status: "available",
  },
  {
    id: "mysql",
    name: "MySQL",
    description: "Popular open-source relational database management system.",
    category: "Data",
    logoUrl: "https://logos.composio.dev/api/mysql",
    status: "available",
  },
  {
    id: "snowflake",
    name: "Snowflake",
    description: "Cloud data warehouse for large-scale analytical queries and BI workloads.",
    category: "Data",
    logoUrl: "https://logos.composio.dev/api/snowflake",
    status: "available",
  },
  {
    id: "googlesheets",
    name: "Google Sheets",
    description: "Read, write, update and append rows directly to cloud spreadsheets.",
    category: "Data",
    logoUrl: "https://logos.composio.dev/api/googlesheets",
    status: "available",
  },
  {
    id: "airtable",
    name: "Airtable",
    description: "No-code relational database with views, automated triggers and forms.",
    category: "Data",
    logoUrl: "https://logos.composio.dev/api/airtable",
    status: "available",
  },
  {
    id: "hubspot",
    name: "HubSpot",
    description: "Inbound CRM, contact lifecycle management, and marketing automation.",
    category: "Data",
    logoUrl: "https://logos.composio.dev/api/hubspot",
    status: "available",
  },
  {
    id: "salesforce",
    name: "Salesforce",
    description: "Enterprise CRM platform for lead tracking, pipeline deals and accounts.",
    category: "Data",
    logoUrl: "https://logos.composio.dev/api/salesforce",
    status: "available",
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Payment infrastructure, subscription billing, and customer invoice management.",
    category: "Data",
    logoUrl: "https://logos.composio.dev/api/stripe",
    status: "available",
  },
  {
    id: "shopify",
    name: "Shopify",
    description: "E-commerce platform for products, orders, inventory and customer management.",
    category: "Data",
    logoUrl: "https://logos.composio.dev/api/shopify",
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
      selectedCategory === "All" || app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
              placeholder="Search across 60+ verified apps and skills..."
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
                    {catGroup} ({groupApps.length})
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
                        {/* Composio Vector Brand Logo */}
                        <div className="h-11 w-11 rounded-xl shrink-0 flex items-center justify-center p-2 bg-[#101014] border border-[#24242e] shadow-inner">
                          <img
                            src={app.logoUrl}
                            alt={app.name}
                            className="h-full w-full object-contain"
                            loading="lazy"
                            onError={(e) => {
                              const target = e.currentTarget;
                              target.style.display = "none";
                              if (target.parentElement) {
                                target.parentElement.textContent = app.name[0];
                              }
                            }}
                          />
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
