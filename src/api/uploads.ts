// src/api/uploads.ts
import apiClient from "./axios";

/**
 * Request presigned URL (PUT upload)
 * Returns { ok: true, data: { url } }
 */
export async function getPresignedUrl(fileName: string, fileType: string) {
  const resp = await apiClient.post("/uploads/presigned", { fileName, fileType });
  return resp.data.data;
}

/**
 * Uploads a Blob/File/Uint8Array to the presigned URL using PUT.
 * - presigned.url is expected to be a fully signed PUT URL.
 * - returns response.ok boolean (true when 200-204).
 */
export async function uploadToPresignedUrl(presignedUrl: string, file: Blob | File, fileType?: string) {
  const headers: Record<string, string> = {};
  if (fileType) headers["Content-Type"] = fileType;

  const resp = await fetch(presignedUrl, {
    method: "PUT",
    headers,
    body: file,
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    throw new Error(`Upload failed: ${resp.status} ${resp.statusText} ${text}`);
  }

  // The uploaded object will be available at the presigned URL without query params
  // Strip query params to get the object URL
  const url = presignedUrl.split("?")[0];
  return { url };
}
