// components/PsychiatristHeader.jsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

const PsychiatristHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { name, role, isLogin } = useSelector((state) => state.auth);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.clear();
    window.location.href = "/homepage";
  };

  if (!isLogin || role !== 'psychiatrist') {
    return null;
  }

  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Psychiatrist Portal
          </h1>
          <span className="ml-4 px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-sm font-medium text-white shadow-md hover:shadow-lg transition-shadow duration-200 flex items-center">
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {name || 'Doctor'}
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          <nav className="flex space-x-1 md:space-x-2 w-full md:w-auto overflow-x-auto py-2">
            <Link
              to="/psychiatristdashboard"
              className={`px-4 py-2 rounded-lg text-sm md:text-base font-medium transition-all duration-200 ${
                location.pathname === '/psychiatristdashboard'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-white hover:bg-white hover:text-blue-600 hover:bg-opacity-20 hover:shadow-sm'
              }`}
            >
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Dashboard
              </span>
            </Link>
            
            <Link
              to="/viewdoctorappointment"
              className={`px-4 py-2 rounded-lg text-sm md:text-base font-medium transition-all duration-200 ${
                location.pathname === '/viewdoctorappointment'
                  ? 'bg-white text-blue-600  shadow-md'
                  : 'text-white hover:bg-white hover:text-blue-600 hover:bg-opacity-20 hover:shadow-sm'
              }`}
            >
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Appointments
              </span>
            </Link>
            
            <Link
              to="/edit-profile"
              className={`px-4 py-2 rounded-lg text-sm md:text-base font-medium transition-all duration-200 ${
                location.pathname === '/edit-profile'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-white hover:bg-white hover:text-blue-600 hover:bg-opacity-20 hover:shadow-sm'
              }`}
            >
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </span>
            </Link>
          </nav>

          <button
            onClick={handleLogout}
            className="ml-2 p-2 rounded-full text-white hover:bg-white hover:text-blue-600 hover:bg-opacity-20 hover:shadow-sm transition-all duration-200"
            title="Logout"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default PsychiatristHeader;