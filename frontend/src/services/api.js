import axios from 'axios';

const API_BASE = '/api/v1';

export const aqiApi = {
  getCurrentAQI: async (lat, lon) => {
    const res = await axios.get(`${API_BASE}/aqi/current`, { params: { lat, lon } });
    return res.data;
  },
  getCities: async () => {
    const res = await axios.get(`${API_BASE}/aqi/cities`);
    return res.data;
  },
  search: async (query) => {
    const res = await axios.get(`${API_BASE}/aqi/search`, { params: { q: query } });
    return res.data;
  },
  geocode: async (query) => {
    const res = await axios.get(`${API_BASE}/aqi/geocode`, { params: { q: query } });
    return res.data;
  }
};

export const aiApi = {
  explainAQI: async (payload) => {
    const res = await axios.post(`${API_BASE}/ai/explain`, payload);
    return res.data;
  },
  getRoutine: async (payload) => {
    const res = await axios.post(`${API_BASE}/ai/routine`, payload);
    return res.data;
  },
  compareTransport: async (distanceKm) => {
    const res = await axios.post(`${API_BASE}/ai/transport`, { distance_km: distanceKm });
    return res.data;
  }
};

export const communityApi = {
  getReports: async () => {
    const res = await axios.get(`${API_BASE}/community/reports`);
    return res.data;
  },
  submitReport: async (report) => {
    const res = await axios.post(`${API_BASE}/community/reports`, report);
    return res.data;
  },
  upvoteReport: async (reportId) => {
    const res = await axios.post(`${API_BASE}/community/reports/${reportId}/upvote`);
    return res.data;
  }
};

export const authApi = {
  getProfile: async () => {
    const res = await axios.get(`${API_BASE}/auth/profile`);
    return res.data;
  },
  updateProfile: async (data) => {
    const res = await axios.put(`${API_BASE}/auth/profile`, data);
    return res.data;
  },
  deleteAccount: async () => {
    const res = await axios.delete(`${API_BASE}/auth/account`);
    return res.data;
  }
};
