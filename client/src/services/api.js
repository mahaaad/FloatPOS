import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

API.interceptors.request.use(req => {
  if (localStorage.getItem('token')) {
    req.headers['auth-token'] = localStorage.getItem('token');
  }
  return req;
});

export const register = (formData) => API.post('/auth/register', formData);
export const login = (formData) => API.post('/auth/login', formData);
export const createTable = (tableData) => API.post('/user/tables', tableData);
export const getTables = () => API.get('/user/tables');
export const createMenuItem = (itemData) => API.post('/menu/items', itemData);
export const getMenuItems = () => API.get('/menu/items');
