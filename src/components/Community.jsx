import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaBrain, FaHeartbeat, FaSmile, 
  FaRegSadTear, FaRegMeh, FaRegGrinSquintTears, 
  FaRegGrinBeamSweat, FaRegGrinTongueWink, 
  FaRegGrinStars, FaRegGrinHearts, FaSearch,
  FaUserFriends, FaComments
} from 'react-icons/fa';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllCommunitiesAPI, joinCommunityAPI } from '../services/communityServices';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Community = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  

  const { id: userId } = useSelector((state) => state.auth);

  const { data: communities = [], isLoading, error } = useQuery({
    queryKey: ['communities'],
    queryFn: getAllCommunitiesAPI,
    initialData: [],
  });
  console.log('Communities from useQuery:', communities);

  const joinMutation = useMutation({
    mutationFn: joinCommunityAPI,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['communities']);
      alert('Successfully joined the community!');
      navigate(`/community-chat/${variables.name}`);
    },
    onError: (error) => {
      console.error('Error joining community:', error);
      alert('Failed to join community: ' + error.message);
    },
  });

  const filters = [
    { id: 'all', label: 'All Communities', icon: <FaUserFriends /> },
    { id: 'mood', label: 'Mood Disorders', icon: <FaRegSadTear /> },
    { id: 'anxiety', label: 'Anxiety', icon: <FaRegMeh /> },
    { id: 'trauma', label: 'Trauma', icon: <FaRegGrinSquintTears /> },
    { id: 'neurodevelopmental', label: 'Neurodiversity', icon: <FaRegGrinTongueWink /> },
  ];

  const communityIcons = {
    mood: <FaRegSadTear className="text-purple-500" />,
    anxiety: <FaRegMeh className="text-pink-500" />,
    trauma: <FaRegGrinSquintTears className="text-indigo-500" />,
    psychotic: <FaBrain className="text-teal-500" />,
    neurodevelopmental: <FaRegGrinTongueWink className="text-yellow-500" />,
  };

  const communityColors = {
    mood: 'bg-purple-100',
    anxiety: 'bg-pink-100',
    trauma: 'bg-indigo-100',
    psychotic: 'bg-teal-100',
    neurodevelopmental: 'bg-yellow-100',
  };

  const filteredCommunities = communities
    .map((community) => {
      const category = community.symptomsDiscussed?.length > 0 
        ? community.symptomsDiscussed[0].toLowerCase() 
        : 'other';
      const isMember = community.members?.includes(userId); // Check if user is a member
      return {
        ...community,
        category,
        icon: communityIcons[category] || <FaSmile className="text-cyan-500" />,
        color: communityColors[category] || 'bg-cyan-100',
        members: community.members?.length || 0,
        active: Math.floor(Math.random() * 100) + 1,
        activity: "Community active",
        isMember, // Add membership status
      };
    })
    .filter((community) =>
      activeFilter === 'all' || community.category === activeFilter
    )
    .filter((community) =>
      community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (community.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

  const formatNumber = (num) => {
    return num >= 1000 ? `${(num / 1000).toFixed(1)}k` : num;
  };

  const handleJoinOrChat = (community) => {
    if (community.isMember) {
      // If already a member, go directly to chat
      navigate(`/community-chat/${community.name}`);
    } else {
      // If not a member, join the community
      joinMutation.mutate({ name: community.name });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <section className="py-16 px-4 bg-gradient-to-r from-indigo-50 to-white">
        <div className="max-w-7xl mx-auto text-center pt-20">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Your <span className="text-indigo-600">Support Community</span>
          </h1>
          <div className="relative max-w-md mx-auto">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search communities..."
              className="w-full pl-10 pr-3 py-3 border rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>
      <main className="py-12 px-4 max-w-7xl mx-auto">
        {isLoading ? (
          <div className="text-center p-6 text-gray-600">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
            <span>Loading communities...</span>
          </div>
        ) : error ? (
          <div className="text-center p-6 bg-white rounded-xl shadow-sm max-w-2xl mx-auto">
            <div className="text-red-600 mb-4">⚠️ Error loading communities: {error.message}</div>
          </div>
        ) : (
          <>
            <div className="flex overflow-x-auto scrollbar-hide space-x-2 mb-8 pb-2">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`flex items-center space-x-2 whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeFilter === filter.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>{filter.icon}</span>
                  <span>{filter.label}</span>
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCommunities.map((community, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-lg ${community.color} flex items-center justify-center`}>
                        {community.icon}
                      </div>
                      <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        {formatNumber(community.active)} online
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{community.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{community.description || 'No description available'}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">{formatNumber(community.members)} members</span>
                      <button
                        onClick={() => handleJoinOrChat(community)}
                        className="text-indigo-600 flex items-center hover:text-indigo-800 transition-colors"
                        disabled={joinMutation.isLoading && joinMutation.variables?.name === community.name}
                      >
                        {joinMutation.isLoading && joinMutation.variables?.name === community.name ? (
                          <FaComments className="animate-spin mr-1" />
                        ) : (
                          <FaComments className="mr-1" />
                        )}
                        {community.isMember ? 'Chat' : 'Join'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            {filteredCommunities.length === 0 && (
              <div className="text-center p-6 text-gray-500">
                No communities match your search or filter
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Community;