// Centralized frontend path and endpoint configuration.
// Values are read from NEXT_PUBLIC_* env variables so nothing is hardcoded
// across the UI. Update `.env.local` from `.env.example` to set these.

export const API_PROFILE =
  process.env.NEXT_PUBLIC_API_PROFILE || "/api/v1/profile";
export const API_AUTH_LOGIN =
  process.env.NEXT_PUBLIC_API_AUTH_LOGIN || "/api/v1/auth/login";
export const API_AUTH_REGISTER =
  process.env.NEXT_PUBLIC_API_AUTH_REGISTER || "/api/v1/auth/register";
export const API_AUTH_LOGOUT =
  process.env.NEXT_PUBLIC_API_AUTH_LOGOUT || "/api/v1/auth/logout";
export const API_LOGS = process.env.NEXT_PUBLIC_API_LOGS || "/api/v1/logs";

export const ROUTE_PROFILE =
  process.env.NEXT_PUBLIC_ROUTE_PROFILE || "/profile";
export const ROUTE_LOGIN = process.env.NEXT_PUBLIC_ROUTE_LOGIN || "/login";
export const ROUTE_REGISTER =
  process.env.NEXT_PUBLIC_ROUTE_REGISTER || "/register";
