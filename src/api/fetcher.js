import { getJson as libGetJson, postJson as libPostJson } from "@/lib/api";

// Low-level fetcher that normalizes responses. Uses the existing buildUrl
// and getJson/postJson helpers so it respects NEXT_PUBLIC_API_URL.

async function parseJsonResponse(res) {
  const contentType = res.headers.get("content-type") || "";
  if (res.status === 204) return { ok: true, data: null };
  if (contentType.includes("application/json")) {
    const json = await res.json();
    return { ok: res.ok, data: json, status: res.status };
  }
  // fallback to text
  const text = await res.text();
  return { ok: res.ok, data: text, status: res.status };
}

export async function rawGet(path) {
  const res = await libGetJson(path);
  return parseJsonResponse(res);
}

export async function rawPost(path, body) {
  const res = await libPostJson(path, body);
  return parseJsonResponse(res);
}

// convenience wrapper to redirect on 401 (caller still receives result)
export async function fetchWithAuthGuard(getter) {
  try {
    const result = await getter();
    return result;
  } catch (err) {
    // network error or similar
    return { ok: false, error: { message: err.message || String(err) } };
  }
}

const _default = { rawGet, rawPost, fetchWithAuthGuard };
export default _default;
