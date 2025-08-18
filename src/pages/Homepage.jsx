import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar2 from "../components/Navbar2";

const Homepage = () => {
  const images = [
    "../slides1.jpg",
    "../friends.jpg",
    "../img3.jpg",
  ];
  
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Feature cards data
  const features = [
    {
      title: "Free 24/7 Chat",
      description: "Talkrio connects you to caring listeners for free emotional support.",
      icon: "💬"
    },
    {
      title: "Affordable Therapy Online",
      description: "Confidential online therapy & coaching with licensed therapists for a low monthly fee.",
      icon: "🛋️"
    },
    {
      title: "Grow at Your Own Pace",
      description: "Explore self-help guides & growth paths for proven tips and advice on how to feel better.",
      icon: "🌱"
    }
  ];

  return (
    <div className="relative min-h-screen flex flex-col text-center text-white overflow-hidden">
      {/* Background Slideshow */}
      <div className="fixed inset-0 h-screen w-full -z-10">
        {images.map((image, index) => (
          <div 
            key={index}
            className={`absolute inset-0 h-full w-full bg-cover bg-center transition-opacity duration-1000 ease-in-out ${index === currentImage ? 'opacity-100' : 'opacity-0'}`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30"></div>
      </div>

      <Navbar2 />

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen w-full px-6 py-24">
        <div className="max-w-4xl space-y-6 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Welcome to <span className="text-yellow-400">Talkrio</span>
          </h1>
          <p className="text-xl md:text-2xl font-medium text-gray-200 max-w-2xl mx-auto">
            Your safe space for emotional support and professional counseling
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <Link to="/login" className="group">
              <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-8 py-4 rounded-xl text-lg font-semibold shadow-lg transition-all duration-300 transform group-hover:-translate-y-1 group-hover:shadow-xl">
                Get Started
              </button>
            </Link>
            <Link to="/about" className="group">
              <button className="bg-transparent border-2 border-white hover:bg-white/20 px-8 py-4 rounded-xl text-lg font-semibold shadow-lg transition-all duration-300 transform group-hover:-translate-y-1 group-hover:shadow-xl">
                How it Works?
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 bg-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">How Talkrio Helps You</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white/10 border border-white/20 p-8 rounded-2xl shadow-lg hover:bg-white/20 transition-all duration-300 hover:-translate-y-2"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-200">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial/CTA Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-4xl mx-auto px-6 bg-black/40 backdrop-blur-sm p-12 rounded-3xl border border-white/10">
          <blockquote className="text-2xl italic mb-6">
            "Talkrio helped me through my darkest times. The listeners were compassionate and the therapists professional."
          </blockquote>
          <p className="font-bold">- Sarah M., User since 2022</p>
          <Link to="/userregister" className="inline-block mt-8 group">
            <button className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 px-8 py-4 rounded-xl text-lg font-bold shadow-lg transition-all duration-300 transform group-hover:scale-105">
              Join Our Community
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 bg-black/50">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300">© 2023 Talkrio. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-gray-300 hover:text-white">Privacy</Link>
            <Link to="/terms" className="text-gray-300 hover:text-white">Terms</Link>
            <Link to="/contact" className="text-gray-300 hover:text-white">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;