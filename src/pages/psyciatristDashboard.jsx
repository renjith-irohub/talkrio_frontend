// pages/PsychiatristDashboard.jsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaCalendarAlt, FaPhone, FaLink, FaGraduationCap, FaEdit } from 'react-icons/fa';
import { getToken } from '../utils/storageHandler';
import { BASE_URL } from '../utils/urls';
import PsychiatristHeader from '../components/PsychiatristHeader';


const fetchPsychiatristProfile = async () => {
  const token = getToken();
  const response = await axios.get(`${BASE_URL}/psychiatrist/profile`, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });
  return response.data;
};

const LoadingSpinner = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
  </div>
);

const PsychiatristDashboard = () => {
  const { data: profileData, isLoading, error } = useQuery({
    queryKey: ['psychiatristProfile'],
    queryFn: fetchPsychiatristProfile,
    onError: (err) => console.error('Error fetching profile:', err),
  });

  const renderProfile = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Error loading profile: {error.message}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center">
              <FaUser className="mr-3 text-blue-500" />
              My Profile
            </h2>
            <Link
              to="/edit-profile"
              className="flex items-center px-5 py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
            >
              <FaEdit className="mr-2" />
              Edit Profile
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Personal Info */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <FaUser className="text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Username</p>
                    <p className="text-lg font-medium text-gray-900">
                      {profileData.user?.username || 'Not set'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <FaGraduationCap className="text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Specialization</p>
                    <p className="text-lg font-medium text-gray-900">
                      {profileData.psychiatrist?.specialization || 'Not set'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <FaPhone className="text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Contact</p>
                    <p className="text-lg font-medium text-gray-900">
                      {profileData.psychiatrist?.contact || 'Not set'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Professional Info */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Professional Information</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <FaLink className="text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Google Meet Link</p>
                    {profileData.psychiatrist?.googleMeetLink ? (
                      <a
                        href={profileData.psychiatrist.googleMeetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg font-medium text-blue-600 hover:underline break-all"
                      >
                        {profileData.psychiatrist.googleMeetLink}
                      </a>
                    ) : (
                      <p className="text-lg font-medium text-gray-900">Not set</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <FaCalendarAlt className="text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Availability</p>
                    {profileData.psychiatrist?.availability?.length > 0 ? (
                      <ul className="mt-2 space-y-2">
                        {profileData.psychiatrist.availability.map((slot, index) => (
                          <li key={index} className="flex items-center">
                            <span className="inline-block h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
                            <span className="text-lg font-medium text-gray-900">
                              {slot.day}: {slot.start} - {slot.end}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-lg font-medium text-gray-900">Not set</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PsychiatristHeader username={profileData?.user?.username} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderProfile()}
        
        {/* Additional Dashboard Sections */}
        {/* <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link 
            to="/viewdoctorappointment" 
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 border-l-4 border-blue-500"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Upcoming Appointments</h3>
            <p className="text-gray-600">View and manage your scheduled sessions</p>
          </Link>
          
          <Link 
            to="/patients" 
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 border-l-4 border-green-500"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Patient Records</h3>
            <p className="text-gray-600">Access your patients' information and history</p>
          </Link>
          
          <Link 
            to="/reports" 
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 border-l-4 border-purple-500"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Session Reports</h3>
            <p className="text-gray-600">Generate and review therapy session reports</p>
          </Link>
        </div> */}
      </main>
    </div>
  );
};

export default PsychiatristDashboard;