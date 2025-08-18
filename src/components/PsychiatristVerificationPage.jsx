// pages/PsychiatristVerificationPage.jsx
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaUserMd, FaCheck, FaTimes, FaEye } from 'react-icons/fa';
import { viewAllPsychiatristsAPI, verifyPsychiatristAPI } from '../services/moderatorServices';
import ModeratorSidebar from './ModeratorHeader';


const PsychiatristVerificationPage = () => {
  const queryClient = useQueryClient();

  const { 
    data: psychiatristsData, 
    isLoading: psychiatristsLoading, 
    error: psychiatristsError, 
    refetch: refetchPsychiatrists 
  } = useQuery({
    queryKey: ['psychiatrists'],
    queryFn: viewAllPsychiatristsAPI,
    initialData: [],
    onError: (error) => console.error('Error fetching psychiatrists:', error),
  });

  const verificationMutation = useMutation({
    mutationFn: (userId) => verifyPsychiatristAPI(userId),
    onSuccess: () => {
      queryClient.invalidateQueries(['psychiatrists']);
      alert('Verification status updated successfully');
    },
    onError: (error) => {
      console.error('Error updating verification:', error);
      alert('Failed to update verification status. Please try again.');
    },
  });

  const handleVerification = (userId, currentStatus) => {
    const action = currentStatus ? 'unverify' : 'verify';
    if (window.confirm(`Are you sure you want to ${action} this psychiatrist?`)) {
      verificationMutation.mutate(userId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      <ModeratorSidebar />
      <main className="flex-grow p-8 ml-64">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">Psychiatrist Verification</h1>

        {psychiatristsLoading ? (
          <div className="text-center p-6">
            <span className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></span>
            <span className="ml-2 text-slate-600">Loading psychiatrists...</span>
          </div>
        ) : psychiatristsError ? (
          <div className="text-center p-6 bg-white rounded-xl shadow-sm max-w-2xl mx-auto">
            <div className="text-red-600 mb-4">⚠️ Error loading psychiatrists: {psychiatristsError.message}</div>
            <button
              onClick={refetchPsychiatrists}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-slate-800">Psychiatrist Verification</h2>
              <div className="text-sm text-slate-500">
                Total: {psychiatristsData.length} | Pending: {psychiatristsData.filter(p => !p.verified).length}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="p-4 text-left text-sm font-semibold text-slate-600 uppercase tracking-wider">Username</th>
                      <th className="p-4 text-left text-sm font-semibold text-slate-600 uppercase tracking-wider">Email</th>
                      <th className="p-4 text-left text-sm font-semibold text-slate-600 uppercase tracking-wider">Resume</th>
                      <th className="p-4 text-left text-sm font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                      <th className="p-4 text-left text-sm font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {psychiatristsData.length > 0 ? (
                      psychiatristsData.map((psychiatrist) => (
                        <tr
                          key={psychiatrist._id}
                          className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
                        >
                          <td className="p-4 text-slate-700 font-medium">{psychiatrist.username}</td>
                          <td className="p-4 text-slate-600">{psychiatrist.email}</td>
                          <td className="p-4">
                            {psychiatrist.resume ? (
                              <a
                                href={psychiatrist.resume}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
                              >
                                <FaEye /> View Resume
                              </a>
                            ) : (
                              <span className="text-slate-400 italic">Not provided</span>
                            )}
                          </td>
                          <td className="p-4">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                psychiatrist.verified
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {psychiatrist.verified ? (
                                <>
                                  <FaCheck className="mr-1" /> Verified
                                </>
                              ) : (
                                <>
                                  <FaTimes className="mr-1" /> Pending
                                </>
                              )}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleVerification(psychiatrist._id, psychiatrist.verified)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors ${
                                  psychiatrist.verified
                                    ? 'bg-red-600 hover:bg-red-700'
                                    : 'bg-emerald-600 hover:bg-emerald-700'
                                }`}
                                title={psychiatrist.verified ? 'Unverify' : 'Verify'}
                                disabled={verificationMutation.isPending}
                              >
                                {psychiatrist.verified ? 'Unverify' : 'Verify'}
                              </button>
                              {psychiatrist.resume && (
                                <a
                                  href={psychiatrist.resume}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-700 transition-colors"
                                >
                                  <FaEye size={18} />
                                </a>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-6 text-center text-slate-500">
                          No psychiatrists available for verification
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {verificationMutation.isPending && (
              <div className="flex justify-center items-center p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                <span className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></span>
                <span className="ml-2 text-slate-600">Processing...</span>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default PsychiatristVerificationPage;