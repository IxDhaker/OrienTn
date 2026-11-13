import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
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

export default api;
