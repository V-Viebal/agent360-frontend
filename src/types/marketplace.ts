export type AgentDepartment =
  | "All"
  | "Executive & Ops"
  | "Finance & Accounting"
  | "Sales & BizDev"
  | "Customer Support & Success"
  | "Marketing & Creative"
  | "HR & People"
  | "Legal & Compliance"
  | "Engineering & Tech";

export type GeometricShape =
  | "squircle"
  | "hex"
  | "dome"
  | "capsule"
  | "crystal"
  | "blob"
  | "wedge"
  | "tablet";

export type AgentColor =
  | "orange"
  | "blue"
  | "emerald"
  | "purple"
  | "rose"
  | "amber"
  | "cyan";

export interface AgentTeamConfig {
  collaborationMode: "Autonomous AI Team" | "Sequential Pipeline" | "Hierarchical Orchestrator";
  leadAgent?: string;
  teammateRoles: string[];
  expectedOutput: string;
}

export interface AgentMarketplaceItem {
  id: string;
  name: string;
  roleTitle: string;
  creatorName: string;
  handle: string;
  verified: boolean;
  department: Exclude<AgentDepartment, "All">;
  categories: string[];
  summary: string;
  description: string;
  goal: string;
  backstory: string;
  color: AgentColor;
  shape: GeometricShape;
  tools: string[];
  routines: string[];
  integrations: string[];
  installCount: number;
  memoryType: "ReMe Markdown" | "Vector Embeddings" | "Persistent SQLite";
  authorityGate: "Human-in-the-loop" | "Sandboxed Auto" | "Fail-closed Readback";
  samplePrompt: string;
  teamConfig: AgentTeamConfig;
  terminalPreview: string[];
}
