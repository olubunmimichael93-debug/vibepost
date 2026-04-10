const API_URL = import.meta.env.VITE_API_URL || 'https://vibepost.onrender.com/api';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// Set token in localStorage
export const setToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

// API request helper
const request = async (endpoint, options = {}) => {
  const token = getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  
  return data;
};

// ============ AUTH ============
export const login = async (email, password) => {
  const data = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  
  if (data.token) {
    setToken(data.token);
  }
  
  return data;
};

export const logout = () => {
  setToken(null);
};

export const setupAdmin = async () => {
  return await request('/auth/setup', { method: 'POST' });
};

// ============ POSTS ============
export const getPosts = async () => {
  const data = await request('/posts');
  return data.data;
};

export const getPost = async (id) => {
  const data = await request(`/posts/${id}`);
  return data.data;
};

export const createPost = async (postData) => {
  const data = await request('/posts', {
    method: 'POST',
    body: JSON.stringify(postData),
  });
  return data.data;
};

export const updatePost = async (id, postData) => {
  const data = await request(`/posts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(postData),
  });
  return data.data;
};

export const deletePost = async (id) => {
  await request(`/posts/${id}`, { method: 'DELETE' });
};

// ============ LIKES ============
export const toggleLike = async (postId, userId) => {
  const data = await request(`/posts/${postId}/like`, {
    method: 'POST',
    body: JSON.stringify({ userId }),
  });
  return data;
};

export const getLikeStatus = async (postId, userId) => {
  const data = await request(`/posts/${postId}/like-status?userId=${userId}`);
  return data;
};

// ============ COMMENTS ============
export const getComments = async (postId) => {
  const data = await request(`/comments/${postId}`);
  return data.data;
};

export const addComment = async (postId, author, content) => {
  const data = await request('/comments', {
    method: 'POST',
    body: JSON.stringify({ postId, author, content }),
  });
  return data.data;
};

export const deleteComment = async (commentId) => {
  await request(`/comments/${commentId}`, { method: 'DELETE' });
};

// ============ SHARES ============
export const trackShare = async (postId) => {
  const data = await request('/shares', {
    method: 'POST',
    body: JSON.stringify({ postId }),
  });
  return data;
};