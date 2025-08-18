import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  FaBars, 
  FaTimes, 
  FaHome, 
  FaInfoCircle, 
  FaConciergeBell, 
  FaUserCircle,
  FaChevronDown,
  FaSearch
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { RiMentalHealthLine } from "react-icons/ri";
import { BiMessageSquareDetail } from "react-icons/bi";

const Navbar2 = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed w-full z-50 text-blue-800 transition-all duration-500 ${scrolled ? "bg-gray-900/95 backdrop-blur-md py-2 shadow-2xl" : "bg-transparent py-4"}`}>
      <div className="container mx-auto px-4 xl:px-0">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 group relative"
          >
            <motion.div
              className="absolute -inset-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300"
            />
            <motion.img 
              src="/logo-img.png" 
              alt="Talkrio Logo" 
              className="w-12 h-10 object-contain z-10"
              whileHover={{ 
                scale: 1.05,
                rotate: [0, 5, -5, 0]
              }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            />
            <motion.span 
              className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent z-10"
              whileHover={{
                background: "linear-gradient(to right, #22d3ee, #3b82f6)",
                transition: { duration: 0.3 }
              }}
            >
              Talkrio
            </motion.span>
          </Link>
          
          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link 
              to="/" 
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${location.pathname === "/" ? "bg-gray-800 text-cyan-400" : "hover:bg-gray-800/50 hover:text-cyan-300"}`}
            >
              <FaHome className="text-cyan-400" />
              <span>Home</span>
            </Link>
            
            <Link 
              to="/about" 
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${location.pathname === "/about" ? "bg-gray-800 text-cyan-400" : "hover:bg-gray-800/50 hover:text-cyan-300"}`}
            >
              <FaInfoCircle className="text-cyan-400" />
              <span>About</span>
            </Link>
            
            <Link 
              to="/service" 
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${location.pathname.startsWith("/service") ? "bg-gray-800 text-cyan-400" : "hover:bg-gray-800/50 hover:text-cyan-300"}`}
            >
              <FaConciergeBell className="text-cyan-400" />
              <span>Services</span>
              <motion.div
                animate={{ rotate: 0 }}
                transition={{ duration: 0.2 }}
              >
                <FaChevronDown className="text-xs" />
              </motion.div>
            </Link>
            
            {/* Search Bar */}
            <div className="relative ml-4">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 bg-gray-800/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-gray-800 w-48 transition-all"
              />
            </div>
            
            {/* Auth Buttons */}
            <div className="flex items-center space-x-2 ml-4">
              <Link to="/login">
                <motion.button 
                  className="px-4 py-2 rounded-lg text-white hover:bg-gray-800/50 transition-colors"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Log In
                </motion.button>
              </Link>
              <Link to="/userregister">
                <motion.button 
                  className="px-6 py-2 rounded-lg text-white bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg hover:shadow-xl transition-all flex items-center space-x-2"
                  whileHover={{ 
                    scale: 1.05,
                    background: "linear-gradient(to right, #22d3ee, #3b82f6)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaUserCircle />
                  <span>Sign Up</span>
                </motion.button>
              </Link>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <motion.button 
            className="lg:hidden text-white p-2 relative z-50"
            onClick={() => setIsOpen(!isOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isOpen ? (
              <FaTimes size={24} className="text-cyan-400" />
            ) : (
              <FaBars size={24} />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="lg:hidden fixed inset-0 bg-gray-900/95 backdrop-blur-lg z-40 pt-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-4">
              <nav className="flex flex-col space-y-2">
                <Link 
                  to="/" 
                  className={`px-6 py-4 rounded-xl flex items-center space-x-4 text-lg ${location.pathname === "/" ? "bg-gray-800 text-cyan-400" : "hover:bg-gray-800/50"}`}
                  onClick={() => setIsOpen(false)}
                >
                  <FaHome className="text-cyan-400" />
                  <span>Home</span>
                </Link>
                
                <Link 
                  to="/about" 
                  className={`px-6 py-4 rounded-xl flex items-center space-x-4 text-lg ${location.pathname === "/about" ? "bg-gray-800 text-cyan-400" : "hover:bg-gray-800/50"}`}
                  onClick={() => setIsOpen(false)}
                >
                  <FaInfoCircle className="text-cyan-400" />
                  <span>About</span>
                </Link>
                
                <Link 
                  to="/service" 
                  className={`px-6 py-4 rounded-xl flex items-center space-x-4 text-lg ${location.pathname.startsWith("/service") ? "bg-gray-800 text-cyan-400" : "hover:bg-gray-800/50"}`}
                  onClick={() => setIsOpen(false)}
                >
                  <FaConciergeBell className="text-cyan-400" />
                  <span>Services</span>
                </Link>
                
                {/* Mobile Search */}
                <div className="relative px-6 py-4">
                  <FaSearch className="absolute left-10 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-12 pr-4 py-3 bg-gray-800/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-gray-800"
                  />
                </div>
                
                {/* Mobile Auth Buttons */}
                <div className="flex flex-col space-y-4 px-6 py-4">
                  <Link to="/login">
                    <motion.button 
                      className="w-full px-6 py-3 rounded-xl text-white bg-gray-800 hover:bg-gray-700 transition-colors"
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsOpen(false)}
                    >
                      Log In
                    </motion.button>
                  </Link>
                  <Link to="/signup">
                    <motion.button 
                      className="w-full px-6 py-3 rounded-xl text-white bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2"
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsOpen(false)}
                    >
                      <FaUserCircle />
                      <span>Sign Up</span>
                    </motion.button>
                  </Link>
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar2;
