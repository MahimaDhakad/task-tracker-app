import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/tasks';

// Get auth token
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Get all tasks
export const getTasks = async () => {
  const response = await axios.get(API_URL, {
    headers: getAuthHeader()
  });
  return response.data;
};

// Get single task
export const getTask = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: getAuthHeader()
  });
  return response.data;
};

// Create task
export const createTask = async (taskData) => {
  const response = await axios.post(API_URL, taskData, {
    headers: getAuthHeader()
  });
  return response.data;
};

// Update task
export const updateTask = async (id, taskData) => {
  const response = await axios.put(`${API_URL}/${id}`, taskData, {
    headers: getAuthHeader()
  });
  return response.data;
};

// Delete task
export const deleteTask = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: getAuthHeader()
  });
  return response.data;
};
