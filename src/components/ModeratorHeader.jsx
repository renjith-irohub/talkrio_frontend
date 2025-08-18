// components/ModeratorSidebar.jsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaFlag, FaBook, FaUserMd, FaUsers, FaSignOutAlt } from 'react-icons/fa';
import { useDispatch } from 'react-redux';


const ModeratorSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.clear();
    window.location.href = "/homepage";
  };

  return (
    <aside className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0 border-r border-slate-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-blue-600 to-indigo-700">
        <h1 className="text-2xl font-bold text-white">Moderator Hub</h1>
        <p className="text-sm text-blue-100 mt-1">Manage platform content</p>
      </div>

      {/* Navigation */}
      <nav className="flex-grow p-4 flex flex-col">
        <ul className="space-y-2">
          <li>
            <Link
              to="/content-moderation"
              className={`flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-all ${
                location.pathname === '/content-moderation'
                  ? 'bg-blue-100 text-blue-700 shadow-inner'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-blue-600'
              }`}
            >
              <FaFlag className="text-blue-500" />
              Content Moderation
            </Link>
          </li>
          <li>
            <Link
              to="/moderator-resources"
              className={`flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-all ${
                location.pathname === '/moderator-resources'
                  ? 'bg-blue-100 text-blue-700 shadow-inner'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-blue-600'
              }`}
            >
              <FaBook className="text-blue-500" />
              Resources
            </Link>
          </li>
          <li>
            <Link
              to="/psychiatrist-verification"
              className={`flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-all ${
                location.pathname === '/psychiatrist-verification'
                  ? 'bg-blue-100 text-blue-700 shadow-inner'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-blue-600'
              }`}
            >
              <FaUserMd className="text-blue-500" />
              Psychiatrist Verification
            </Link>
          </li>
          <li>
            <Link
              to="/community-management"
              className={`flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-all ${
                location.pathname === '/community-management'
                  ? 'bg-blue-100 text-blue-700 shadow-inner'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-blue-600'
              }`}
            >
              <FaUsers className="text-blue-500" />
              Community Management
            </Link>
          </li>
        </ul>

        {/* Logout Button at bottom */}
        <div className="mt-auto p-4 border-t border-slate-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-red-600 transition-all"
          >
            <FaSignOutAlt className="text-red-500" />
            Logout
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default ModeratorSidebar;