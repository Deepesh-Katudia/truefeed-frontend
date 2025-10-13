// Centralized frontend path and endpoint configuration.
// Values are read from NEXT_PUBLIC_* env variables so nothing is hardcoded
// across the UI. Update `.env.local` from `.env.example` to set these.

export const API_PROFILE =
  process.env.NEXT_PUBLIC_API_PROFILE || "/api/v1/profile";
export const API_PROFILE_UPDATE =
  process.env.NEXT_PUBLIC_API_PROFILE_UPDATE || "/api/v1/profile/update";
export const API_PROFILE_UPLOAD_PICTURE =
  process.env.NEXT_PUBLIC_API_PROFILE_UPLOAD_PICTURE ||
  "/api/v1/profile/upload-picture";
export const API_PROFILE_UPDATE_WITH_PICTURE =
  process.env.NEXT_PUBLIC_API_PROFILE_UPDATE_WITH_PICTURE ||
  "/api/v1/profile/update-with-picture";
export const API_AUTH_LOGIN =
  process.env.NEXT_PUBLIC_API_AUTH_LOGIN || "/api/v1/auth/login";
export const API_AUTH_REGISTER =
  process.env.NEXT_PUBLIC_API_AUTH_REGISTER || "/api/v1/auth/register";
export const API_AUTH_LOGOUT =
  process.env.NEXT_PUBLIC_API_AUTH_LOGOUT || "/api/v1/auth/logout";
export const API_LOGS = process.env.NEXT_PUBLIC_API_LOGS || "/api/v1/logs";

// Posts
export const API_POSTS = process.env.NEXT_PUBLIC_API_POSTS || "/api/v1/posts";
export const API_POSTS_MINE =
  process.env.NEXT_PUBLIC_API_POSTS_MINE || "/api/v1/posts/mine";
export const API_POSTS_UPLOAD_MEDIA =
  process.env.NEXT_PUBLIC_API_POSTS_UPLOAD_MEDIA ||
  "/api/v1/posts/upload-media";
export const API_POSTS_CREATE_WITH_MEDIA =
  process.env.NEXT_PUBLIC_API_POSTS_CREATE_WITH_MEDIA ||
  "/api/v1/posts/create-with-media";

// Files (GridFS streaming)
export const API_FILES = process.env.NEXT_PUBLIC_API_FILES || "/api/v1/files";

export const ROUTE_PROFILE =
  process.env.NEXT_PUBLIC_ROUTE_PROFILE || "/profile";
export const ROUTE_LOGIN = process.env.NEXT_PUBLIC_ROUTE_LOGIN || "/login";
export const ROUTE_REGISTER =
  process.env.NEXT_PUBLIC_ROUTE_REGISTER || "/register";
export const ROUTE_SETTINGS =
  process.env.NEXT_PUBLIC_ROUTE_SETTINGS || "/settings";
