import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { FaBook, FaTimes, FaTrash, FaEdit, FaPlus, FaFileUpload, FaVideo, FaPodcast, FaBookOpen } from 'react-icons/fa';
import { addResourceAPI } from '../services/resourceServices';
import ModeratorSidebar from '../components/ModeratorHeader';

const AddResourcePage = () => {
  const [resources, setResources] = useState([]);
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    category: 'Article',
    file: null,
  });
  const [showAddForm, setShowAddForm] = useState(false);
  
  const addResourceMutation = useMutation({
    mutationFn: addResourceAPI,
    onSuccess: (data) => {
      setResources((prev) => [...prev, data.resource]);
      setNewResource({ title: '', description: '', category: 'Article', file: null });
      setShowAddForm(false);
    },
    onError: (error) => {
      console.error('Mutation Error:', error);
      alert(`Failed to add resource: ${error.response?.data?.message || error.message}`);
    },
  });

  const handleAddResource = async (e) => {
    e.preventDefault();
    const { title, description, category, file } = newResource;

    if (!title || !description || !category || !file) {
      alert('Please fill all fields and select a file');
      return;
    }
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('link', file);
    
    try {
      await addResourceMutation.mutateAsync(formData);
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || 'Failed to add resource'}`);
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Video': return <FaVideo className="w-5 h-5" />;
      case 'Podcast': return <FaPodcast className="w-5 h-5" />;
      case 'Book': return <FaBookOpen className="w-5 h-5" />;
      default: return <FaFileUpload className="w-5 h-5" />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ModeratorSidebar/>
      
      {/* Main Content */}
      <div className="flex-1 p-8 ml-64"> {/* Added ml-64 to account for sidebar width */}
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Resource Center</h1>
              <p className="text-gray-600 mt-2">Manage and organize educational resources for the community</p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-md"
            >
              <FaPlus className="text-lg" />
              <span>Add New Resource</span>
            </button>
          </div>

          {/* Resource Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.length === 0 ? (
              <div className="col-span-full py-12 text-center">
                <div className="inline-block p-6 bg-white rounded-2xl shadow-lg">
                  <FaBook className="text-4xl text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No resources added yet</h3>
                  <p className="text-gray-600 mt-1">Start by adding your first resource</p>
                </div>
              </div>
            ) : (
              resources.map((resource) => (
                <div key={resource._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 group">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                          {getCategoryIcon(resource.category)}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{resource.title}</h3>
                          <p className="text-sm text-gray-500">{resource.category}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-blue-600">
                          <FaEdit className="w-5 h-5" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-red-600">
                          <FaTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{resource.description}</p>
                    <a
                      href={resource.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      <span>View Resource</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Add Resource Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl transform transition-all">
              {/* Modal Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">Add New Resource</h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleAddResource} className="px-6 py-4 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={newResource.title}
                    onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter resource title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newResource.description}
                    onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    rows="3"
                    placeholder="Add a brief description..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={newResource.category}
                    onChange={(e) => setNewResource({ ...newResource, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none bg-select-arrow bg-no-repeat bg-right-4"
                    required
                  >
                    <option value="Article">Article</option>
                    <option value="Video">Video</option>
                    <option value="Podcast">Podcast</option>
                    <option value="Book">Book</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload File</label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer">
                      <input
                        type="file"
                        onChange={(e) => setNewResource({ ...newResource, file: e.target.files[0] })}
                        className="hidden"
                        required
                      />
                      <FaFileUpload className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">
                        {newResource.file ? newResource.file.name : 'Click to upload file'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">PDF, DOCX, MP4, or other formats</p>
                    </label>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-5 py-2 text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                    disabled={addResourceMutation.isPending}
                  >
                    {addResourceMutation.isPending ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Adding...
                      </>
                    ) : (
                      'Add Resource'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddResourcePage;