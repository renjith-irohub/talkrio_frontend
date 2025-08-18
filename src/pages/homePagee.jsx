import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Services from "../components/Services";
import Footer from "../components/Footer";

const Homepagee = () => {
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

  const features = [
    {
      icon: "💬",
      title: "Free 24/7 Chat",
      description: "Connect with caring listeners for free emotional support anytime, anywhere."
    },
    {
      icon: "🛋️",
      title: "Affordable Online Therapy",
      description: "Professional counseling with licensed therapists at accessible rates."
    },
    {
      icon: "📚",
      title: "Self-Help Resources",
      description: "Curated guides and tools to support your mental health journey."
    }
  ];

  return (
    <div className="relative min-h-screen flex flex-col text-white overflow-x-hidden">
      {/* Background Slideshow with Improved Transition */}
      <div className="fixed inset-0 -z-10">
        {images.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${index === currentImage ? 'opacity-100' : 'opacity-0'}`}
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30"></div>
      </div>

      <Navbar />

      {/* Hero Section with Enhanced Styling */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl space-y-6 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Welcome to <span className="text-yellow-400">Talkrio</span>
          </h1>
          <p className="text-xl md:text-2xl font-medium text-gray-200 max-w-2xl mx-auto">
            Your compassionate space for emotional support and professional guidance
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <Link 
              to="/welcome" 
              className="group transition-all duration-300"
            >
              <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-8 py-4 rounded-xl text-lg font-semibold shadow-lg transform group-hover:-translate-y-1 transition-transform">
                Join Now
              </button>
            </Link>
            <Link 
              to="/subscribe" 
              className="group transition-all duration-300"
            >
              <button className="bg-transparent border-2 border-white hover:bg-white/20 px-8 py-4 rounded-xl text-lg font-semibold shadow-lg transform group-hover:-translate-y-1 transition-transform">
                Considering therapy?
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section with Modern Cards */}
      <section className="relative py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">How We Can Help</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white/5 border border-white/10 p-8 rounded-2xl shadow-lg hover:bg-white/10 transition-all duration-300 hover:-translate-y-2"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-200">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <div className="relative z-10 py-20 bg-gray-900/80">
        <Services />
      </div>

      {/* Contact Section with Improved Design */}
      {/* <section className="relative z-10 py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-900/80 to-purple-900/80 p-10 rounded-3xl shadow-2xl border border-white/10 backdrop-blur-sm">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Get in Touch</h2>
            <p className="text-xl text-gray-200 mb-8">
              Have questions or need support? Our team is here to help.
            </p>
            <div className="space-y-4 max-w-md mx-auto">
              <p className="text-lg">
                <span className="font-semibold">Email:</span> support@talkrio.com
              </p>
              <p className="text-lg">
                <span className="font-semibold">Hours:</span> 24/7 Support
              </p>
              <Link 
                to="/contact" 
                className="inline-block mt-6 group"
              >
                <button className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-3 rounded-xl text-lg font-semibold shadow-lg transition-all duration-300 transform group-hover:scale-105">
                  Contact Form
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section> */}

    </div>
  );
};

export default Homepagee;