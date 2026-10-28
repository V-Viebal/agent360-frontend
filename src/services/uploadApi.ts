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

  const cleanAgent = (agentId || "default").replace(/^bot:agent360:/i, "") || "default";
  const normalized = trimmed.replace(/\\/g, "/");

  // Route directly to Agent360's ACL-verified file-download endpoint: /api/v1/agents/{agent}/workspace/file-download?path=...&inline=true
  // 1. QwenPaw absolute workspace path: /app/working/workspaces/<agent>/media/<relpath> or /app/working/workspaces/<agent>/<relpath>
  const wsMediaMatch = normalized.match(/\/workspaces\/([^/]+)\/media\/(.+)$/i);
  if (wsMediaMatch) {
    const fileAgent = wsMediaMatch[1];
    const relPath = `media/${wsMediaMatch[2]}`;
    return `/api/v1/agents/${encodeURIComponent(fileAgent)}/workspace/file-download?path=${encodeURIComponent(relPath)}&inline=true`;
  }

  const wsAnyMatch = normalized.match(/\/workspaces\/([^/]+)\/(.+)$/i);
  if (wsAnyMatch) {
    const fileAgent = wsAnyMatch[1];
    const relPath = wsAnyMatch[2];
    return `/api/v1/agents/${encodeURIComponent(fileAgent)}/workspace/file-download?path=${encodeURIComponent(relPath)}&inline=true`;
  }

  // 2. Relative media path: media/<filename>
  const relMediaMatch = normalized.match(/^(?:\/)?media\/(.+)$/i);
  if (relMediaMatch) {
    const relPath = `media/${relMediaMatch[1]}`;
    return `/api/v1/agents/${encodeURIComponent(cleanAgent)}/workspace/file-download?path=${encodeURIComponent(relPath)}&inline=true`;
  }

  // 3. Virtual workspace upload: virtual://workspace/uploads/<fileId>/<filename>
  const virtualMatch = normalized.match(/^virtual:\/\/workspace\/uploads\/(upl_[a-zA-Z0-9]+)\/([^/?#]+)$/i);
  if (virtualMatch) {
    const relPath = `.tmp/agent360-uploads/${virtualMatch[1]}_${virtualMatch[2]}`;
    return `/api/v1/agents/${encodeURIComponent(cleanAgent)}/workspace/file-download?path=${encodeURIComponent(relPath)}&inline=true`;
  }

  // 4. Relative subfolder path (e.g. .tmp/zeroism-slide/file.pdf)
  if (!normalized.startsWith("/") && normalized.includes("/")) {
    return `/api/v1/agents/${encodeURIComponent(cleanAgent)}/workspace/file-download?path=${encodeURIComponent(normalized)}&inline=true`;
  }

  // 5. Bare filename fallback (default to media/<filename>)
  const fallbackName = normalized.split("/").filter(Boolean).pop();
  if (fallbackName) {
    const relPath = `media/${fallbackName}`;
    return `/api/v1/agents/${encodeURIComponent(cleanAgent)}/workspace/file-download?path=${encodeURIComponent(relPath)}&inline=true`;
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
