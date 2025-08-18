// services/communityServices.js
import axios from 'axios';
import { BASE_URL } from '../utils/urls';
import { getToken } from '../utils/storageHandler';

export const createCommunityAPI = async (data) => {
  const token = getToken();
  if (!token) throw new Error('No authentication token found');
  const response = await axios.post(`${BASE_URL}/community/add`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export const getAllCommunitiesAPI = async () => {
    const token = getToken();
    console.log('Token:', token); // Add this to debug
    if (!token) throw new Error('No authentication token found');
    const response = await axios.get(`${BASE_URL}/community/viewall`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('API Response:', response.data); // Add this to debug
    return response.data;
  };

export const deleteCommunityAPI = async ({ name }) => {
  const token = getToken();
  if (!token) throw new Error('No authentication token found');
  const response = await axios.delete(`${BASE_URL}/community/delete`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    data: { name }, // Send name in the body
  });
  return response.data;
};

export const joinCommunityAPI = async ({ name }) => {
    const token = getToken();
    if (!token) throw new Error('No authentication token found');
    const response = await axios.post(
      `${BASE_URL}/community/join`,
      { name },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  };