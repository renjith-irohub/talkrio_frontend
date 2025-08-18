import { useQuery } from '@tanstack/react-query';
import { getUserProfileAPI } from '../services/userServices';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaArrowLeft, FaExclamationCircle, FaRedo } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';
import { motion } from 'framer-motion';
import Navbar from './Navbar';

const UserProfile = () => {
  const navigate = useNavigate();

  // Fetch user profile data using useQuery
  const { data: response, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['userProfile'],
    queryFn: getUserProfileAPI,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  // Animation variants for card
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // Common content wrapper with Navbar
  const renderContent = (content) => (
    <div className="min-h-screen bg-white-900">
      <Navbar />
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        {content}
      </div>
    </div>
  );

  // Loading state
  if (isLoading) {
    return renderContent(
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <div className="text-center">
          <ClipLoader color="#6366f1" size={40} />
          <p className="mt-4 text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return renderContent(
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <div className="text-center bg-gray-800 p-6 rounded-lg shadow-lg">
          <FaExclamationCircle className="text-red-500 text-4xl mx-auto mb-4" />
          <p className="text-red-400 mb-4">Error: {error.message}</p>
          <button
            onClick={() => refetch()}
            className="flex items-center mx-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            <FaRedo className="mr-2" /> Retry
          </button>
        </div>
      </div>
    );
  }

  const { user } = response;

  return renderContent(
    <div className="max-w-3xl mx-auto">
      {/* Back Button */}
      <motion.button
        onClick={() => navigate(-1)}
        className="flex items-center text-sm text-gray-400 hover:text-indigo-400 transition duration-300 mb-6"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaArrowLeft className="mr-2" /> Back
      </motion.button>

      {/* Profile Card */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-center">
          <FaUserCircle className="text-white text-6xl mx-auto mb-4 opacity-90" />
          <h1 className="text-2xl font-bold text-white">Your Profile</h1>
        </div>

        {/* Profile Details */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-700 pb-4">
              <div>
                <label className="block text-sm font-medium text-gray-400">Username</label>
                <p className="text-lg text-white font-semibold">{user.username}</p>
              </div>
              <span className="text-gray-500 text-sm">{user.username}</span>
            </div>

            <div className="flex items-center justify-between border-b border-gray-700 pb-4">
              <div>
                <label className="block text-sm font-medium text-gray-400">Email</label>
                <p className="text-lg text-white font-semibold">{user.email}</p>
              </div>
              <span className="text-gray-500 text-sm">{user.email}</span>
            </div>

            <div className="flex items-center justify-between border-b border-gray-700 pb-4">
              <div>
                <label className="block text-sm font-medium text-gray-400">Account Role</label>
                <p className="text-lg text-white font-semibold capitalize">{user.role}</p>
              </div>
              <span className="text-gray-500 text-sm capitalize">{user.role}</span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-400">Subscription Plan</label>
                <p className="text-lg text-white font-semibold capitalize">
                  {user.plan || 'No active plan'}
                </p>
              </div>
              <span className="text-gray-500 text-sm capitalize">
                {user.plan || 'None'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            {/* <motion.button
              onClick={() => navigate('/edit-profile')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Edit Profile
            </motion.button> */}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserProfile;