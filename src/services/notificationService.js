import axios from 'axios';
import { BASE_URL } from "../utils/urls";
import { getToken } from "../utils/storageHandler";
const token = getToken()
  


export const fetchNotificationsAPI = async () => {
  const token = getToken();
  const response = await axios.get(`${BASE_URL}/notification/viewall`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const markNotificationAsReadAPI = async (id) => {
  const token = getToken();
  const response = await axios.put(`${BASE_URL}/notification/update`, 
    { id },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data;
};

export const deleteNotificationAPI = async (id) => {
  const token = getToken();
  const response = await axios.delete(`${BASE_URL}/notification/delete`, {
    data: { id },
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

