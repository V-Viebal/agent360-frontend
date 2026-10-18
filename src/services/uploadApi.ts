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

  const res = await fetch("/api/console/upload", {
    method: "POST",
    headers: {
      "X-Agent-Id": cleanAgent,
    },
    body: formData,
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => null);
    throw new Error(errorJson?.detail || errorJson?.error || `Upload failed: ${res.statusText}`);
  }

  return await res.json();
}
