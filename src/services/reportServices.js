// reportServices.js
import axios from "axios";
import { BASE_URL } from "../utils/urls";
import { getToken } from "../utils/storageHandler";

// Note: Token should be fetched dynamically in each function to ensure it's current
export const viewReportPostAPI = async () => {
  const token = getToken();
  const response = await axios.get(`${BASE_URL}/report/viewall`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const resolveReportAPI = async ({ id, action }) => {
  const token = getToken();
  const response = await axios.put(
    `${BASE_URL}/report/actions`,
    { id, action },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const deletePostAPI = async (postId) => {
  const token = getToken();
  console.log('Token:', token); // Debug
  if (!token) throw new Error('No authentication token found');
  const response = await axios.delete(`${BASE_URL}/report/delete-post/${postId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteReportAPI = async (reportId) => {
  const token = getToken();
  if (!token) throw new Error('No authentication token found');
  const response = await axios.delete(`${BASE_URL}/report/delete`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    data: { id: reportId }, // Send report ID in the body
  });
  return response.data;
};