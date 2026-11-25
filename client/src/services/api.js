import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken') || localStorage.getItem('studentToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getSections = async () => {
  const response = await api.get('/score/sections');
  return response.data;
};

export const calculateBacScore = async (section, grades, with7Percent = false) => {
  const response = await api.post('/score/calculate', { section, grades, with7Percent });
  return response.data;
};

export const getFaculties = async (params = {}) => {
  const response = await api.get('/faculties', { params });
  return response.data;
};

export const getFacultyById = async (id) => {
  const response = await api.get(`/faculties/${id}`);
  return response.data;
};

export const getRecommendations = async (payload) => {
  const response = await api.post('/recommendations', payload);
  return response.data;
};

export const generateSummerPrepRoadmap = async (payload) => {
  const response = await api.post('/ai/summer-prep', payload);
  return response.data;
};

// ---------- BACHELIER ----------
export const studentRegister = async (p) => (await api.post('/auth/register', p)).data;
export const studentLogin = async (email, password) => (await api.post('/auth/student-login', { email, password })).data;

// ---------- ADMIN ----------
export const adminLogin = async (login, password) => (await api.post('/auth/login', { login, password })).data;

export const createFaculty = async (p) => (await api.post('/admin/faculties', p)).data;
export const updateFaculty = async (id, p) => (await api.put(`/admin/faculties/${id}`, p)).data;
export const deleteFaculty = async (id) => (await api.delete(`/admin/faculties/${id}`)).data;

export const createOffre = async (facId, p) => (await api.post(`/admin/faculties/${facId}/offres`, p)).data;
export const updateOffre = async (id, p) => (await api.put(`/admin/offres/${id}`, p)).data;
export const deleteOffre = async (id) => (await api.delete(`/admin/offres/${id}`)).data;

export const createClub = async (facId, p) => (await api.post(`/admin/faculties/${facId}/clubs`, p)).data;
export const updateClub = async (id, p) => (await api.put(`/admin/clubs/${id}`, p)).data;
export const deleteClub = async (id) => (await api.delete(`/admin/clubs/${id}`)).data;

export default api;
