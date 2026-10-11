const API_BASE = '/api';

export const authStorage = {
  getToken: () => localStorage.getItem('sb_token'),
  getUser: () => {
    const raw = localStorage.getItem('sb_user');
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  setAuth: (token, user) => {
    localStorage.setItem('sb_token', token);
    localStorage.setItem('sb_user', JSON.stringify(user));
  },
  clearAuth: () => {
    localStorage.removeItem('sb_token');
    localStorage.removeItem('sb_user');
  }
};

async function request(endpoint, options = {}) {
  const token = authStorage.getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  if (response.status === 401) {
    authStorage.clearAuth();
    window.dispatchEvent(new Event('auth-changed'));
  }

  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (err) {
    data = text;
  }

  if (!response.ok) {
    const errorMsg = data?.message || data?.error || (typeof data === 'string' ? data : 'Request failed');
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  // Auth
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),

  // User
  getUserProfile: (userId) => request(`/users/${userId}`),
  getCurrentUser: () => request('/users/me'),
  updateProfile: (userId, payload) => request(`/users/${userId}`, { method: 'PUT', body: JSON.stringify(payload) }),
  addUserSkill: (userId, payload) => request(`/users/${userId}/skills`, { method: 'POST', body: JSON.stringify(payload) }),
  removeUserSkill: (userId, userSkillId) => request(`/users/${userId}/skills/${userSkillId}`, { method: 'DELETE' }),
  updateAvailability: (userId, slots) => request(`/users/${userId}/availability`, { method: 'PUT', body: JSON.stringify(slots) }),

  // Skills & Discovery
  getSkills: () => request('/skills'),
  createSkill: (payload) => request('/skills', { method: 'POST', body: JSON.stringify(payload) }),
  searchMentors: (params = {}) => {
    const qs = new URLSearchParams();
    if (params.query) qs.append('query', params.query);
    if (params.category && params.category !== 'All') qs.append('category', params.category);
    if (params.proficiency && params.proficiency !== 'All') qs.append('proficiency', params.proficiency);
    return request(`/skills/mentors?${qs.toString()}`);
  },

  // Mentoring Requests
  createRequest: (payload) => request('/requests', { method: 'POST', body: JSON.stringify(payload) }),
  getMyRequests: () => request('/requests/my'),
  acceptRequest: (requestId) => request(`/requests/${requestId}/accept`, { method: 'PUT' }),
  rejectRequest: (requestId) => request(`/requests/${requestId}/reject`, { method: 'PUT' }),
  cancelRequest: (requestId) => request(`/requests/${requestId}/cancel`, { method: 'PUT' }),

  // Sessions
  scheduleSession: (payload) => request('/sessions', { method: 'POST', body: JSON.stringify(payload) }),
  getMySessions: () => request('/sessions/my'),
  completeSession: (sessionId) => request(`/sessions/${sessionId}/complete`, { method: 'PUT' }),

  // Feedback
  submitFeedback: (payload) => request('/feedback', { method: 'POST', body: JSON.stringify(payload) }),
  getUserFeedbacks: (userId) => request(`/feedback/user/${userId}`),
  getAverageRating: (userId) => request(`/feedback/user/${userId}/average`),

  // Notifications
  getNotifications: () => request('/notifications'),
  getUnreadCount: () => request('/notifications/unread-count'),
  markAsRead: (id) => request(`/notifications/${id}/read`, { method: 'PUT' }),
  markAllAsRead: () => request('/notifications/read-all', { method: 'PUT' })
};
