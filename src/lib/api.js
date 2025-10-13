export const API_BASE = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE) {
  // Warn at runtime in development if the env var is not set. Prefer fail-fast
  // behavior for production by configuring the environment properly.
  if (typeof window !== "undefined") {
    // client-side runtime
    console.warn(
      "NEXT_PUBLIC_API_URL is not set. API requests may fail. Set NEXT_PUBLIC_API_URL in .env.local"
    );
  } else {
    // server-side runtime
    console.warn(
      "NEXT_PUBLIC_API_URL is not set. API requests from the server may fail."
    );
  }
}

function buildUrl(path) {
  if (path.startsWith("http")) return path;
  if (!API_BASE) return path; // fall back to relative path if no base defined
  return `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
}

export async function postJson(path, data) {
  const url = buildUrl(path);
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return res;
}

export async function getJson(path) {
  const url = buildUrl(path);
  const res = await fetch(url, { credentials: "include" });
  return res;
}

export async function postFormData(path, formData) {
  const url = buildUrl(path);
  const res = await fetch(url, {
    method: "POST",
    // Important: don't set Content-Type, browser will set boundary automatically
    credentials: "include",
    body: formData,
  });
  return res;
}

// export helper for other modules that need to build absolute URLs
export { buildUrl };
