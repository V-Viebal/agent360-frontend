export interface UploadedFileResult {
  url: string;
  file_name: string;
  size: number;
  mime_type?: string;
  preview_url?: string;
}

export type AttachmentFormatKind = "image" | "video" | "audio" | "pdf" | "spreadsheet" | "document" | "code" | "data" | "archive" | "file";

export function classifyAttachmentFormat(fileNameOrUrl: string): { kind: AttachmentFormatKind; ext: string; badgeColor: string } {
  const clean = (fileNameOrUrl || "").split("?")[0].split("#")[0].replace(/\\/g, "/");
  const base = clean.split("/").pop() || "";
  const ext = (base.includes(".") ? base.split(".").pop() || "FILE" : "FILE").toUpperCase().slice(0, 6);

  if (/^(PNG|JPE?G|WEBP|GIF|SVG|BMP|ICO|AVIF)$/i.test(ext)) {
    return { kind: "image", ext, badgeColor: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30" };
  }
  if (/^(MP4|WEBM|MOV|AVI|MKV)$/i.test(ext)) {
    return { kind: "video", ext, badgeColor: "bg-purple-500/15 text-purple-400 border-purple-500/30" };
  }
  if (/^(MP3|WAV|OGG|M4A|AAC|FLAC)$/i.test(ext)) {
    return { kind: "audio", ext, badgeColor: "bg-pink-500/15 text-pink-400 border-pink-500/30" };
  }
  if (ext === "PDF") {
    return { kind: "pdf", ext, badgeColor: "bg-rose-500/15 text-rose-500 border-rose-500/30" };
  }
  if (/^(XLSX|XLS|XLSM|CSV|TSV)$/i.test(ext)) {
    return { kind: "spreadsheet", ext, badgeColor: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" };
  }
  if (/^(DOCX|DOC|PPTX|PPT|RTF|ODT)$/i.test(ext)) {
    return { kind: "document", ext, badgeColor: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30" };
  }
  if (/^(PY|TS|TSX|JS|JSX|CS|GO|RS|JAVA|CPP|C|H|SH|SQL|HTML|HTM|CSS|SCSS|MD|MDX)$/i.test(ext)) {
    return { kind: "code", ext, badgeColor: "bg-amber-500/15 text-amber-600 dark:text-[#f8a87c] border-amber-500/30" };
  }
  if (/^(JSON|YAML|YML|XML|TOML|INI|LOG|TXT)$/i.test(ext)) {
    return { kind: "data", ext, badgeColor: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30" };
  }
  if (/^(ZIP|RAR|7Z|TAR|GZ|TGZ)$/i.test(ext)) {
    return { kind: "archive", ext, badgeColor: "bg-violet-500/15 text-violet-500 border-violet-500/30" };
  }
  return { kind: "file", ext, badgeColor: "bg-[#f8a87c]/15 text-[#e0682b] dark:text-[#f8a87c] border-[#f8a87c]/30" };
}

export function resolveUploadedAttachmentPreviewUrl(urlOrPath: string, agentId: string = "default", explicitPreviewUrl?: string): string {
  if (explicitPreviewUrl) return explicitPreviewUrl;
  if (!urlOrPath) return "";
  const trimmed = urlOrPath.trim().replace(/^file:\/\/+/, "/");
  if (/^(https?:|data:|blob:)/i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("/api/")) return trimmed;

  const cleanAgent = (agentId || "default").replace(/^bot:agent360:/i, "") || "default";
  const normalized = trimmed.replace(/\\/g, "/");

  // Match QwenPaw workspace path: /app/working/workspaces/<agent>/media/<relpath> or /app/working/workspaces/<agent>/<relpath>
  const wsMediaMatch = normalized.match(/\/workspaces\/([^/]+)\/media\/(.+)$/i);
  if (wsMediaMatch) {
    const fileAgent = wsMediaMatch[1];
    const relPath = wsMediaMatch[2].split("/").map(encodeURIComponent).join("/");
    return `/api/agents/${encodeURIComponent(fileAgent)}/console/files/${relPath}`;
  }

  const wsAnyMatch = normalized.match(/\/workspaces\/([^/]+)\/(.+)$/i);
  if (wsAnyMatch) {
    const fileAgent = wsAnyMatch[1];
    const relPath = wsAnyMatch[2].split("/").map(encodeURIComponent).join("/");
    return `/api/agents/${encodeURIComponent(fileAgent)}/console/files/${relPath}`;
  }

  const relMediaMatch = normalized.match(/^(?:\/)?media\/(.+)$/i);
  if (relMediaMatch) {
    const relPath = relMediaMatch[1].split("/").map(encodeURIComponent).join("/");
    return `/api/agents/${encodeURIComponent(cleanAgent)}/console/files/${relPath}`;
  }

  // Match virtual://workspace/uploads/<fileId>/<filename>
  const virtualMatch = normalized.match(/^virtual:\/\/workspace\/uploads\/(upl_[a-zA-Z0-9]+)\/([^/?#]+)$/i);
  if (virtualMatch) {
    return `/api/agents/${encodeURIComponent(cleanAgent)}/console/files/${encodeURIComponent(`${virtualMatch[1]}_${virtualMatch[2]}`)}`;
  }

  // Preserve relative path if file is inside a relative workspace subfolder (e.g., .tmp/zeroism-slide/file.pdf)
  if (!normalized.startsWith("/") && normalized.includes("/")) {
    const relParts = normalized.split("/").map(encodeURIComponent).join("/");
    return `/api/agents/${encodeURIComponent(cleanAgent)}/console/files/${relParts}`;
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
