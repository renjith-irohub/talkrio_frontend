// pages/ContentModerationPage.jsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaFilter, FaFileAlt, FaComment, FaTimes, FaTrash, FaEye, FaFlag, FaCheckCircle } from 'react-icons/fa';
import { resolveReportAPI, viewReportPostAPI, deleteReportAPI } from '../services/reportServices';
import ModeratorSidebar from './ModeratorHeader';

const ContentModerationPage = () => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContent, setSelectedContent] = useState(null);

  const { data: reportedContent, isLoading, error, refetch } = useQuery({
    queryKey: ['reports'],
    queryFn: viewReportPostAPI,
    initialData: [],
  });

  const resolveMutation = useMutation({
    mutationFn: resolveReportAPI,
    onSuccess: () => {
      queryClient.invalidateQueries(['reports']);
      alert('Content removed successfully');
    },
    onError: (error) => console.error('Error resolving report:', error),
  });

  const deleteReportMutation = useMutation({
    mutationFn: deleteReportAPI,
    onSuccess: () => {
      queryClient.invalidateQueries(['reports']);
      alert('Report deleted successfully');
    },
    onError: (error) => console.error('Error deleting report:', error),
  });

  const handleContentAction = (id, action) => {
    if (window.confirm('Are you sure you want to remove this content?')) {
      resolveMutation.mutate({ id, action });
      setSelectedContent(null);
    }
  };

  const handleDeleteReport = (reportId) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      deleteReportMutation.mutate(reportId);
    }
  };

  // Check if reportedContent is an array before mapping
  const filteredContent = Array.isArray(reportedContent)
    ? reportedContent
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
        })
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      <ModeratorSidebar />
      <main className="flex-grow p-8 ml-64">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">Content Moderation</h1>

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
        ) : reportedContent.message ? (
          <div className="text-center p-12 bg-white rounded-xl shadow-md max-w-2xl mx-auto">
            <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-slate-800 mb-2">All Clear!</h2>
            <p className="text-slate-600">{reportedContent.message}</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h2 className="text-2xl font-semibold text-slate-800">Reported Content</h2>
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
                            {report.status === 'pending' && (
                              <button
                                onClick={() => handleContentAction(report.id, 'content_removed')}
                                className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                                title="Remove Content"
                              >
                                <FaTimes />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteReport(report.id)}
                              className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
                              title="Delete Report"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredContent.length === 0 && !reportedContent.message && (
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
        )}
      </main>
    </div>
  );
};

export default ContentModerationPage;