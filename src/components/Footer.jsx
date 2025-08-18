import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8 mt-16 w-full text-center">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-6 text-sm">
        {/* Company Info */}
        <div>
          <h3 className="text-lg font-bold text-white">Talkrio</h3>
          <p className="mt-2">Seamless and secure communication for everyone.</p>
        </div>
        
        {/* Navigation Links */}
        <div>
          <h3 className="text-lg font-bold text-white">Quick Links</h3>
          <ul className="mt-2 space-y-2">
          {/* <li><Link to="/admin-dashboard" className="hover:text-white">Admin Dasboard</Link></li> */}
            {/* <li><Link to="/moderator-page" className="hover:text-white">Moderator Page</Link></li> */}
            <li><Link to="/about" className="hover:text-white">About</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
            <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
          </ul>
        </div>
        
        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-bold text-white">Contact</h3>
          <p className="mt-2">Email: support@talkrio.com</p>
          <p>Phone: +1 (123) 456-7890</p>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-6 pt-4 text-sm">
        &copy; {new Date().getFullYear()} Talkrio. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
