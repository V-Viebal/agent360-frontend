import { useTranslation } from "../i18n/LanguageContext";
import { useState, useEffect } from "react";
import {
  Search,
  X,
  Shield,
  Layers,
  Check,
  Loader2,
  Sparkles,
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
export const APPS_CATALOG: ConnectedAppItem[] = [
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
    status: "available",
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
    description: "Secure credential vault for service accounts, API tokens, and zero-trust secrets.",
    category: "Password Managers",
    logoUrl: "https://logos.composio.dev/api/1password",
    status: "available",
  },

  // Productivity
  {
    id: "notion",
    name: "Notion",
    description: "Query, create, and organize workspace pages, project documentation, and databases.",
    category: "Productivity",
    logoUrl: "https://logos.composio.dev/api/notion",
    status: "available",
  },
  {
    id: "atlassian",
    name: "Atlassian",
    description: "Cross-product suite integration across Jira tickets, Confluence spaces, and Bitbucket.",
    category: "Productivity",
    logoUrl: "https://logos.composio.dev/api/atlassian",
    status: "available",
  },
  {
    id: "jira",
    name: "Jira",
    description: "Sprint issues tracking, backlog management, automated bug triage, and project boards.",
    category: "Productivity",
    logoUrl: "https://logos.composio.dev/api/jira",
    status: "available",
  },
  {
    id: "confluence",
    name: "Confluence",
    description: "Enterprise knowledge base documentation, technical specs, and team spaces.",
    category: "Productivity",
    logoUrl: "https://logos.composio.dev/api/confluence",
    status: "available",
  },
  {
    id: "linear",
    name: "Linear",
    description: "Streamlined issue tracking, cycle workflows, roadmaps, and software bug management.",
    category: "Productivity",
    logoUrl: "https://logos.composio.dev/api/linear",
    status: "available",
  },
  {
    id: "canva",
    name: "Canva",
    description: "Automate design templates, export presentation decks, and generate branded creative assets.",
    category: "Productivity",
    logoUrl: "https://logos.composio.dev/api/canva",
    status: "available",
  },
  {
    id: "figma",
    name: "Figma",
    description: "Extract design tokens, inspect component trees, read comments, and export frame assets.",
    category: "Productivity",
    logoUrl: "https://logos.composio.dev/api/figma",
    status: "available",
  },
  {
    id: "clickup",
    name: "ClickUp",
    description: "All-in-one productivity platform for tasks, docs, goals, and team workload boards.",
    category: "Productivity",
    logoUrl: "https://logos.composio.dev/api/clickup",
    status: "available",
  },
  {
    id: "asana",
    name: "Asana",
    description: "Manage cross-functional workflows, project milestones, task timelines, and portfolios.",
    category: "Productivity",
    logoUrl: "https://logos.composio.dev/api/asana",
    status: "available",
  },
  {
    id: "trello",
    name: "Trello",
    description: "Kanban boards, lists, and visual card automation for lean project delivery.",
    category: "Productivity",
    logoUrl: "https://logos.composio.dev/api/trello",
    status: "available",
  },
  {
    id: "monday",
    name: "Monday.com",
    description: "Customizable work operating system for sales pipelines, projects, and sprint tracking.",
    category: "Productivity",
    logoUrl: "https://logos.composio.dev/api/monday",
    status: "available",
  },
  {
    id: "googledocs",
    name: "Google Docs",
    description: "Real-time document creation, automated reporting, batch drafting, and exports.",
    category: "Productivity",
    logoUrl: "https://logos.composio.dev/api/googledocs",
    status: "available",
  },
  {
    id: "googledrive",
    name: "Google Drive",
    description: "Cloud file storage, workspace permission grants, shared drives, and content ingestion.",
    category: "Productivity",
    logoUrl: "https://logos.composio.dev/api/googledrive",
    status: "available",
  },
  {
    id: "onedrive",
    name: "Microsoft OneDrive",
    description: "Secure enterprise file synchronization and folder sharing across Microsoft 365.",
    category: "Productivity",
    logoUrl: "https://logos.composio.dev/api/onedrive",
    status: "available",
  },
  {
    id: "dropbox",
    name: "Dropbox",
    description: "File backup, public transfer links, and cloud document archive synchronization.",
    category: "Productivity",
    logoUrl: "https://logos.composio.dev/api/dropbox",
    status: "available",
  },
  {
    id: "box",
    name: "Box",
    description: "Compliant cloud content management, granular metadata, and enterprise security policies.",
    category: "Productivity",
    logoUrl: "https://logos.composio.dev/api/box",
    status: "available",
  },

  // Communication
  {
    id: "gmail",
    name: "Gmail",
    description: "Compose, categorize, search, and draft executive email correspondence securely.",
    category: "Communication",
    logoUrl: "https://logos.composio.dev/api/gmail",
    status: "available",
  },
  {
    id: "googlecalendar",
    name: "Google Calendar",
    description: "Schedule executive meetings, RSVP invites, and synchronize multi-timezone agendas.",
    category: "Communication",
    logoUrl: "https://logos.composio.dev/api/googlecalendar",
    status: "available",
  },
  {
    id: "slack",
    name: "Slack",
    description: "Send alerts, listen to thread mentions, trigger slash commands, and broadcast updates.",
    category: "Communication",
    logoUrl: "https://logos.composio.dev/api/slack",
    status: "available",
  },
  {
    id: "discord",
    name: "Discord",
    description: "Community moderation, bot commands, webhook alerts, and voice channel announcements.",
    category: "Communication",
    logoUrl: "https://logos.composio.dev/api/discord",
    status: "available",
  },
  {
    id: "telegram",
    name: "Telegram",
    description: "Dispatch broadcast notifications, receive bot callbacks, and deliver secure files.",
    category: "Communication",
    logoUrl: "https://logos.composio.dev/api/telegram",
    status: "available",
  },
  {
    id: "outlook",
    name: "Microsoft Outlook",
    description: "Exchange enterprise mail, sync calendar events, and manage distribution contacts.",
    category: "Communication",
    logoUrl: "https://logos.composio.dev/api/outlook",
    status: "available",
  },
  {
    id: "x",
    name: "X / Twitter",
    description: "Post status updates, monitor keyword mentions, and track social developer engagement.",
    category: "Communication",
    logoUrl: "https://logos.composio.dev/api/x",
    status: "available",
  },
  {
    id: "zoom",
    name: "Zoom",
    description: "Provision instant meetings, retrieve cloud recording transcripts, and schedule webinars.",
    category: "Communication",
    logoUrl: "https://logos.composio.dev/api/zoom",
    status: "available",
  },
  {
    id: "intercom",
    name: "Intercom",
    description: "Customer conversational support, AI bot resolution, and customer contact ticketing.",
    category: "Communication",
    logoUrl: "https://logos.composio.dev/api/intercom",
    status: "available",
  },
  {
    id: "zendesk",
    name: "Zendesk",
    description: "Customer success ticketing, SLA escalation policies, and knowledge help center articles.",
    category: "Communication",
    logoUrl: "https://logos.composio.dev/api/zendesk",
    status: "available",
  },

  // Code & AI Frameworks
  {
    id: "gitlab",
    name: "GitLab",
    description: "Manage self-hosted repositories, merge request reviews, and run CI/CD pipelines.",
    category: "Code",
    logoUrl: "https://logos.composio.dev/api/gitlab",
    status: "available",
  },
  {
    id: "datadog",
    name: "Datadog",
    description: "Infrastructure metric telemetry, APM trace inspection, and operational alert monitors.",
    category: "Code",
    logoUrl: "https://logos.composio.dev/api/datadog",
    status: "available",
  },
  {
    id: "sentry",
    name: "Sentry",
    description: "Frontend & backend error tracking, crash stack traces, and release regression monitoring.",
    category: "Code",
    logoUrl: "https://logos.composio.dev/api/sentry",
    status: "available",
  },
  {
    id: "vercel",
    name: "Vercel",
    description: "Trigger edge deployments, inspect build logs, configure custom domains, and purge edge cache.",
    category: "Code",
    logoUrl: "https://logos.composio.dev/api/vercel",
    status: "available",
  },
  {
    id: "openai",
    name: "OpenAI",
    description: "Embeddings generation, fine-tuning jobs, and GPT-4o multimodal completion calls.",
    category: "Code",
    logoUrl: "https://logos.composio.dev/api/openai",
    status: "available",
  },
  {
    id: "anthropic",
    name: "Anthropic Claude",
    description: "Long-context reasoning, code review workflows, and Claude 3.7 Sonnet analysis.",
    category: "Code",
    logoUrl: "https://logos.composio.dev/api/anthropic",
    status: "available",
  },
  {
    id: "groq",
    name: "Groq",
    description: "Ultra-low latency LPU inference for real-time speech and open-weights LLMs.",
    category: "Code",
    logoUrl: "https://logos.composio.dev/api/groq",
    status: "available",
  },
  {
    id: "mistral",
    name: "Mistral AI",
    description: "Frontier open models, codestral coding completions, and fast token generation.",
    category: "Code",
    logoUrl: "https://logos.composio.dev/api/mistral",
    status: "available",
  },
  {
    id: "langchain",
    name: "LangChain",
    description: "Connect LangSmith observability tracing, prompt evaluations, and agent chain execution.",
    category: "Code",
    logoUrl: "https://logos.composio.dev/api/langchain",
    status: "available",
  },
  {
    id: "llamaindex",
    name: "LlamaIndex",
    description: "Data indexing, structured document chunking, and advanced hybrid retrieval engines.",
    category: "Code",
    logoUrl: "https://logos.composio.dev/api/llamaindex",
    status: "available",
  },

  // Data & Databases
  {
    id: "postman",
    name: "Postman",
    description: "API collection runs, automated test assertions, and workspace environment mocking.",
    category: "Data",
    logoUrl: "https://logos.composio.dev/api/postman",
    status: "available",
  },
  {
    id: "huggingface",
    name: "Hugging Face",
    description: "Search open model weights, download datasets, and deploy serverless Inference Endpoints.",
    category: "Data",
    logoUrl: "https://logos.composio.dev/api/huggingface",
    status: "available",
  },
  {
    id: "firecrawl",
    name: "Firecrawl",
    description: "Clean LLM-ready markdown web crawling, sitemap traversing, and structured web extraction.",
    category: "Data",
    logoUrl: "https://logos.composio.dev/api/firecrawl",
    status: "available",
  },
  {
    id: "apify",
    name: "Apify",
    description: "Run cloud web scrapers, crawler Actors, and social data extractors on schedule.",
    category: "Data",
    logoUrl: "https://logos.composio.dev/api/apify",
    status: "available",
  },
  {
    id: "tavily",
    name: "Tavily AI Search",
    description: "Search engine built specifically for autonomous AI agents with factual citations.",
    category: "Data",
    logoUrl: "https://logos.composio.dev/api/tavily",
    status: "available",
  },
  {
    id: "serpapi",
    name: "SerpApi",
    description: "Real-time Google search results, localized shopping, news snippets, and maps data.",
    category: "Data",
    logoUrl: "https://logos.composio.dev/api/serpapi",
    status: "available",
  },
  {
    id: "perplexityai",
    name: "Perplexity AI",
    description: "Online answer engine with cited research sources and multi-step inquiry reasoning.",
    category: "Data",
    logoUrl: "https://logos.composio.dev/api/perplexityai",
    status: "available",
  },
  {
    id: "pinecone",
    name: "Pinecone",
    description: "Managed serverless vector database for low-latency semantic search and RAG embeddings.",
    category: "Data",
    logoUrl: "https://logos.composio.dev/api/pinecone",
    status: "available",
  },
  {
    id: "mongodb",
    name: "MongoDB",
    description: "Document-oriented database with flexible JSON-like schemas and Atlas search indexes.",
    category: "Data",
    logoUrl: "https://logos.composio.dev/api/mongodb",
    status: "available",
  },
  {
    id: "redis",
    name: "Redis",
    description: "In-memory data structure store for caching, pub/sub queues, and rate-limiting counters.",
    category: "Data",
    logoUrl: "https://logos.composio.dev/api/redis",
    status: "available",
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    description: "Enterprise relational database with ACID transactions, JSONB, and pgvector extension.",
    category: "Data",
    logoUrl: "https://logos.composio.dev/api/postgresql",
    status: "available",
  },
  {
    id: "mysql",
    name: "MySQL",
    description: "Classic open-source SQL relational database engine for web and SaaS applications.",
    category: "Data",
    logoUrl: "https://logos.composio.dev/api/mysql",
    status: "available",
  },
  {
    id: "snowflake",
    name: "Snowflake",
    description: "Cloud data warehouse for massive analytical queries, data lakes, and business metrics.",
    category: "Data",
    logoUrl: "https://logos.composio.dev/api/snowflake",
    status: "available",
  },
  {
    id: "googlesheets",
    name: "Google Sheets",
    description: "Read, write, update rows, and compute formulas in cloud spreadsheets collaboratively.",
    category: "Data",
    logoUrl: "https://logos.composio.dev/api/googlesheets",
    status: "available",
  },
  {
    id: "airtable",
    name: "Airtable",
    description: "Low-code relational database and spreadsheet hybrid for business operations.",
    category: "Data",
    logoUrl: "https://logos.composio.dev/api/airtable",
    status: "available",
  },
  {
    id: "hubspot",
    name: "HubSpot",
    description: "Inbound CRM, sales deals tracking, marketing automation, and customer contact pipelines.",
    category: "Data",
    logoUrl: "https://logos.composio.dev/api/hubspot",
    status: "available",
  },
  {
    id: "salesforce",
    name: "Salesforce",
    description: "Enterprise CRM platform for sales pipelines, customer leads, and account contracts.",
    category: "Data",
    logoUrl: "https://logos.composio.dev/api/salesforce",
    status: "available",
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Manage subscription billings, payment intents, customer cards, and refund payouts.",
    category: "Data",
    logoUrl: "https://logos.composio.dev/api/stripe",
    status: "available",
  },
  {
    id: "shopify",
    name: "Shopify",
    description: "E-commerce store inventory, orders fulfillment, customer accounts, and webhooks.",
    category: "Data",
    logoUrl: "https://logos.composio.dev/api/shopify",
    status: "available",
  },
];

interface ConnectAppsModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetAgentId?: string;
  targetAgentName?: string;
  connectedAppIds?: string[];
  onAppConnected?: (appId: string) => void;
  onAppDisconnected?: (appId: string) => void;
}

export function ConnectAppsModal({
  isOpen,
  onClose,
  targetAgentId = "default",
  targetAgentName = "Agent",
  connectedAppIds = [],
  onAppConnected,
  onAppDisconnected,
}: ConnectAppsModalProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [loadingAppId, setLoadingAppId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  if (!isOpen) return null;

  const categories = [
    "All",
    "Password Managers",
    "Productivity",
    "Communication",
    "Code",
    "Data",
  ];

    // Realtime WebSocket event listener for instant OAuth activation
  useEffect(() => {
    const handleWsActivation = (event: Event) => {
      const customEv = event as CustomEvent;
      const detail = customEv.detail;
      if (detail && detail.app_slug) {
        const cleanSlug = detail.app_slug.toLowerCase();
        const cleanTargetAgent = targetAgentId.replace(/^bot:agent360:/, "").toLowerCase();
        const incomingAgent = (detail.agent_id || "").toLowerCase();

        if (incomingAgent === cleanTargetAgent || incomingAgent === "all" || !incomingAgent) {
          onAppConnected?.(cleanSlug);
          setFeedbackMsg({
            text: `✓ WebSocket: ${detail.message || `Đã kết nối thành công ứng dụng ${cleanSlug}!`}`,
            type: "success",
          });
        }
      }
    };

    window.addEventListener("composio:connection_activated", handleWsActivation);
    return () => {
      window.removeEventListener("composio:connection_activated", handleWsActivation);
    };
  }, [targetAgentId, onAppConnected]);

  const handleToggleApp = async (app: ConnectedAppItem) => {
    const isCurrentlyConnected = connectedAppIds.includes(app.id);
    setLoadingAppId(app.id);
    setFeedbackMsg(null);

    try {
      if (isCurrentlyConnected) {
        // Disconnect: Hot-patch DELETE from agent MCP layer
        const res = await fetch(`/api/mcp/composio_${app.id}`, {
          method: "DELETE",
          headers: {
            "X-Agent-Id": targetAgentId,
          },
        });
        if (res.ok) {
          onAppDisconnected?.(app.id);
          setFeedbackMsg({
            text: `Disconnected ${app.name} from ${targetAgentName}`,
            type: "success",
          });
        } else {
          throw new Error(`Failed to disconnect: status ${res.status}`);
        }
      } else {
        // Connect: Call Composio OAuth + Hot-patch into Agent MCP
        const connRes = await fetch("/api/integrations/composio/connect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            appSlug: app.id,
            action: "add",
            agentId: targetAgentId,
          }),
        });

        const connData = await connRes.json();
        if (!connRes.ok) {
          throw new Error(connData.error || "Integration connection failed");
        }

        // The backend /integrations/composio/connect call above already registers the MCP client on the agent
        // with the agent-scoped Composio key resolved server-side; no client-side key or second hot-patch.
        onAppConnected?.(app.id);

        if (connData.redirect_url) {
          // Open OAuth consent in new tab
          window.open(connData.redirect_url, "_blank", "noopener,noreferrer");
          setFeedbackMsg({
            text: `Opening OAuth for ${app.name}. Đang tự động theo dõi xác thực ngầm...`,
            type: "success",
          });

          // Short-term auto-poll worker: checks every 4s for up to 3 minutes
          let attempts = 0;
          const maxAttempts = 45; // 45 * 4s = 180s = 3 minutes
          const pollInterval = setInterval(async () => {
            attempts++;
            if (attempts > maxAttempts) {
              clearInterval(pollInterval);
              return;
            }
            try {
              const statusRes = await fetch(`/api/integrations/composio/status?appSlug=${encodeURIComponent(app.id)}`, {
                headers: { "X-Agent-Id": targetAgentId }
              });
              if (statusRes.ok) {
                const statusData = await statusRes.json();
                if (statusData.status === "active") {
                  clearInterval(pollInterval);
                  setFeedbackMsg({
                    text: `✓ Xác thực OAuth ${app.name} hoàn tất thành công! Đã kích hoạt cho ${targetAgentName}.`,
                    type: "success",
                  });
                  onAppConnected?.(app.id);
                }
              }
            } catch (pollErr) {
              // silent poll retry
            }
          }, 4000);
        } else {
          setFeedbackMsg({
            text: `Successfully hot-patched ${app.name} into ${targetAgentName}`,
            type: "success",
          });
        }
      }
    } catch (err: any) {
      console.error("[ConnectApps Error]", err);
      setFeedbackMsg({
        text: err.message || "Failed to toggle application integration",
        type: "error",
      });
    } finally {
      setLoadingAppId(null);
    }
  };

  const filteredApps = APPS_CATALOG.filter((app) => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/40 dark:bg-black/80 backdrop-blur-sm backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl max-h-[85vh] bg-white dark:bg-[#121216] border border-slate-200 dark:border-[#262632] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-800 dark:text-neutral-200 font-sans transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#1f1f2a] flex items-center justify-between shrink-0 bg-[#16161c]">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-[#f8a87c]/10 border border-[#f8a87c]/20 flex items-center justify-center text-[#f8a87c]">
              <Sparkles size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-white tracking-tight">{t("connectApps.title")}</h2>
                <span className="text-[10px] font-mono bg-[#20202c] text-[#f8a87c] px-2 py-0.5 rounded-full border border-[#2b2b3c]">
                  {targetAgentName}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-neutral-400">
                Hot-patch Composio MCP tools directly into agent runtime
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 dark:text-neutral-400 font-mono bg-[#1c1c24] px-2.5 py-1 rounded-full border border-slate-200 dark:border-[#262632]">
              <Shield size={12} className="text-emerald-400" />
              <span>{connectedAppIds.length} active</span>
            </div>

            <button
              onClick={onClose}
              className="h-8 w-8 rounded-lg bg-[#1a1a22] hover:bg-[#252530] text-slate-500 dark:text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-[#242430]"
              title="Close"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Feedback Alert Banner */}
        {feedbackMsg && (
          <div
            className={`px-4 py-2 text-xs flex items-center justify-between border-b transition-all duration-200 ${
              feedbackMsg.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                : "bg-red-500/10 border-red-500/20 text-red-300"
            }`}
          >
            <span>{feedbackMsg.text}</span>
            <button
              onClick={() => setFeedbackMsg(null)}
              className="text-slate-500 dark:text-neutral-400 hover:text-white ml-2 text-xs"
            >
              ✕
            </button>
          </div>
        )}

        {/* Search Bar & Categories */}
        <div className="p-4 border-b border-[#1c1c26] space-y-3 shrink-0 bg-[#14141a]">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 60+ verified Composio tool integrations..."
              className="w-full bg-[#1b1b24] border border-[#282836] rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#f8a87c] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-slate-700 dark:text-neutral-300"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-white text-black shadow-sm"
                      : "bg-[#1d1d26] text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-[#252532] border border-[#282834]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Body: Categorized App Grid */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-[#0f0f13]">
          {displayCategories.map((category) => {
            const categoryApps = filteredApps.filter(
              (app) => app.category === category
            );
            if (categoryApps.length === 0) return null;

            return (
              <div key={category} className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-neutral-400 px-1">
                  <span>{category}</span>
                  <span className="text-[10px] font-mono text-neutral-500 font-normal">
                    {categoryApps.length} apps
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {categoryApps.map((app) => {
                    const isConnected = connectedAppIds.includes(app.id);
                    const isLoading = loadingAppId === app.id;

                    return (
                      <div
                        key={app.id}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 ${
                          isConnected
                            ? "bg-[#18221c] border-emerald-500/30"
                            : "bg-[#16161e] border-slate-200 dark:border-[#22222e] hover:border-[#2f2f42] hover:bg-[#1a1a24]"
                        }`}
                      >
                        {/* 100% Verified SVG Vector Logo */}
                        <div className="h-9 w-9 rounded-xl bg-[#20202c] border border-[#2c2c3e] flex items-center justify-center p-2 shrink-0 overflow-hidden shadow-sm">
                          <img
                            src={app.logoUrl}
                            alt={app.name}
                            className="h-full w-full object-contain filter drop-shadow-sm"
                            loading="lazy"
                            onError={(e) => {
                              const target = e.currentTarget;
                              target.style.display = "none";
                              if (target.parentElement) {
                                target.parentElement.className =
                                  "h-9 w-9 rounded-xl bg-neutral-800 text-white flex items-center justify-center text-xs font-bold";
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
                          <p className="text-[11px] text-slate-500 dark:text-neutral-400 truncate mt-0.5 leading-snug">
                            {app.description}
                          </p>
                        </div>

                        {/* Action Button: Connect / Add */}
                        <button
                          disabled={isLoading}
                          onClick={() => handleToggleApp(app)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                            isLoading
                              ? "opacity-60 cursor-not-allowed bg-neutral-800 text-slate-500 dark:text-neutral-400"
                              : isConnected
                              ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25"
                              : "bg-[#252534] hover:bg-white hover:text-black text-slate-800 dark:text-neutral-200 border border-[#323246]"
                          }`}
                        >
                          {isLoading ? (
                            <Loader2 size={12} className="animate-spin text-slate-700 dark:text-neutral-300" />
                          ) : isConnected ? (
                            <>
                              <Check size={12} className="text-emerald-400" />
                              <span>{t("connectApps.connected")}</span>
                            </>
                          ) : (
                            <span>{t("connectApps.add")}</span>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {filteredApps.length === 0 && (
            <div className="py-12 text-center text-xs text-neutral-500 font-mono space-y-2">
              <Layers size={22} className="mx-auto text-neutral-600 mb-1" />
              <div>No applications found matching "{searchQuery}".</div>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="text-[#f8a87c] hover:underline"
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
