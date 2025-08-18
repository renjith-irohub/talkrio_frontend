// pages/CommunityManagementPage.jsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaPlus, FaTrash, FaSpinner } from 'react-icons/fa';
import { createCommunityAPI, getAllCommunitiesAPI, deleteCommunityAPI } from '../services/communityServices'; // New service file
import ModeratorSidebar from '../components/ModeratorHeader';


const CommunityManagementPage = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    symptomsDiscussed: '',
    urls: '',
  });

  const { data: communities = [], isLoading, error, refetch } = useQuery({
    queryKey: ['communities'],
    queryFn: getAllCommunitiesAPI,
    initialData: [],

  });

  const createMutation = useMutation({
    mutationFn: createCommunityAPI,
    onSuccess: () => {
      queryClient.invalidateQueries(['communities']);
      alert('Community created successfully');
      setFormData({ name: '', description: '', symptomsDiscussed: '', urls: '' });
    },
    onError: (error) => console.error('Error creating community:', error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCommunityAPI,
    onSuccess: () => {
      queryClient.invalidateQueries(['communities']);
      alert('Community deleted successfully');
    },
    onError: (error) => console.error('Error deleting community:', error.message),
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleDelete = (name) => {
    if (window.confirm(`Are you sure you want to delete the community "${name}"?`)) {
      deleteMutation.mutate({ name });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      <ModeratorSidebar />
      <main className="flex-grow p-8 ml-64">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">Community Management</h1>

        {/* Add Community Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-6">
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">Add New Community</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600">Symptoms Discussed (comma-separated)</label>
              <input
                type="text"
                name="symptomsDiscussed"
                value={formData.symptomsDiscussed}
                onChange={handleInputChange}
                className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600">URLs (comma-separated)</label>
              <input
                type="text"
                name="urls"
                value={formData.urls}
                onChange={handleInputChange}
                className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              disabled={createMutation.isLoading}
            >
              {createMutation.isLoading ? <FaSpinner className="animate-spin" /> : <FaPlus />}
              Add Community
            </button>
          </form>
        </div>

        {/* Community List */}
        {isLoading ? (
          <div className="text-center p-6 text-slate-600">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <span>Loading communities...</span>
          </div>
        ) : error ? (
          <div className="text-center p-6 bg-white rounded-xl shadow-sm max-w-2xl mx-auto">
            <div className="text-red-600 mb-4">⚠️ Error loading communities: {error.message}</div>
            <button
              onClick={refetch}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              disabled={isLoading}
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="p-4 text-left text-sm font-semibold text-slate-600 uppercase tracking-wider">Name</th>
                    <th className="p-4 text-left text-sm font-semibold text-slate-600 uppercase tracking-wider">Description</th>
                    <th className="p-4 text-left text-sm font-semibold text-slate-600 uppercase tracking-wider">Symptoms</th>
                    <th className="p-4 text-left text-sm font-semibold text-slate-600 uppercase tracking-wider">URLs</th>
                    <th className="p-4 text-left text-sm font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {communities.map((community) => (
                    <tr key={community._id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                      <td className="p-4 text-slate-700">{community.name}</td>
                      <td className="p-4 text-slate-700 max-w-xs truncate">{community.description}</td>
                      <td className="p-4 text-slate-700">{community.symptomsDiscussed?.join(', ') || 'N/A'}</td>
                      <td className="p-4 text-slate-700">{community.urls?.join(', ') || 'N/A'}</td>
                      <td className="p-4">
                        <button
                          onClick={() => handleDelete(community.name)}
                          className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                          title="Delete Community"
                          disabled={deleteMutation.isLoading}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {communities.length === 0 && (
              <div className="p-6 text-center text-slate-500">No communities found</div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default CommunityManagementPage;