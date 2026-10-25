
export interface UploadedFileResult {
  url: string;
  file_name: string;
  size: number;
  mime_type?: string;
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
  return {
    url: data.url || data.virtual_uri || data.virtualUri || "",
    file_name: data.file_name || data.filename || data.fileName || file.name,
    size: typeof data.size === "number" ? data.size : (typeof data.size_bytes === "number" ? data.size_bytes : file.size),
    mime_type: data.mime_type || data.content_type || data.contentType || file.type || "application/octet-stream",
  };
}
