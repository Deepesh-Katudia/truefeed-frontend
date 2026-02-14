const API_URL =
  process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === "production" ? "" : "http://localhost:4000");


// Generic fetch wrapper
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    cache: 'no-store', // IMPORTANT
    headers: isFormData
      ? { ...(options.headers || {}) }
      : { 'Content-Type': 'application/json', ...(options.headers || {}) },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || error.message || 'Something went wrong');
  }

  return response.json();
}

// Auth APIs
export const authAPI = {
  register: (email: string, password: string, name?: string) =>
    fetchAPI('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    }),

  login: (email: string, password: string) =>
    fetchAPI('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  logout: () => fetchAPI('/api/v1/auth/logout', { method: 'POST' }),

  getProfile: () => fetchAPI('/api/v1/profile'),
};

// Profile APIs
export const profileAPI = {
  getProfile: () => fetchAPI('/api/v1/profile'),

  updateProfile: (data: { description?: string; phone?: string; name?: string }) =>
    fetchAPI('/api/v1/profile/update', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  uploadPicture: async (file: File) => {
    const formData = new FormData();
    formData.append('picture', file);

    const response = await fetch(`${API_URL}/api/v1/profile/upload-picture`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(error.error || 'Upload failed');
    }

    return response.json();
  },

  updateWithPicture: async (data: { description?: string; phone?: string; name?: string; picture?: File }) => {
    const formData = new FormData();
    if (data.picture) formData.append('picture', data.picture);
    if (data.description) formData.append('description', data.description);
    if (data.phone) formData.append('phone', data.phone);
    if (data.name) formData.append('name', data.name);

    const response = await fetch(`${API_URL}/api/v1/profile/update-with-picture`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Update failed' }));
      throw new Error(error.error || 'Update failed');
    }

    return response.json();
  },
};

// Post APIs
export const postAPI = {
  // Get user's own posts only (no feed available)
  getMyPosts: () => fetchAPI('/api/v1/posts/mine'),

  // Create post with JSON
  createPost: (content?: string, mediaUrl?: string, ai?: { fact_check_status?: string; credibility_score?: number; summary?: string }) =>
    fetchAPI('/api/v1/posts', {
      method: 'POST',
      body: JSON.stringify({ content, mediaUrl, ai }),
    }),

  // Upload media file and get URL
  uploadMedia: async (file: File) => {
    const formData = new FormData();
    formData.append('media', file);

    const response = await fetch(`${API_URL}/api/v1/posts/upload-media`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(error.error || 'Upload failed');
    }

    return response.json();
  },

  // Create post with media in one request
  createWithMedia: async (content?: string, media?: File, ai?: { fact_check_status?: string; credibility_score?: number; summary?: string }) => {
    const formData = new FormData();
    if (content) formData.append('content', content);
    if (media) formData.append('media', media);
    if (ai) formData.append('ai', JSON.stringify(ai));

    const response = await fetch(`${API_URL}/api/v1/posts/create-with-media`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to create post' }));
      throw new Error(error.error || 'Failed to create post');
    }

    return response.json();
  },
  like: (postId: string) => fetchAPI(`/api/v1/posts/${postId}/like`, { method: 'POST' }),
  unlike: (postId: string) => fetchAPI(`/api/v1/posts/${postId}/unlike`, { method: 'POST' }),
  comment: (postId: string, text: string) =>
    fetchAPI(`/api/v1/posts/${postId}/comment`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    }),
  deleteComment: (postId: string, commentId: string) =>
    fetchAPI(`/api/v1/posts/${postId}/comment/${commentId}`, { method: 'DELETE' }),
};

// AI APIs
export const aiAPI = {
  generate: () => fetchAPI('/api/v1/gemini/generate'),

  checkCredibility: (text: string) =>
    fetchAPI('/api/v1/gemini/check', {
      method: 'POST',
      body: JSON.stringify({ checkFor: text }),
    }),
};

// File URL helper
export function getFileUrl(fileId: string): string {
  return `${API_URL}/api/v1/files/${fileId}`;
}
export function toAbsoluteUrl(url?: string): string {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('/')) return `${API_URL}${url}`;
  return url;
}

// Friends APIs
export const friendsAPI = {
  search: (q: string, limit = 10) =>
    fetchAPI(`/api/v1/friends/search?q=${encodeURIComponent(q)}&limit=${limit}`),
  incoming: () => fetchAPI('/api/v1/friends/incoming'),
  request: (targetUserId: string) =>
    fetchAPI('/api/v1/friends/request', {
      method: 'POST',
      body: JSON.stringify({ targetUserId }),
    }),
  accept: (senderUserId: string) =>
    fetchAPI('/api/v1/friends/accept', {
      method: 'POST',
      body: JSON.stringify({ senderUserId }),
    }),
  decline: (senderUserId: string) =>
    fetchAPI('/api/v1/friends/decline', {
      method: 'POST',
      body: JSON.stringify({ senderUserId }),
    }),
};

export const usersAPI = {
  get: (id: string) => fetchAPI(`/api/v1/users/${id}`),
  posts: (id: string) => fetchAPI(`/api/v1/users/${id}/posts`),
};

export const storiesAPI = {
  feed: () => fetchAPI('/api/v1/stories/feed'),
  create: (payload: { text?: string; mediaUrl?: string }) =>
    fetchAPI('/api/v1/stories', { method: 'POST', body: JSON.stringify(payload) }),
  uploadMedia: (file: File) => {
    const fd = new FormData();
    fd.append('media', file);
    return fetchAPI('/api/v1/stories/upload-media', { method: 'POST', body: fd });
  },
  markViewed: (id: string) =>
    fetchAPI(`/api/v1/stories/${id}/view`, { method: 'POST' }),
};
