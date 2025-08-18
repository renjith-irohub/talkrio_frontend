import axios from 'axios';
import { getToken } from '../utils/storageHandler';
import { BASE_URL } from '../utils/urls';

// Fetch all psychiatrists
export const getPsychiatristsAPI = async () => {
  const token = getToken();
  try {
    const response = await axios.get(`${BASE_URL}/psychiatrist/viewall`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch psychiatrists');
  }
};

// Fetch available time slots
export const getAvailableTimeSlotsAPI = async ({ psychiatristId, date }) => {
  const token = getToken();
  try {
    const response = await axios.post(
      `${BASE_URL}/psychiatrist/slots`,
      { id: psychiatristId, date },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.availableSlots;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch available slots');
  }
};

// Book an appointment
export const bookAppointmentAPI = async (bookingData) => {
  const token = getToken();
  if (!bookingData.psychiatristId || !bookingData.date) {
    throw new Error('Psychiatrist ID and date are required');
  }
  try {
    const response = await axios.put(
      `${BASE_URL}/psychiatrist/schedule`,
      {
        psychiatristId: bookingData.psychiatristId,
        date: bookingData.date,
        reason: bookingData.reason,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to book appointment');
  }
};

// Complete an appointment
export const completeAppointmentAPI = async ({ id, prescriptionNotes }) => {
  const token = getToken();
  if (!id) {
    throw new Error('Consultation ID is required');
  }
  try {
    const response = await axios.post(
      `${BASE_URL}/psychiatrist/complete`,
      { id, prescriptionNotes },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to complete appointment');
  }
};