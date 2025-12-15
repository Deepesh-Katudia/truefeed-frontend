const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Generic fetch wrapper
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
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

  updateProfile: (data: { description?: string; phone?: string }) =>
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
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(error.error || 'Upload failed');
    }

    return response.json();
  },

  updateWithPicture: async (data: { description?: string; phone?: string; picture?: File }) => {
    const formData = new FormData();
    if (data.picture) formData.append('picture', data.picture);
    if (data.description) formData.append('description', data.description);
    if (data.phone) formData.append('phone', data.phone);

    const response = await fetch(`${API_URL}/api/v1/profile/update-with-picture`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
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
  createPost: (content?: string, mediaUrl?: string) =>
    fetchAPI('/api/v1/posts', {
      method: 'POST',
      body: JSON.stringify({ content, mediaUrl }),
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
  createWithMedia: async (content?: string, media?: File) => {
    const formData = new FormData();
    if (content) formData.append('content', content);
    if (media) formData.append('media', media);

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