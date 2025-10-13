import fetcher from "./fetcher";
import { API_PROFILE } from "@/lib/paths";

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
  return fetcher.rawPost(API_PROFILE, payload).then((r) => {
    if (!r.ok)
      return {
        ok: false,
        error: r.data || { message: "Failed to update profile" },
      };
    return { ok: true, data: r.data };
  });
}

const _default = { getProfile, updateProfile };
export default _default;
