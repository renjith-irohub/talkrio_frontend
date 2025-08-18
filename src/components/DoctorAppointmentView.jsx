import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaCalendar, FaUser, FaNotesMedical, FaFilter, FaSort, FaLink, FaCheckCircle, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { getToken } from '../utils/storageHandler';
import { BASE_URL } from '../utils/urls';
import PsychiatristHeader from './PsychiatristHeader';
import { completeAppointmentAPI } from '../services/psychiatristServices ';


const fetchMyAppointments = async () => {
  const token = getToken();
  const response = await axios.get(`${BASE_URL}/psychiatrist/history`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const DoctorAppointmentView = () => {
  const queryClient = useQueryClient();
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState('date');
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [prescriptionNotes, setPrescriptionNotes] = useState('');

  const { data: consultations, isLoading, error } = useQuery({
    queryKey: ['myAppointments'],
    queryFn: fetchMyAppointments,
    initialData: [],
    onError: (err) => console.error('Error fetching appointments:', err),
  });

  // Mutation to complete an appointment
  const completeMutation = useMutation({
    mutationFn: completeAppointmentAPI,
    onSuccess: () => {
      queryClient.invalidateQueries(['myAppointments']);
      setShowCompleteModal(false);
      setSelectedConsultation(null);
      setPrescriptionNotes('');
      alert('Appointment completed successfully!');
    },
    onError: (err) => {
      console.error('Error completing appointment:', err);
      alert(`Failed to complete appointment: ${err.message}`);
    },
  });

  const statusOptions = ['All', 'Scheduled', 'Completed', 'Canceled'];

  const sortOptions = [
    { value: 'date', label: 'Date' },
    { value: 'patientName', label: 'Patient Name' },
  ];

  const filteredConsultations = useMemo(() => {
    return consultations.filter(
      (consultation) => filterStatus === 'All' || consultation.status === filterStatus
    );
  }, [consultations, filterStatus]);

  const sortedConsultations = useMemo(() => {
    return [...filteredConsultations].sort((a, b) => {
      switch (sortBy) {
        case 'patientName':
          return (a.userId?.username || '').localeCompare(b.userId?.username || '');
        default:
          return new Date(a.date) - new Date(b.date);
      }
    });
  }, [filteredConsultations, sortBy]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleCompleteClick = (consultation) => {
    setSelectedConsultation(consultation);
    setPrescriptionNotes('');
    setShowCompleteModal(true);
  };

  const handleCompleteSubmit = (e) => {
    e.preventDefault();
    completeMutation.mutate({
      id: selectedConsultation._id,
      prescriptionNotes,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <PsychiatristHeader />
      <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-10">
          Your Appointments
        </h1>

        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center w-full sm:w-auto">
            <FaFilter className="text-gray-500 mr-2" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status} Appointments
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center w-full sm:w-auto">
            <FaSort className="text-gray-500 mr-2" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  Sort by {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center text-gray-500 py-10">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-gray-200 h-12 w-12"></div>
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 py-10">
            Error loading appointments: {error.message}
          </div>
        ) : sortedConsultations.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            No appointments found.
          </div>
        ) : (
          <div className="grid gap-6">
            {sortedConsultations.map((consultation) => (
              <div
                key={consultation._id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <FaUser className="mr-2 text-gray-500" />
                    {consultation.userId?.username || 'Unknown Patient'}
                  </h2>
                  <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        consultation.status
                      )}`}
                    >
                      {consultation.status}
                    </span>
                    {consultation.status === 'Scheduled' && (
                      <button
                        onClick={() => handleCompleteClick(consultation)}
                        className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <FaCheckCircle className="inline mr-1" />
                        Complete
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-3 text-gray-600">
                  <div className="flex items-center">
                    <FaCalendar className="mr-2 text-gray-500" />
                    <span>{formatDateTime(consultation.date)}</span>
                  </div>
                  {consultation.notes && (
                    <div className="flex items-center">
                      <FaNotesMedical className="mr-2 text-gray-500" />
                      <span>Reason: {consultation.notes}</span>
                    </div>
                  )}
                  {consultation.prescriptionNotes && (
                    <div className="flex items-center">
                      <FaNotesMedical className="mr-2 text-gray-500" />
                      <span>Prescription Notes: {consultation.prescriptionNotes}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <FaUser className="mr-2 text-gray-500" />
                    <span>Email: {consultation.userId?.email || 'Not specified'}</span>
                  </div>
                  {consultation.psychiatristId?.googleMeetLink && (
                    <div className="flex items-center">
                      <FaLink className="mr-2 text-gray-500" />
                      <a
                        href={consultation.psychiatristId.googleMeetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Join Google Meet
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Complete Appointment Modal */}
        {showCompleteModal && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-md transform transition-all">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Complete Appointment</h2>
                <button
                  onClick={() => setShowCompleteModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimes className="text-lg" />
                </button>
              </div>
              <div className="p-6">
                <div className="mb-6 space-y-2 bg-blue-50 rounded-xl p-4">
                  <p className="text-sm font-medium text-blue-800">
                    {selectedConsultation.userId?.username || 'Patient'}
                  </p>
                  <p className="text-sm text-blue-700">
                    <FaCalendar className="inline mr-2" />
                    {formatDateTime(selectedConsultation.date)}
                  </p>
                </div>
                <form onSubmit={handleCompleteSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prescription Notes
                    </label>
                    <textarea
                      value={prescriptionNotes}
                      onChange={(e) => setPrescriptionNotes(e.target.value)}
                      rows="4"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter prescription notes (optional)..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={completeMutation.isPending}
                    className={`w-full py-3.5 rounded-xl font-medium text-white transition-colors ${
                      completeMutation.isPending
                        ? 'bg-green-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {completeMutation.isPending ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                        Completing...
                      </span>
                    ) : (
                      'Mark as Completed'
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorAppointmentView;