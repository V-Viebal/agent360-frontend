export interface UploadedFileResult {
  file_id: string;
  filename: string;
  virtual_uri: string;
  size_bytes: number;
  content_type: string;
  uploaded_at: string;
}

export async function uploadFileToGateway(file: File): Promise<UploadedFileResult> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/v1/agents/console/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => null);
    throw new Error(errorJson?.error || `Upload failed: ${res.statusText}`);
  }

  return await res.json();
}
