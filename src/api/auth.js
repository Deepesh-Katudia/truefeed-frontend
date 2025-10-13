import fetcher from "./fetcher";
import {
  API_AUTH_LOGIN,
  API_AUTH_REGISTER,
  API_AUTH_LOGOUT,
} from "@/lib/paths";

export async function login({ email, password }) {
  return fetcher.rawPost(API_AUTH_LOGIN, { email, password }).then((r) => {
    if (!r.ok)
      return { ok: false, error: r.data || { message: "Login failed" } };
    return { ok: true, data: r.data };
  });
}

export async function register(payload) {
  return fetcher.rawPost(API_AUTH_REGISTER, payload).then((r) => {
    if (!r.ok)
      return { ok: false, error: r.data || { message: "Register failed" } };
    return { ok: true, data: r.data };
  });
}

export async function logout() {
  return fetcher.rawPost(API_AUTH_LOGOUT, {}).then((r) => {
    if (!r.ok)
      return { ok: false, error: r.data || { message: "Logout failed" } };
    return { ok: true };
  });
}

const _default = { login, register, logout };
export default _default;
