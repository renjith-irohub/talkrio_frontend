import React from "react";
import Navbar2 from "./Navbar2";

const Services = () => {
  const services = [
    { title: "Mind Relaxation", image: "../mind relaxation.jpg" },
    { title: "Chat", image: "../chatAI.jpg" },
    { title: "Post thoughts", image: "../post.jpg" },
    { title: "Psychiatrists", image: "../psychiatrist.jpg" },
    { title: "Community", image: "../community.jpg" },
    { title: "Motivational resources ", image: "../resources.jpg" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar2 />
      <div className="container mx-auto py-16 text-center">
        <h3 className="text-3xl font-semibold text-black mt-12">Our Services</h3>
        {/* Service Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-8 px-4">
          {services.map((service, index) => (
            <div key={index} className="relative overflow-hidden rounded-lg shadow-lg">
              <img className="w-full h-64 object-cover" src={service.image} alt={service.title} />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white opacity-0 hover:opacity-100 transition-opacity duration-300">
                <h4 className="text-xl font-bold">{service.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
