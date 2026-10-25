export interface UploadedFileResult {
  url: string;
  file_name: string;
  size: number;
  mime_type?: string;
  preview_url?: string;
}

export function resolveUploadedAttachmentPreviewUrl(urlOrPath: string, agentId: string = "default", explicitPreviewUrl?: string): string {
  if (explicitPreviewUrl) return explicitPreviewUrl;
  if (!urlOrPath) return "";
  if (/^(https?:|data:|blob:)/i.test(urlOrPath)) return urlOrPath;
  if (urlOrPath.startsWith("/api/")) return urlOrPath;

  const cleanAgent = (agentId || "default").replace(/^bot:agent360:/i, "") || "default";
  const normalized = urlOrPath.replace(/\\/g, "/");

  // Match QwenPaw workspace media path: /app/working/workspaces/<agent>/media/<filename>
  const mediaMatch = normalized.match(/\/workspaces\/([^/]+)\/media\/([^/?#]+)$/i) || normalized.match(/(?:^|\/)media\/([^/?#]+)$/i);
  if (mediaMatch) {
    const fileAgent = mediaMatch.length > 2 ? mediaMatch[1] : cleanAgent;
    const fileName = mediaMatch.length > 2 ? mediaMatch[2] : mediaMatch[1];
    return `/api/agents/${encodeURIComponent(fileAgent)}/console/files/${encodeURIComponent(fileName)}`;
  }

  // Match virtual://workspace/uploads/<fileId>/<filename>
  const virtualMatch = normalized.match(/^virtual:\/\/workspace\/uploads\/(upl_[a-zA-Z0-9]+)\/([^/?#]+)$/i);
  if (virtualMatch) {
    return `/api/agents/${encodeURIComponent(cleanAgent)}/console/files/${encodeURIComponent(`${virtualMatch[1]}_${virtualMatch[2]}`)}`;
  }

  const fallbackName = normalized.split("/").filter(Boolean).pop();
  if (fallbackName) {
    return `/api/agents/${encodeURIComponent(cleanAgent)}/console/files/${encodeURIComponent(fallbackName)}`;
  }
  return urlOrPath;
}

export async function uploadFileToGateway(file: File, agentId: string = "default"): Promise<UploadedFileResult> {
  const formData = new FormData();
  formData.append("file", file);

  const cleanAgent = (agentId || "default").replace(/^bot:agent360:/, "");

  let res = await fetch("/api/agents/console/upload", {
    method: "POST",
    headers: {
      "X-Agent-Id": cleanAgent,
    },
    body: formData,
  });

  if (res.status === 404) {
    const fallbackData = new FormData();
    fallbackData.append("file", file);
    res = await fetch("/api/console/upload", {
      method: "POST",
      headers: {
        "X-Agent-Id": cleanAgent,
      },
      body: fallbackData,
    });
  }

  if (!res.ok) {
    const errorJson = await res.json().catch(() => null);
    throw new Error(errorJson?.detail || errorJson?.error || `Upload failed: ${res.statusText}`);
  }

  const data = await res.json();
  const rawUrl = data.url || data.virtual_uri || data.virtualUri || "";
  const fileName = data.file_name || data.filename || data.fileName || file.name;
  const previewUrl = resolveUploadedAttachmentPreviewUrl(rawUrl, cleanAgent, data.preview_url || data.previewUrl);

  return {
    url: rawUrl,
    file_name: fileName,
    size: typeof data.size === "number" ? data.size : (typeof data.size_bytes === "number" ? data.size_bytes : file.size),
    mime_type: data.mime_type || data.content_type || data.contentType || file.type || "application/octet-stream",
    preview_url: previewUrl,
  };
}
