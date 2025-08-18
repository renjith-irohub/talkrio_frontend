// components/EditProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { FaUser } from 'react-icons/fa';
import { getToken } from '../utils/storageHandler';
import { BASE_URL } from '../utils/urls';
import PsychiatristHeader from './PsychiatristHeader';
import { Link, useNavigate } from 'react-router-dom';

const fetchPsychiatristProfile = async () => {
  const token = getToken();
  const response = await axios.get(`${BASE_URL}/psychiatrist/profile`, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });
  return response.data;
};

const updatePsychiatristProfile = async (profileData) => {
  const token = getToken();
  const response = await axios.put(`${BASE_URL}/psychiatrist/edit`, profileData, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });
  return response.data;
};

const EditProfilePage = () => {
  const queryClient = useQueryClient();
  const { data: profileData, isLoading, error } = useQuery({
    queryKey: ['psychiatristProfile'],
    queryFn: fetchPsychiatristProfile,
    onError: (err) => console.error('Error fetching profile:', err),
  });
  const navigate = useNavigate();
  const updateMutation = useMutation({
    mutationFn: updatePsychiatristProfile,
onSuccess: () => {
  queryClient.invalidateQueries(['psychiatristProfile']);
  alert('Profile updated successfully!');
  navigate('/psychiatristdashboard'); // Add this line
},
    onError: (err) => {
      console.error('Error updating profile:', err);
      alert(`Failed to update profile: ${err.response?.data?.message || err.message}`);
    },
  });

  const [formData, setFormData] = useState({
    username: '',
    specialization: '',
    contact: '',
    availability: [],
    googleMeetLink: '',
  });

  useEffect(() => {
    if (profileData) {
      setFormData({
        username: profileData.user?.username || '',
        specialization: profileData.psychiatrist?.specialization || '',
        contact: profileData.psychiatrist?.contact || '',
        availability: profileData.psychiatrist?.availability || [],
        googleMeetLink: profileData.psychiatrist?.googleMeetLink || '',
      });
    }
  }, [profileData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvailabilityChange = (index, field, value) => {
    const newAvailability = [...formData.availability];
    newAvailability[index] = { ...newAvailability[index], [field]: value };
    setFormData((prev) => ({ ...prev, availability: newAvailability }));
  };

  const addAvailabilitySlot = () => {
    setFormData((prev) => ({
      ...prev,
      availability: [...prev.availability, { day: '', start: '', end: '' }],
    }));
  };

  const removeAvailabilitySlot = (index) => {
    setFormData((prev) => ({
      ...prev,
      availability: prev.availability.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return <div className="text-center p-6">Loading profile...</div>;
  }
  if (error) {
    return (
      <div className="text-center p-6 text-red-600">
        Error loading profile: {error.message}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <PsychiatristHeader username={profileData?.user?.username} />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <FaUser className="mr-2 text-gray-500" />
            Edit Profile
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                name="username"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.username}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
              <input
                type="text"
                name="specialization"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.specialization}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
              <input
                type="text"
                name="contact"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.contact}
                onChange={handleInputChange}
                placeholder="e.g., +1 234 567 8900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Google Meet Link</label>
              <input
                type="url"
                name="googleMeetLink"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.googleMeetLink}
                onChange={handleInputChange}
                placeholder="e.g., https://meet.google.com/abc-defg-hij"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
              {formData.availability.map((slot, index) => (
                <div key={index} className="flex items-center gap-4 mb-4">
                  <select
                    className="p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={slot.day}
                    onChange={(e) => handleAvailabilityChange(index, 'day', e.target.value)}
                  >
                    <option value="">Select Day</option>
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                  <input
                    type="time"
                    className="p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={slot.start}
                    onChange={(e) => handleAvailabilityChange(index, 'start', e.target.value)}
                  />
                  <input
                    type="time"
                    className="p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={slot.end}
                    onChange={(e) => handleAvailabilityChange(index, 'end', e.target.value)}
                  />
                  <button
                    type="button"
                    className="text-red-600 hover:text-red-800"
                    onClick={() => removeAvailabilitySlot(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="text-blue-600 hover:text-blue-800"
                onClick={addAvailabilitySlot}
              >
                + Add Availability Slot
              </button>
            </div>
            <div className="flex justify-end space-x-4">
              <Link
                to="/psychiatristdashboard"
                className="px-4 py-2 rounded text-gray-700 bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className={`px-4 py-2 rounded text-white ${
                  updateMutation.isPending
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditProfilePage;