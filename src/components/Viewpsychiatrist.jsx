import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaUserMd, FaClock, FaTimes, FaCalendarAlt } from 'react-icons/fa';
import Navbar from './Navbar';
import { bookAppointmentAPI, getPsychiatristsAPI, getAvailableTimeSlotsAPI } from '../services/psychiatristServices '; // Fixed import

const PsychiatristBookingPage = () => {
  const queryClient = useQueryClient();
  const [selectedPsychiatrist, setSelectedPsychiatrist] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDateTimeModal, setShowDateTimeModal] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);

  // Fetch psychiatrists
  const { data: psychiatrists, isLoading, error, refetch } = useQuery({
    queryKey: ['availablePsychiatrists'],
    queryFn: getPsychiatristsAPI,
    initialData: [],
    onError: (err) => console.error('Error fetching psychiatrists:', err),
  });

  // Fetch available slots for selected psychiatrist and date
  const { data: availableSlots, isLoading: slotsLoading, refetch: refetchSlots } = useQuery({
    queryKey: ['availableSlots', selectedPsychiatrist?._id, selectedDate],
    queryFn: () => getAvailableTimeSlotsAPI({ psychiatristId: selectedPsychiatrist._id, date: selectedDate }),
    enabled: !!selectedPsychiatrist && !!selectedDate,
    initialData: [],
    onError: (err) => console.error('Error fetching available slots:', err),
  });

  // Mutation to book an appointment
  const bookingMutation = useMutation({
    mutationFn: bookAppointmentAPI,
    onSuccess: () => {
      queryClient.invalidateQueries(['availablePsychiatrists']);
      queryClient.invalidateQueries(['availableSlots']);
      setShowBookingForm(false);
      setSelectedPsychiatrist(null);
      setSelectedSlot(null);
      setSelectedDate(null);
      alert('Appointment booked successfully!');
    },
    onError: (err) => {
      console.error('Error booking appointment:', err);
      alert(`Failed to book appointment: ${err.message}`);
    },
  });

  const handlePsychiatristSelect = (psychiatrist) => {
    setSelectedPsychiatrist(psychiatrist);
    setSelectedDate(null);
    setSelectedSlot(null);
    setShowDateTimeModal(true);
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    setSelectedSlot(null);
    refetchSlots();
  };

  const handleSlotConfirm = (slot) => {
    if (!availableSlots.includes(slot)) {
      alert('Invalid slot selected. Please choose an available slot.');
      return;
    }
    setSelectedSlot(slot);
    setShowDateTimeModal(false);
    setShowBookingForm(true);
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const bookingData = {
      psychiatristId: selectedPsychiatrist._id,
      date: selectedSlot, // Renamed from 'slot' to 'date'
      reason: formData.get('reason'),
    };
    bookingMutation.mutate(bookingData);
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 pt-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h1 className="text-4xl font-bold text-slate-800 mb-3 font-[Inter]">
              Connect with Mental Health Professionals
            </h1>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Schedule a confidential session with licensed psychiatrists at your convenience
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-slate-200 h-12 w-12"></div>
                <div className="flex-1 space-y-4 py-1">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded"></div>
                    <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="text-center p-8 bg-white rounded-xl shadow-sm max-w-2xl mx-auto">
              <div className="text-red-600 mb-4">⚠️ Error loading psychiatrists</div>
              <button
                onClick={refetch}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {psychiatrists.map((psychiatrist) => (
                <div
                  key={psychiatrist._id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
                  onClick={() => handlePsychiatristSelect(psychiatrist)}
                >
                  <div className="p-6 pb-4">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <FaUserMd className="text-xl text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-800">
                          {psychiatrist.user?.username || 'Unnamed Psychiatrist'}
                          {psychiatrist.verified && (
                            <span className="ml-2 text-emerald-600 text-sm bg-emerald-100 px-2 py-1 rounded-full">
                              Verified
                            </span>
                          )}
                        </h3>
                        <p className="text-slate-600 text-sm mt-1">
                          {psychiatrist.user?.email || 'Email not available'}
                        </p>
                        <p className="text-slate-600 text-sm mt-1">
                          <span className="font-medium">Specialization:</span>{' '}
                          {psychiatrist.specialization || 'Not specified'}
                        </p>
                        <p className="text-slate-600 text-sm mt-1">
                          <span className="font-medium">Contact:</span>{' '}
                          {psychiatrist.contact || 'Not provided'}
                        </p>
                      </div>
                    </div>
                    <div className="border-t border-slate-100 pt-4">
                      <h4 className="text-sm font-medium text-slate-700 mb-3">Availability</h4>
                      <div className="flex flex-col gap-2">
                        {psychiatrist.availability?.length > 0 ? (
                          psychiatrist.availability.slice(0, 3).map((slot, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 rounded-lg text-sm bg-slate-50 text-slate-700"
                            >
                              <span>{slot.day}</span>
                              <span className="font-medium">{slot.start} - {slot.end}</span>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-3 text-slate-400 text-sm">
                            No availability specified
                          </div>
                        )}
                        {psychiatrist.availability?.length > 3 && (
                          <p className="text-blue-600 text-sm text-center mt-2">See more...</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Date and Time Selection Modal */}
          {showDateTimeModal && (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
              <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-slate-800">
                    Schedule with {selectedPsychiatrist.user?.username || 'Psychiatrist'}
                  </h2>
                  <button
                    onClick={() => setShowDateTimeModal(false)}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <FaTimes className="text-lg" />
                  </button>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <FaCalendarAlt className="inline mr-2" /> Select Date
                    </label>
                    <input
                      type="date"
                      onChange={handleDateChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-700 mb-2">Available Slots</h4>
                    {slotsLoading ? (
                      <div className="text-center py-3 text-slate-400 text-sm">Loading slots...</div>
                    ) : availableSlots.length > 0 ? (
                      <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
                        {availableSlots.map((slot, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedSlot(slot)}
                            className={`p-3 rounded-lg text-sm text-left transition-all ${
                              selectedSlot === slot
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                            }`}
                          >
                            {new Date(slot).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-3 text-slate-400 text-sm">
                        No available slots for this date
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleSlotConfirm(selectedSlot)}
                    disabled={!selectedSlot}
                    className={`w-full py-3.5 rounded-xl font-medium text-white transition-colors ${
                      !selectedSlot ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    Proceed to Booking
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Booking Confirmation Form */}
          {showBookingForm && (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
              <div className="bg-white rounded-2xl w-full max-w-md transform transition-all">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-slate-800">Reason for Consultation</h2>
                  <button
                    onClick={() => setShowBookingForm(false)}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <FaTimes className="text-lg" />
                  </button>
                </div>
                <div className="p-6">
                  <div className="mb-6 space-y-2 bg-blue-50 rounded-xl p-4">
                    <p className="text-sm font-medium text-blue-800">
                      {selectedPsychiatrist.user?.username || 'Psychiatrist'}
                    </p>
                    <p className="text-sm text-blue-700">
                      <FaClock className="inline mr-2" />
                      {new Date(selectedSlot).toLocaleString()}
                    </p>
                  </div>
                  <form onSubmit={handleBookingSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Consultation Purpose</label>
                      <textarea
                        name="reason"
                        rows="4"
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Briefly describe your reason for booking..."
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={bookingMutation.isPending}
                      className={`w-full py-3.5 rounded-xl font-medium text-white transition-colors ${
                        bookingMutation.isPending
                          ? 'bg-blue-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {bookingMutation.isPending ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                          Booking...
                        </span>
                      ) : (
                        'Confirm Appointment'
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PsychiatristBookingPage;