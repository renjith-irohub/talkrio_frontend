import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaStar, FaCrown, FaUserFriends } from "react-icons/fa";
import Navbar from "./Navbar";
import { useQuery } from "@tanstack/react-query";
import { getUserProfileAPI } from "../services/userServices";

const Subscription = () => {
  const navigate = useNavigate();

  // Fetch user profile using React Query
  const { data: userData, isLoading, error } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfileAPI,
    retry: false, // Don't retry on failure (e.g., if not logged in)
  });

  const activePlan = userData?.user?.plan; // "basic", "standard", "vip", or undefined

  const plans = [
    {
      id: 1,
      name: "Basic",
      price: 10,
      benefits: ["Book 2 sessions per month"],
      icon: <FaUserFriends className="text-blue-600 text-5xl" />,
      color: "blue",
      gradient: "from-blue-500 to-blue-700",
      dbName: "basic", // Matches the enum value in UserSchema
    },
    {
      id: 2,
      name: "Standard",
      price: 20,
      benefits: ["Book 5 sessions per month", "Priority scheduling"],
      icon: <FaStar className="text-purple-600 text-5xl" />,
      popular: true,
      color: "purple",
      gradient: "from-purple-500 to-purple-700",
      dbName: "standard", // Matches the enum value in UserSchema
    },
    {
      id: 3,
      name: "Vip",
      price: 30,
      benefits: ["Unlimited sessions", "24/7 chat support"],
      icon: <FaCrown className="text-amber-600 text-5xl" />,
      color: "amber",
      gradient: "from-amber-500 to-amber-700",
      dbName: "vip", // Matches the enum value in UserSchema
    },
  ];

  // Handle plan selection (for users without a plan)
  const handleSelectPlan = (plan) => {
    const serializablePlan = {
      id: plan.id,
      name: plan.name,
      price: plan.price,
      benefits: plan.benefits,
      color: plan.color,
      gradient: plan.gradient,
      popular: plan.popular || false,
      dbName: plan.dbName,
    };
    console.log("Selected Plan in Subscription:", serializablePlan);
    navigate("/payment", { state: { plan: serializablePlan } });
  };

  // Handle booking for active plan
  const handleBookNow = () => {
    navigate("/bookingpage");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // Find the active plan details
  const currentPlan = activePlan ? plans.find((plan) => plan.dbName === activePlan) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            {currentPlan ? "Your Subscription" : "Choose Your Subscription Plan"}
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {currentPlan
              ? "Here’s your current active subscription plan. Enjoy your benefits!"
              : "Unlock exclusive benefits and book consultations tailored to your needs. Pick a plan to get started!"}
          </p>
        </div>

        {currentPlan ? (
          // Display active plan
          <div className="flex justify-center">
            <div
              className={`relative bg-white rounded-2xl shadow-lg overflow-hidden w-full max-w-md transition-all duration-300 ring-4 ring-green-300`}
            >
              <div className="absolute -top-3 right-2">
                <span className="bg-green-600 text-white text-sm font-semibold px-4 py-1 rounded-full shadow-md">
                  Active
                </span>
              </div>

              <div className="p-6 pt-10">
                <div className="flex justify-center mb-6">
                  <div className={`p-3 bg-gradient-to-br ${currentPlan.gradient} rounded-full text-white`}>
                    {currentPlan.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-center text-gray-900 mb-4">{currentPlan.name}</h3>
                <div className="flex justify-center items-baseline mb-6">
                  <span className={`text-4xl font-extrabold text-${currentPlan.color}-600`}>
                    ${currentPlan.price}
                  </span>
                  <span className="text-gray-500 ml-2 text-lg">/month</span>
                </div>

                <ul className="space-y-3 px-4 mb-6">
                  {currentPlan.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <FaCheckCircle className={`text-${currentPlan.color}-500 text-lg flex-shrink-0`} />
                      <span className="text-gray-700 text-base">{benefit}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={handleBookNow}
                  className={`w-full py-3 rounded-lg font-semibold text-white shadow-md transition-all duration-200 bg-gradient-to-r from-green-500 to-green-700 hover:brightness-110`}
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Display all plans for selection
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                  plan.popular ? "ring-4 ring-purple-300 scale-105" : ""
                }`}
              >
                {plan.popular && (
                   <div className="bg-gradient-to-r from-purple-500 to-purple-700 text-white text-center py-2 font-medium">
                   MOST POPULAR
                 </div>
                )}

                <div className={`p-6 ${plan.popular ? "pt-10" : "pt-6"}`}>
                  <div className="flex justify-center mb-6">
                    <div className={`p-3 bg-gradient-to-br ${plan.gradient} rounded-full text-white`}>
                      {plan.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-center text-gray-900 mb-4">{plan.name}</h3>
                  <div className="flex justify-center items-baseline mb-6">
                    <span className={`text-4xl font-extrabold text-${plan.color}-600`}>${plan.price}</span>
                    <span className="text-gray-500 ml-2 text-lg">/month</span>
                  </div>

                  <ul className="space-y-3 px-4 mb-6">
                    {plan.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <FaCheckCircle className={`text-${plan.color}-500 text-lg flex-shrink-0`} />
                        <span className="text-gray-700 text-base">{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSelectPlan(plan)}
                    className={`w-full py-3 rounded-lg font-semibold text-white shadow-md transition-all duration-200 hover:scale-105 bg-gradient-to-r ${plan.gradient} hover:brightness-110`}
                  >
                    Select Plan
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            Have questions?{" "}
            <a href="/support" className="text-teal-600 hover:underline font-medium">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Subscription;