import fetcher from "./fetcher";
import {
  API_PROFILE,
  API_PROFILE_UPDATE,
  API_PROFILE_UPLOAD_PICTURE,
  API_PROFILE_UPDATE_WITH_PICTURE,
} from "@/lib/paths";
import { postFormData } from "@/lib/api";

export async function getProfile() {
  return fetcher.rawGet(API_PROFILE).then((r) => {
    if (!r.ok)
      return {
        ok: false,
        error: r.data || { message: "Failed to fetch profile" },
      };
    return { ok: true, data: r.data };
  });
}

export async function updateProfile(payload) {
  return fetcher.rawPost(API_PROFILE_UPDATE, payload).then((r) => {
    if (!r.ok)
      return {
        ok: false,
        error: r.data || { message: "Failed to update profile" },
      };
    return { ok: true, data: r.data };
  });
}

export async function uploadPicture(file) {
  const fd = new FormData();
  fd.append("picture", file);
  const res = await postFormData(API_PROFILE_UPLOAD_PICTURE, fd);
  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await res.json()
    : await res.text();
  return { ok: res.ok, data };
}

export async function updateWithPicture({ file, description, phone }) {
  const fd = new FormData();
  if (file) fd.append("picture", file);
  if (description) fd.append("description", description);
  if (phone) fd.append("phone", phone);
  const res = await postFormData(API_PROFILE_UPDATE_WITH_PICTURE, fd);
  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await res.json()
    : await res.text();
  return { ok: res.ok, data };
}

const _default = {
  getProfile,
  updateProfile,
  uploadPicture,
  updateWithPicture,
};
export default _default;
