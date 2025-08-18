import axios from 'axios';
import { BASE_URL } from "../utils/urls";
import { getToken } from "../utils/storageHandler";
// Set the base URL if needed

export const addResourceAPI = async (data) => {
  const token = getToken();
  console.log(data);
  
  const response = await axios.post(`${BASE_URL}/resource/add`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
// resourceServices.js
export const getResourcesAPI = async () => {
  const token = getToken();

  const res = await axios.get(`${BASE_URL}/resource/view`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
  return res.data;
};

export const searchResourcesAPI = async (query) => {
  const token = getToken();
  const res = await axios.get(`${BASE_URL}/resource/search`, {
    params: { query },
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
  return res.data; // Fixed typo: response.data to res.data
};

export const deleteResourceAPI = async (id) => {
  const res = await axios.delete(`${BASE_URL}/resource/delete`, {
    data: { id },
    withCredentials: true,
  });
  return response.data;
};
