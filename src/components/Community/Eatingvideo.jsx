import React, { useState } from "react";
import Navbar from "../Navbar"; // Import your Navbar component

const Eatingvideo = () => {
  // List of videos (local & YouTube)
  const videos = [
    { type: "local", src: "/eating-video.mp4", title: "Eating Disorder Overview" },
    { type: "local", src: "/sleep-video2.mp4", title: "Living with Sleep Disorder" },
    // { type: "youtube", src: "https://youtu.be/r40g_9dw46o?si=25vRkKPDuZRkzqwB", title: "Sleep Disorder Explained" },
    // { type: "youtube", src: "https://www.youtube.com/embed/wb5MWyRuMWE", title: "Understanding ADHD in Kids" }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Handle navigation
  const nextVideo = () => setCurrentIndex((prev) => (prev + 1) % videos.length);
  const prevVideo = () => setCurrentIndex((prev - 1 + videos.length) % videos.length);

  return (
    <div className="w-screen h-screen bg-black flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Video Section - Starts below the navbar */}
      <div className="relative w-full h-[calc(100vh-4rem)] mt-16 flex items-center justify-center">
        {/* Video Display */}
        <div className="w-full h-full">
          {videos[currentIndex].type === "local" ? (
            <video 
              className="w-full h-full object-cover" 
              autoPlay 
              muted 
              loop 
              controls
            >
              <source src={videos[currentIndex].src} type="video/mp4" />
            </video>
          ) : (
            <iframe 
              className="w-full h-full"
              src={videos[currentIndex].src}
              title={videos[currentIndex].title}
              allowFullScreen
            ></iframe>
          )}
        </div>

        {/* Title - Positioned in the top-left corner */}
        <div className="absolute top-6 left-6 bg-black bg-opacity-60 text-white p-3 px-5 rounded-md">
          <h1 className="text-lg font-semibold">{videos[currentIndex].title}</h1>
        </div>

        {/* Controls - Positioned at the bottom-center */}
        {/* <div className="absolute bottom-6 flex space-x-6">
          <button 
            className="px-6 py-2 bg-blue-600 text-white text-sm rounded-md shadow-md hover:bg-blue-700 transition"
            onClick={prevVideo}
          >
            Previous
          </button>
          <button 
            className="px-6 py-2 bg-blue-600 text-white text-sm rounded-md shadow-md hover:bg-blue-700 transition"
            onClick={nextVideo}
          >
            Next
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default Eatingvideo;
