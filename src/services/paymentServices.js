// src/services/paymentServices.js
import axios from 'axios';
import { BASE_URL } from '../utils/urls';
import { getToken } from '../utils/storageHandler';
export const processPaymentAPI = async (data) => {

const token=getToken()
  const response = await axios.post(
    `${BASE_URL}/payment/checkout`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// Update payment status
export const updatePaymentStatus = async (data) => {
  const response = await axios.put(
    `${BASE_URL}/update`,
    data,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// Get all payments for the user
export const getPayments = async (token) => {
  const response = await axios.get(`${BASE_URL}/all`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Get a specific payment by ID
export const getPaymentById = async (id, token) => {
  const response = await axios.get(`${BASE_URL}/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};