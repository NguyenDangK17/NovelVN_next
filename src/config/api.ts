export const API_BASE_URL = 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  UPLOAD_AVATAR: `${API_BASE_URL}/auth/upload-avatar`,

  // Novel endpoints
  NOVELS: `${API_BASE_URL}/novels`,
  NOVEL_DETAIL: (id: string) => `${API_BASE_URL}/novels/${id}`,
  NOVEL_CHAPTERS: (id: string) => `${API_BASE_URL}/novels/${id}/chapters`,

  // User endpoints
  USER_PROFILE: (id: string) => `${API_BASE_URL}/users/${id}`,
  USER_GROUPS: (id: string) => `${API_BASE_URL}/users/${id}/groups`,

  // Group endpoints
  GROUPS: `${API_BASE_URL}/groups`,
  GROUP_DETAIL: (id: string) => `${API_BASE_URL}/groups/${id}`,
} as const;