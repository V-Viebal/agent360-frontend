export interface InfraNodeInstance {
  instance_id: string;
  node_name: string;
  node_ip: string;
  role: string;
  status: "ready" | "provisioning" | "degraded";
  cluster_id: string;
  runtime_type: string;
  endpoint_url: string;
  active_agents_count: number;
  total_agents_count: number;
  agents: string[];
  last_heartbeat: string;
  health: "healthy" | "unhealthy" | "warning";
}

export interface BotDeploymentInstance {
  deployment_id: string;
  bot_id: string;
  bot_slug: string;
  environment: "development" | "staging" | "production";
  cluster_id: string;
  runtime_type: string;
  runtime_id: string;
  target_node: string;
  endpoint_url: string;
  kernel_version: string;
  status: string;
  is_active: boolean;
  updated_at: string;
}
