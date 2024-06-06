import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const register = (userData) => {
  return axios.post(`${API_URL}/register`, userData);
};

export const login = (userData) => {
  return axios.post(`${API_URL}/login`, userData);
};

export const updateProfile = (profileData) => {
  return axios.put(`${API_URL}/profile`, profileData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
