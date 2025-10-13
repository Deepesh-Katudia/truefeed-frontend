import fetcher from "./fetcher";
import {
  API_POSTS,
  API_POSTS_MINE,
  API_POSTS_UPLOAD_MEDIA,
  API_POSTS_CREATE_WITH_MEDIA,
} from "@/lib/paths";
import { postFormData } from "@/lib/api";

export async function createPost({ content, mediaUrl }) {
  return fetcher.rawPost(API_POSTS, { content, mediaUrl }).then((r) => {
    if (!r.ok)
      return {
        ok: false,
        error: r.data || { message: "Failed to create post" },
      };
    return { ok: true, data: r.data };
  });
}

export async function listMyPosts() {
  return fetcher.rawGet(API_POSTS_MINE).then((r) => {
    if (!r.ok)
      return {
        ok: false,
        error: r.data || { message: "Failed to fetch posts" },
      };
    return { ok: true, data: r.data };
  });
}

export async function uploadMedia(file) {
  const fd = new FormData();
  fd.append("media", file);
  const res = await postFormData(API_POSTS_UPLOAD_MEDIA, fd);
  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await res.json()
    : await res.text();
  return { ok: res.ok, data };
}

export async function createWithMedia({ content, file }) {
  const fd = new FormData();
  if (file) fd.append("media", file);
  if (content) fd.append("content", content);
  const res = await postFormData(API_POSTS_CREATE_WITH_MEDIA, fd);
  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await res.json()
    : await res.text();
  return { ok: res.ok, data };
}

const _default = { createPost, listMyPosts, uploadMedia, createWithMedia };
export default _default;
