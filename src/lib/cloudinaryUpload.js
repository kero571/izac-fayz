"use client";
// Upload a file straight from the browser to Cloudinary using a signature from /api/cloudinary/sign.

const LIMITS = { image: 10, video: 100, raw: 10 }; // MB

export async function authedFetch(token, url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: { ...(options.body ? { "Content-Type": "application/json" } : {}), Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

export async function uploadToCloudinary({ file, resourceType, folder, token, onProgress }) {
  if (file.size > LIMITS[resourceType] * 1024 * 1024) throw new Error(`File is larger than ${LIMITS[resourceType]}MB`);
  const sig = await authedFetch(token, "/api/cloudinary/sign", { method: "POST", body: JSON.stringify({ resourceType, folder }) });

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", sig.apiKey);
  form.append("timestamp", sig.timestamp);
  form.append("folder", sig.folder);
  form.append("signature", sig.signature);

  const result = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${sig.cloudName}/${resourceType}/upload`);
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress?.(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => {
      try {
        const body = JSON.parse(xhr.responseText);
        xhr.status < 300 ? resolve(body) : reject(new Error(body.error?.message || "Upload failed"));
      } catch {
        reject(new Error("Upload failed"));
      }
    };
    xhr.onerror = () => reject(new Error("Network error"));
    xhr.send(form);
  });

  return {
    provider: "cloudinary",
    type: resourceType,
    publicId: result.public_id,
    url: result.secure_url,
    width: result.width,
    height: result.height,
  };
}
