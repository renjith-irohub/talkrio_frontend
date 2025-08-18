import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Bookmark, Heart, Clock, User, FileText, Play, Link, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import { getResourcesAPI, searchResourcesAPI } from '../services/resourceServices';

const ResourcesPage = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: resources, isLoading, error } = useQuery({
    queryKey: ['resource'],
    queryFn: getResourcesAPI,
  });

  const searchMutation = useMutation({
    mutationFn: searchResourcesAPI,
    onSuccess: (data) => {
      console.log('Search Results:', data);
      queryClient.setQueryData(['resource'], data);
    },
    onError: (error) => {
      console.error('Search error:', error.response?.data || error.message);
    },
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchMutation.mutate(searchQuery);
    } else {
      queryClient.invalidateQueries(['resource']);
    }
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    if (!e.target.value.trim()) {
      queryClient.invalidateQueries(['resource']);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      article: 'bg-blue-100 text-blue-800',
      video: 'bg-purple-100 text-purple-800',
      podcast: 'bg-green-100 text-green-800',
      tool: 'bg-orange-100 text-orange-800',
      pdf: 'bg-gray-100 text-gray-800',
      default: 'bg-gray-100 text-gray-800',
    };
    return colors[category.toLowerCase()] || colors.default;
  };

  const handleDownloadPDF = (link, title) => {
    fetch(link, { method: 'GET' })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to download PDF');
        return response.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      })
      .catch((err) => console.error('Download error:', err));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-50 p-6 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-red-500" />
          <p className="text-red-600">Error loading resources: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 pt-20">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Knowledge Hub</h1>
          <p className="text-gray-600">Curated resources for professional growth</p>
        </div>

        <form onSubmit={handleSearch} className="mb-12 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              placeholder="Search articles, videos, tools..."
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
            <button
              type="submit"
              disabled={searchMutation.isLoading}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-500 text-white px-4 py-1.5 rounded-md hover:bg-blue-600 disabled:bg-gray-300 transition-colors"
            >
              {searchMutation.isLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources && resources.length > 0 ? (
            resources.map((resource) => (
              <div
                key={resource._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`${getCategoryColor(resource.category)} p-2 rounded-lg`}>
                      {resource.category.toLowerCase() === 'video' ? (
                        <Play className="w-6 h-6" />
                      ) : resource.category.toLowerCase() === 'pdf' || resource.link.endsWith('.pdf') ? (
                        <FileText className="w-6 h-6" />
                      ) : (
                        <FileText className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-1">{resource.title}</h2>
                      <span className="inline-block px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-600">
                        {resource.category}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6 leading-relaxed">{resource.description}</p>

                  <div className="flex items-center gap-3 text-sm text-gray-500 mb-6">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>
                        {new Date(resource.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{resource.addedBy?.name || 'Unknown'}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    {resource.link.endsWith('.pdf') ? (
                      <button
                        onClick={() => handleDownloadPDF(resource.link, resource.title)}
                        className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 font-medium"
                      >
                        <Link className="w-5 h-5" />
                        Download PDF
                      </button>
                    ) : (
                      <a
                        href={resource.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 font-medium"
                      >
                        <Link className="w-5 h-5" />
                        Visit Resource
                      </a>
                    )}
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-blue-600">
                        <Bookmark className="w-5 h-5" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-red-600">
                        <Heart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center">
              <div className="max-w-md mx-auto">
                <div className="mb-4 text-gray-400">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No resources found</h3>
                <p className="text-gray-600">Try adjusting your search terms</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;