import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

export default function WelcomePage() {
  return (
    <div className="h-screen w-screen bg-gradient-to-r from-white to-gray-100 flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full h-full flex flex-col lg:flex-row items-center text-black px-6 lg:px-16">
          
          {/* Text Section */}
          <div className="flex-1 text-center lg:text-left space-y-6">
            <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight">
              Welcome to <span className="text-yellow-300">Talkrio!</span>
            </h1>
            <p className="text-lg lg:text-xl opacity-90">
              You are not alone. Our supportive community has touched{" "}
              <span className="font-semibold">72 million lives</span> worldwide. 
              Let’s create a personalized plan with proven strategies to help you feel better.
            </p>

            {/* Get Started Button Centered */}
            <div className="flex justify-center lg:justify-start">
              <Link to="/quiz">
                <button className="mt-8 px-8 py-3 bg-yellow-300 text-blue-900 text-lg font-semibold rounded-lg shadow-md hover:bg-yellow-400 transition-all transform hover:scale-105">
                  Get Started →
                </button>
              </Link>
            </div>
          </div>

          {/* Image Section - Moved Down */}
          <div className="flex-1 flex items-center justify-center mt-6 lg:mt-12">
            <img
              src="/mind relaxation.jpg" // Replace with actual image path
              alt="Mind Relaxation"
              className="rounded-xl shadow-lg w-full max-w-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
