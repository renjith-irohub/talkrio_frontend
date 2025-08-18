// services/chatServices.js
import axios from 'axios';
import { BASE_URL } from '../utils/urls';
import { getToken } from '../utils/storageHandler';

export const getChatMessagesAPI = async (roomId) => {
  const token = getToken();
  if (!token) throw new Error('No authentication token found');
  const response = await axios.get(`${BASE_URL}/bot/${roomId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};