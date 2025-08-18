import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaCalendar, FaUser, FaNotesMedical, FaFilter, FaSort, FaLink, FaClock, FaCheckCircle, FaTimesCircle, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getToken } from '../utils/storageHandler';
import { BASE_URL } from '../utils/urls';
import Navbar from './Navbar';

const fetchConsultationHistory = async () => {
  const token = getToken();
  const response = await axios.get(`${BASE_URL}/psychiatrist/history`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const cancelConsultation = async (consultationId) => {
  const token = getToken();
  const response = await axios.delete(`${BASE_URL}/psychiatrist/cancel`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { id: consultationId },
  });
  return response.data;
};

const AppointmentView = () => {
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState('date');
  const queryClient = useQueryClient();

  const { data: consultations, isLoading, error } = useQuery({
    queryKey: ['consultationHistory'],
    queryFn: fetchConsultationHistory,
    initialData: [],
    onError: (err) => console.error('Error fetching consultation history:', err),
  });

  const cancelMutation = useMutation({
    mutationFn: cancelConsultation,
    onSuccess: () => {
      toast.success('Consultation canceled successfully ✅');
      queryClient.invalidateQueries(['consultationHistory']);
    },
    onError: (err) => {
      toast.error(`Failed to cancel consultation: ${err.response?.data?.message || err.message} ❌`);
    },
  });

  const handleCancelConsultation = (consultationId) => {
    if (window.confirm('Are you sure you want to cancel this consultation?')) {
      cancelMutation.mutate(consultationId);
    }
  };

  const statusOptions = ['All', 'Scheduled', 'Completed', 'Canceled'];

  const sortOptions = [
    { value: 'date', label: 'Date' },
    { value: 'psychiatristName', label: 'Psychiatrist Name' },
  ];

  const filteredConsultations = useMemo(() => {
    return consultations.filter(
      (consultation) => filterStatus === 'All' || consultation.status === filterStatus
    );
  }, [consultations, filterStatus]);

  const sortedConsultations = useMemo(() => {
    return [...filteredConsultations].sort((a, b) => {
      switch (sortBy) {
        case 'psychiatristName':
          return (a.psychiatristId?.user?.username || '').localeCompare(b.psychiatristId?.user?.username || '');
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

  const StatusIcon = ({ status }) => {
    switch (status) {
      case 'Scheduled':
        return <FaClock className="mr-2" />;
      case 'Completed':
        return <FaCheckCircle className="mr-2" />;
      case 'Canceled':
        return <FaTimesCircle className="mr-2" />;
      default:
        return <FaClock className="mr-2" />;
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 pt-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Consultation History
            </h1>
            <p className="text-gray-600 text-lg">
              Review your past and upcoming therapy sessions
            </p>
          </div>

          {/* Control Bar */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-8 flex flex-wrap gap-4 items-center">
            <div className="flex items-center flex-1 min-w-[250px]">
              <div className="relative w-full">
                <FaFilter className="absolute left-3 top-3 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status} Consultations
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center flex-1 min-w-[250px]">
              <div className="relative w-full">
                <FaSort className="absolute left-3 top-3 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      Sort by {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="grid gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 p-6 rounded-xl text-red-700 flex items-center gap-3">
              <FaTimesCircle className="flex-shrink-0" />
              <div>
                <h3 className="font-semibold">Error loading consultations</h3>
                <p>{error.message}</p>
              </div>
            </div>
          ) : sortedConsultations.length === 0 ? (
            <div className="text-center py-16">
              <div className="mb-4 text-gray-400 mx-auto">
                <FaCalendar className="text-5xl inline-block" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No consultations found
              </h3>
              <p className="text-gray-600">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {sortedConsultations.map((consultation) => (
                <div
                  key={consultation._id}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 border-l-4 border-blue-500"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                        <FaUser className="text-gray-500" />
                        {consultation.psychiatristId?.user?.username || 'Unknown Psychiatrist'}
                      </h2>
                      <p className="text-gray-600 text-sm mt-1">
                        {consultation.psychiatristId?.specialization || 'General Psychiatry'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(consultation.status)}`}>
                        <StatusIcon status={consultation.status} />
                        {consultation.status}
                      </span>
                      {consultation.status === 'Scheduled' && (
                        <button
                          onClick={() => handleCancelConsultation(consultation._id)}
                          className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 text-sm font-medium disabled:opacity-50"
                          disabled={cancelMutation.isPending}
                        >
                          <FaTimes />
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <FaCalendar className="text-gray-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Appointment Time</p>
                        <p className="font-medium">{formatDateTime(consultation.date)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <FaUser className="text-gray-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Patient</p>
                        <p className="font-medium">{consultation.userId?.username || 'Unknown'}</p>
                      </div>
                    </div>

                    {consultation.notes && (
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <FaNotesMedical className="text-gray-500" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Reason</p>
                          <p className="font-medium">{consultation.notes}</p>
                        </div>
                      </div>
                    )}

                    {consultation.prescriptionNotes && (
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <FaNotesMedical className="text-gray-500" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Prescription Notes</p>
                          <p className="font-medium">{consultation.prescriptionNotes}</p>
                        </div>
                      </div>
                    )}

                    {consultation.psychiatristId?.googleMeetLink && (
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <FaLink className="text-gray-500" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Meeting Link</p>
                          <a
                            href={consultation.psychiatristId.googleMeetLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline font-medium inline-flex items-center gap-1"
                          >
                            Join Session
                            <span className="text-xs">↗</span>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentView;