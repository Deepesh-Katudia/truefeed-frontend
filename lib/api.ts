const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const TOKEN_KEY = "truefeed_token";

function getToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(TOKEN_KEY) || "";
}

function setToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

function clearToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
}

// Generic fetch wrapper
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  const token = getToken();

  const headers: Record<string, string> = {};
  new Headers(options.headers).forEach((value, key) => {
    headers[key] = value;
  });

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    cache: "no-store",
    headers,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || error.message || "Something went wrong");
  }

  return response.json();
}

// Auth APIs
export const authAPI = {
  register: async (email: string, password: string, name?: string) => {
    const data = await fetchAPI("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    });
    if (data?.token) setToken(data.token);
    return data;
  },

  login: async (email: string, password: string) => {
    const data = await fetchAPI("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (data?.token) setToken(data.token);
    return data;
  },

  logout: async () => {
    // optional server call, but not required for JWT
    try {
      await fetchAPI("/api/v1/auth/logout", { method: "POST" });
    } catch {}
    clearToken();
    return { message: "Logged out" };
  },

  getProfile: () => fetchAPI("/api/v1/profile"),
};

// Profile APIs
export const profileAPI = {
  getProfile: () => fetchAPI("/api/v1/profile"),

  updateProfile: (data: {
    description?: string;
    phone?: string;
    phoneNumber?: string;
    name?: string;
  }) =>
    fetchAPI("/api/v1/profile/update", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  uploadPicture: async (file: File) => {
    const formData = new FormData();
    formData.append("picture", file);

    const token = getToken();
    const response = await fetch(`${API_URL}/api/v1/profile/upload-picture`, {
      method: "POST",
      cache: "no-store",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Upload failed" }));
      throw new Error(error.error || "Upload failed");
    }

    return response.json();
  },

  updateWithPicture: async (data: {
    description?: string;
    phone?: string;
    name?: string;
    picture?: File;
  }) => {
    const formData = new FormData();
    if (data.picture) formData.append("picture", data.picture);
    if (data.description) formData.append("description", data.description);
    if (data.phone) formData.append("phone", data.phone);
    if (data.name) formData.append("name", data.name);

    const token = getToken();
    const response = await fetch(`${API_URL}/api/v1/profile/update-with-picture`, {
      method: "POST",
      cache: "no-store",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Update failed" }));
      throw new Error(error.error || "Update failed");
    }

    return response.json();
  },
};

// Post APIs
export const postAPI = {
  getMyPosts: () => fetchAPI("/api/v1/posts/mine"),

  createPost: (
    content?: string,
    mediaUrl?: string,
    ai?: {
      fact_check_status?: string;
      credibility_score?: number;
      summary?: string;
    }
  ) =>
    fetchAPI("/api/v1/posts", {
      method: "POST",
      body: JSON.stringify({ content, mediaUrl, ai }),
    }),

  uploadMedia: async (file: File) => {
    const formData = new FormData();
    formData.append("media", file);

    const token = getToken();
    const response = await fetch(`${API_URL}/api/v1/posts/upload-media`, {
      method: "POST",
      cache: "no-store",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Upload failed" }));
      throw new Error(error.error || "Upload failed");
    }

    return response.json();
  },

  createWithMedia: async (
    content?: string,
    media?: File,
    ai?: {
      fact_check_status?: string;
      credibility_score?: number;
      summary?: string;
    }
  ) => {
    const formData = new FormData();
    if (content) formData.append("content", content);
    if (media) formData.append("media", media);
    if (ai) formData.append("ai", JSON.stringify(ai));

    const token = getToken();
    const response = await fetch(`${API_URL}/api/v1/posts/create-with-media`, {
      method: "POST",
      cache: "no-store",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Failed to create post" }));
      throw new Error(error.error || "Failed to create post");
    }

    return response.json();
  },

  like: (postId: string) => fetchAPI(`/api/v1/posts/${postId}/like`, { method: "POST" }),
  unlike: (postId: string) => fetchAPI(`/api/v1/posts/${postId}/unlike`, { method: "POST" }),
  comment: (postId: string, text: string) =>
    fetchAPI(`/api/v1/posts/${postId}/comment`, {
      method: "POST",
      body: JSON.stringify({ text }),
    }),
  deleteComment: (postId: string, commentId: string) =>
    fetchAPI(`/api/v1/posts/${postId}/comment/${commentId}`, { method: "DELETE" }),
};

// AI APIs
export const aiAPI = {
  generate: () => fetchAPI("/api/v1/gemini/generate"),

  checkCredibility: (text: string) =>
    fetchAPI("/api/v1/gemini/check", {
      method: "POST",
      body: JSON.stringify({ checkFor: text }),
    }),
};

// File URL helper
export function getFileUrl(fileId: string): string {
  return `${API_URL}/api/v1/files/${fileId}`;
}

export function toAbsoluteUrl(url?: string): string {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("/")) return `${API_URL}${url}`;
  return url;
}

// Friends APIs
export const friendsAPI = {
  search: (q: string, limit = 10) =>
    fetchAPI(`/api/v1/friends/search?q=${encodeURIComponent(q)}&limit=${limit}`),
  incoming: () => fetchAPI("/api/v1/friends/incoming"),
  request: (targetUserId: string) =>
    fetchAPI("/api/v1/friends/request", {
      method: "POST",
      body: JSON.stringify({ targetUserId }),
    }),
  accept: (senderUserId: string) =>
    fetchAPI("/api/v1/friends/accept", {
      method: "POST",
      body: JSON.stringify({ senderUserId }),
    }),
  decline: (senderUserId: string) =>
    fetchAPI("/api/v1/friends/decline", {
      method: "POST",
      body: JSON.stringify({ senderUserId }),
    }),
};

export const usersAPI = {
  get: (id: string) => fetchAPI(`/api/v1/users/${id}`),
  posts: (id: string) => fetchAPI(`/api/v1/users/${id}/posts`),
};

export const storiesAPI = {
  feed: () => fetchAPI("/api/v1/stories/feed"),
  create: (payload: { text?: string; mediaUrl?: string }) =>
    fetchAPI("/api/v1/stories", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  uploadMedia: (file: File) => {
    const fd = new FormData();
    fd.append("media", file);
    return fetchAPI("/api/v1/stories/upload-media", { method: "POST", body: fd });
  },
  markViewed: (id: string) => fetchAPI(`/api/v1/stories/${id}/view`, { method: "POST" }),
};
