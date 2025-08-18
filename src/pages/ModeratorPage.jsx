import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  FaUsers, FaUserMd, FaBook, FaCheck, FaTimes, FaEdit, 
  FaFlag, FaComment, FaFileAlt, FaEye, FaFilter, FaTrash
} from 'react-icons/fa';
import { MdPsychology } from 'react-icons/md';
import { resolveReportAPI, viewReportPostAPI, deletePostAPI } from '../services/reportServices';
import { addResourceAPI } from '../services/resourceServices';
import { viewAllPsychiatristsAPI, verifyPsychiatristAPI } from '../services/moderatorServices';

// Psychiatrist Verification Section
const PsychiatristVerificationSection = ({ psychiatrists }) => {
  const queryClient = useQueryClient();

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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-slate-800">Psychiatrist Verification</h2>
        <div className="text-sm text-slate-500">
          Total: {psychiatrists.length} | Pending: {psychiatrists.filter(p => !p.verified).length}
        </div>
      </div>

      {/* Table */}
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
              {psychiatrists.length > 0 ? (
                psychiatrists.map((psychiatrist) => (
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

      {/* Loading Indicator */}
      {verificationMutation.isPending && (
        <div className="flex justify-center items-center p-4 bg-white rounded-xl shadow-sm border border-slate-100">
          <span className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></span>
          <span className="ml-2 text-slate-600">Processing...</span>
        </div>
      )}
    </div>
  );
};

// Moderation Section
const ModerationSection = ({ reportedContent }) => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContent, setSelectedContent] = useState(null);

  console.log('Reported Content:', reportedContent);

  const resolveMutation = useMutation({
    mutationFn: resolveReportAPI,
    onSuccess: () => queryClient.invalidateQueries(['reports']),
    onError: (error) => console.error('Error resolving report:', error),
  });

  const deletePostMutation = useMutation({
    mutationFn: deletePostAPI,
    onSuccess: () => {
      queryClient.invalidateQueries(['reports']);
      alert('Post deleted successfully');
    },
    onError: (error) => console.error('Error deleting post:', error),
  });

  const handleContentAction = (id, action) => {
    resolveMutation.mutate({ id, action });
    setSelectedContent(null);
  };

  const handleDeletePost = (postId) => {
    console.log('Deleting Post ID:', postId);
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePostMutation.mutate(postId);
    }
  };

  const filteredContent = reportedContent
    .map((item) => ({
      ...item,
      status: item.status === 'pending' ? 'pending' : 'resolved',
    }))
    .filter((item) => {
      const matchesFilter =
        filter === 'all' ||
        (filter === 'pending' && item.status === 'pending') ||
        (filter === 'resolved' && item.status === 'resolved') ||
        filter === item.type;

      const matchesSearch =
        item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.community.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesFilter && matchesSearch;
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-semibold text-slate-800">Content Moderation</h2>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search content, author, or community..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full sm:w-48 p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Reports</option>
            <option value="pending">Pending Only</option>
            <option value="resolved">Resolved Only</option>
            <option value="post">Posts Only</option>
            <option value="comment">Comments Only</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 text-left text-sm font-semibold text-slate-600 uppercase tracking-wider">Content Preview</th>
                <th className="p-4 text-left text-sm font-semibold text-slate-600 uppercase tracking-wider">Type</th>
                <th className="p-4 text-left text-sm font-semibold text-slate-600 uppercase tracking-wider">Author</th>
                <th className="p-4 text-left text-sm font-semibold text-slate-600 uppercase tracking-wider">Community</th>
                <th className="p-4 text-left text-sm font-semibold text-slate-600 uppercase tracking-wider">Reason</th>
                <th className="p-4 text-left text-sm font-semibold text-slate-600 uppercase tracking-wider">Flags</th>
                <th className="p-4 text-left text-sm font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="p-4 text-left text-sm font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredContent.map((report) => (
                <tr key={report.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                  <td className="p-4 max-w-xs">
                    <div className="text-slate-700">
                      {report.content.length > 60 ? `${report.content.substring(0, 60)}...` : report.content}
                    </div>
                    {report.content.length > 60 && (
                      <button
                        onClick={() => setSelectedContent(report)}
                        className="mt-1 text-blue-600 hover:underline text-sm flex items-center gap-2"
                      >
                        <FaEye /> View Full
                      </button>
                    )}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        report.type === 'post' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {report.type === 'post' ? <FaFileAlt className="mr-1" /> : <FaComment className="mr-1" />}
                      {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                    </span>
                  </td>
                  <td className="p-4">
                    <a href={`/users/${report.author}`} className="text-blue-600 hover:underline font-medium">
                      @{report.author}
                    </a>
                  </td>
                  <td className="p-4 text-slate-700">{report.community}</td>
                  <td className="p-4">
                    <span className="text-slate-600 italic">{report.reportReason}</span>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                      <FaFlag className="mr-1" /> {report.flags}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          report.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                      </span>
                      {report.status === 'resolved' && (
                        <>
                          <div className="text-xs text-slate-500">
                            {new Date(report.resolvedAt).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-slate-600 capitalize">
                            {report.actionTaken?.replace('_', ' ')}
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {report.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => handleContentAction(report.id, 'content_removed')}
                            className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                            title="Remove Content"
                          >
                            <FaTimes />
                          </button>
                          <button
                            onClick={() => handleContentAction(report.id, 'warning_issued')}
                            className="p-2 bg-amber-600 text-white rounded-full hover:bg-amber-700 transition-colors"
                            title="Warn User"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleContentAction(report.id, 'no_action')}
                            className="p-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors"
                            title="Approve"
                          >
                            <FaCheck />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleContentAction(report.id, 'reopen')}
                          className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                          title="Reopen Case"
                        >
                          <FaEdit />
                        </button>
                      )}
                      {report.type === 'post' && (
                        <button
                          onClick={() => handleDeletePost(report.targetId || report.id)}
                          className="p-2 bg-slate-600 text-white rounded-full hover:bg-slate-700 transition-colors"
                          title="Delete Post"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredContent.length === 0 && (
          <div className="p-6 text-center text-slate-500">No content matches your filters</div>
        )}
      </div>

      {selectedContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-800">Full Content Details</h3>
              <button
                onClick={() => setSelectedContent(null)}
                className="text-slate-500 hover:text-slate-700 transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <span className="font-medium text-slate-600">Content:</span>
                <p className="mt-1 text-slate-800 bg-slate-50 p-3 rounded-lg">{selectedContent.content}</p>
              </div>
              <div>
                <span className="font-medium text-slate-600">Author:</span>
                <p className="mt-1 text-slate-800">@{selectedContent.author}</p>
              </div>
              <div>
                <span className="font-medium text-slate-600">Community:</span>
                <p className="mt-1 text-slate-800">{selectedContent.community}</p>
              </div>
              <div>
                <span className="font-medium text-slate-600">Reported On:</span>
                <p className="mt-1 text-slate-800">{new Date(selectedContent.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <span className="font-medium text-slate-600">Reason:</span>
                <p className="mt-1 text-slate-800 italic">{selectedContent.reportReason}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setSelectedContent(null)}
                className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main ModeratorDashboard Component
const ModeratorDashboard = () => {
  const [activeTab, setActiveTab] = useState('moderation');
  const [communities, setCommunities] = useState([]);
  const [psychiatrists, setPsychiatrists] = useState([]);
  const [resources, setResources] = useState([]);
  const queryClient = useQueryClient();

  const { data: reportedContent, isLoading, error, refetch } = useQuery({
    queryKey: ['reports'],
    queryFn: viewReportPostAPI,
    initialData: [],
  });

  const [newCommunity, setNewCommunity] = useState({ name: '', description: '' });
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    category: 'Article',
    file: null,
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const addResourceMutation = useMutation({
    mutationFn: ({ resourceData, file }) => addResource(resourceData, file),
    onSuccess: (data) => {
      setResources((prev) => [...prev, data.resource]);
      setNewResource({ title: '', description: '', category: 'Article', file: null });
      setShowAddForm(false);
      alert('Resource added successfully');
    },
    onError: (error) => {
      console.error('Mutation Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      alert(`Failed to add resource: ${error.response?.data?.message || error.message}`);
    },
  });

  const handleAddResource = async (e) => {
    e.preventDefault();
    const { title, description, category, file } = newResource;

    try {
      await addResource({ title, description, category }, file);
      setShowAddForm(false);
    } catch (error) {
      alert(error.message);
    }
  };

  const { 
    data: psychiatristsData, 
    isLoading: psychiatristsLoading, 
    error: psychiatristsError, 
    refetch: refetchPsychiatrists 
  } = useQuery({
    queryKey: ['psychiatrists'],
    queryFn: viewAllPsychiatristsAPI,
    initialData: [],
    onSuccess: (data) => setPsychiatrists(data),
    onError: (error) => console.error('Error fetching psychiatrists:', error),
  });
  console.log(psychiatristsData);

  const stats = [
    { title: 'Total Communities', value: communities.length, icon: <FaUsers />, color: 'blue-600' },
    { title: 'Pending Verifications', value: psychiatrists.filter((p) => !p.verified).length, icon: <MdPsychology />, color: 'amber-500' },
    { title: 'Verified Professionals', value: psychiatrists.filter((p) => p.verified).length, icon: <FaUserMd />, color: 'emerald-600' },
    { title: 'Resources Available', value: resources.length, icon: <FaBook />, color: 'red-600' },
    { title: 'Pending Reports', value: reportedContent.filter((r) => r.status === 'pending').length, icon: <FaFlag />, color: 'teal-500' },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Sidebar */}
      <div className="w-72 bg-white border-r border-slate-200 p-6 flex flex-col shadow-sm">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-800">Moderator Hub</h2>
          <p className="text-sm text-slate-500 mt-1">Manage content & professionals</p>
        </div>
        <button
          onClick={() => setActiveTab('moderation')}
          className={`flex items-center gap-3 p-3 mb-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'moderation' ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <FaFlag /> Content Moderation
        </button>
        <button
          onClick={() => setActiveTab('resources')}
          className={`flex items-center gap-3 p-3 mb-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'resources' ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <FaBook /> Resources
        </button>
        <button
          onClick={() => setActiveTab('psychiatrists')}
          className={`flex items-center gap-3 p-3 mb-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'psychiatrists' ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <FaUserMd /> Psychiatrist Verification
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            {activeTab === 'moderation' && 'Content Moderation'}
            {activeTab === 'resources' && 'Resource Center'}
            {activeTab === 'psychiatrists' && 'Psychiatrist Verification'}
          </h1>
          <input
            type="text"
            placeholder="Search..."
            className="w-72 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div className={`text-2xl text-${stat.color}`}>{stat.icon}</div>
              <div>
                <p className="text-sm text-slate-600">{stat.title}</p>
                <p className="text-xl font-semibold text-slate-800">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {activeTab === 'moderation' && (
          <div>
            {isLoading ? (
              <div className="text-center p-6 text-slate-600">Loading reports...</div>
            ) : error ? (
              <div className="text-center p-6 bg-white rounded-xl shadow-sm max-w-2xl mx-auto">
                <div className="text-red-600 mb-4">⚠️ Error loading reports: {error.message}</div>
                <button
                  onClick={refetch}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : (
              <ModerationSection reportedContent={reportedContent} />
            )}
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h2 className="text-2xl font-semibold text-slate-800">Resource Center</h2>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Resource
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              {resources.length === 0 ? (
                <p className="text-slate-500 text-center py-6">No resources available yet</p>
              ) : (
                <ul className="space-y-6">
                  {resources.map((resource) => (
                    <li key={resource._id} className="border-b border-slate-200 pb-4 last:border-b-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-lg font-semibold text-slate-800">{resource.title}</p>
                          <p className="text-slate-600 mt-1">{resource.description}</p>
                          <p className="text-sm text-slate-500 mt-1">Category: {resource.category}</p>
                          <a
                            href={resource.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline mt-2 inline-block"
                          >
                            View Resource
                          </a>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {showAddForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-slate-800">Add New Resource</h3>
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="text-slate-500 hover:text-slate-700 transition-colors"
                    >
                      <FaTimes size={20} />
                    </button>
                  </div>
                  <form onSubmit={handleAddResource} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                      <input
                        type="text"
                        value={newResource.title}
                        onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                      <textarea
                        value={newResource.description}
                        onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows="3"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                      <select
                        value={newResource.category}
                        onChange={(e) => setNewResource({ ...newResource, category: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                      <label className="block text-sm font-medium text-slate-700 mb-2">File Upload</label>
                      <input
                        type="file"
                        onChange={(e) => setNewResource({ ...newResource, file: e.target.files[0] })}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg text-slate-600"
                        required
                      />
                    </div>
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setShowAddForm(false)}
                        className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        disabled={addResourceMutation.isPending}
                      >
                        {addResourceMutation.isPending ? 'Adding...' : 'Add Resource'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'psychiatrists' && (
          <div>
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
              <PsychiatristVerificationSection psychiatrists={psychiatristsData} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModeratorDashboard;