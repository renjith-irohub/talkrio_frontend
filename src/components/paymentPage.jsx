import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FaCheckCircle, FaStar, FaCrown, FaUserFriends } from "react-icons/fa";
import Navbar from "./Navbar";
import { loadStripe } from "@stripe/stripe-js";
import {
  CardNumberElement,
  CardExpiryElement,
  Elements,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { processPaymentAPI } from "../services/paymentServices"; // Import from your services
// import { getToken } from "../utils/storageHandler"; // Assuming this retrieves the auth token
import { toast } from "react-toastify";

// Debug Stripe key
console.log("Stripe Publishable Key:", import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Payment Form Component
const PaymentForm = ({ plan, amount, onSuccess }) => {
  const elements = useElements();
  const stripe = useStripe();  
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const paymentMutation = useMutation({
    mutationFn: processPaymentAPI,
    mutationKey: ['payment'],
    onError: (err) => {
      const backendMessage =
        err?.response?.data?.message || err?.message || "Payment failed. Please try again.";
      setError(backendMessage);
    },
    onSuccess: async ({ clientSecret }) => {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
        },
      });

      if (result.error) {
        setError(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        onSuccess?.();
      }
    },
  });

   

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      setError("Stripe not initialized. Please check your connection or try again.");
      return;
    }

    setProcessing(true);
    setError(null);

    try {  
      const paymentData = {
        amount: amount , // Convert to cents
        plan: plan.name.toLowerCase(),
      };
console.log(paymentData);

      await paymentMutation.mutateAsync(paymentData);
    } catch (err) {
    
    }
  };
  return (
    <form onSubmit={handleSubmit} className="mt-6 w-full max-w-md">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Payment Details</h3>
         {/* Error box */}
         {error && (
        <div className="mb-4 p-4 rounded-lg bg-red-100 text-red-800 border border-red-300">
          {error}
        </div>
      )}
      {/* Replace CardElement with individual elements */}
      <div className="space-y-4">
        <div className="p-4 bg-gray-100 rounded-lg border border-gray-300">
        <CardNumberElement
  options={{
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": { color: "#aab7c4" }
      },
      invalid: { color: "#9e2146" }
    },
    showIcon: true,
    placeholder: "Card Number"
  }}
/>
        </div>

        <div className="flex gap-4">
          <div className="p-4 bg-gray-100 rounded-lg border border-gray-300 flex-1">
            <CardExpiryElement
              options={{
                style: {
                  base: { fontSize: "16px", color: "#424770" },
                },
                placeholder: "MM/YY",
              }}
            />
          </div>
          <div className="p-4 bg-gray-100 rounded-lg border border-gray-300 flex-1">
            <CardCvcElement
              options={{
                style: {
                  base: { fontSize: "16px", color: "#424770" },
                },
                placeholder: "CVC",
              }}
            />
          </div>
        </div>
      </div>

      {/* Keep error and button code unchanged */}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || processing}
        className={`w-full mt-6 py-3 rounded-lg font-semibold text-white shadow-lg transform transition-all duration-200 hover:scale-105 ${
          processing ? "bg-gray-400 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-700"
        }`}
      >
        {processing ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Processing...
          </span>
        ) : (
          `Pay $${amount}`
        )}
      </button>
    </form>
  );
};

// Main Payment Page Component
const PaymentPage = () => {
  const { state } = useLocation();
  const plan = state?.plan;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  console.log("Plan in PaymentPage:", plan);

  const getIcon = (planName) => {
    switch (planName.toLowerCase()) {
      case "basic":
        return <FaUserFriends className={`text-${plan.color}-600 text-5xl`} />;
      case "standard":
        return <FaStar className={`text-${plan.color}-600 text-5xl`} />;
      case "vip":
        return <FaCrown className={`text-${plan.color}-600 text-5xl`} />;
      default:
        return null;
    }
  };

  if (!plan) {
    console.log("No plan found, redirecting to /subscription");
    navigate("/subscription");
    return null;
  }
  const handlePaymentSuccess = () => {
    queryClient.invalidateQueries(["user"]);
    toast.success("🎉 Payment successful! Thank you for subscribing.");
    setTimeout(() => navigate("/bookingpage"), 1000);
  };
  
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50">
      <Navbar />
      <div className="max-w-4xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            Complete Your Subscription
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Review your plan details and enter your payment information below.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 justify-center items-start">
          <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md">
            <div className="flex justify-center mb-6">
              <div className={`p-3 bg-gradient-to-br ${plan.gradient} rounded-full text-white`}>
                {getIcon(plan.name)}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">{plan.name} Plan</h3>
            <div className="flex justify-center items-baseline mb-6">
              <span className={`text-4xl font-extrabold text-${plan.color}-600`}>${plan.price}</span>
              <span className="text-gray-500 ml-2 text-lg">/month</span>
            </div>
            <ul className="space-y-4">
              {plan.benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-3">
                  <FaCheckCircle className={`text-${plan.color}-500 flex-shrink-0 text-lg`} />
                  <span className="text-gray-700 text-base">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md">
            <Elements stripe={stripePromise}>
              <PaymentForm plan={plan} amount={plan.price} onSuccess={handlePaymentSuccess} />
            </Elements>
          </div>
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => navigate("/subscribe")}
            className="text-teal-600 hover:underline font-medium"
          >
            Back to Plans
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;