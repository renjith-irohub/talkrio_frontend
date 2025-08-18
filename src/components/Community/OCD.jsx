import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaComment, FaBookOpen, FaPlayCircle, FaPaperPlane, FaHeart, FaSun, FaRegClock, FaHandHoldingHeart } from "react-icons/fa";
import { GiBrain, GiSpellBook } from "react-icons/gi";
import { MdPsychology, MdSelfImprovement } from "react-icons/md";
import Navbar from "../Navbar";

const OCD = () => {
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("symptoms");
  const [messages, setMessages] = useState([
    {
      id: 1,
      user: "Alex",
      text: "Has anyone found particular CBT techniques helpful for checking compulsions?",
      time: "2 hours ago",
      likes: 5,
      userColor: "text-blue-600"
    },
    {
      id: 2,
      user: "Jordan",
      text: "I've been using the 15-minute delay method with my therapist and it's been helping!",
      time: "1 hour ago",
      likes: 8,
      userColor: "text-purple-600"
    },
    {
      id: 3,
      user: "Taylor",
      text: "Remember everyone - progress isn't linear. Be kind to yourself on tough days.",
      time: "30 minutes ago",
      likes: 12,
      userColor: "text-teal-600"
    }
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        user: "You",
        text: message,
        time: "Just now",
        likes: 0,
        userColor: "text-indigo-600"
      };
      setMessages([...messages, newMessage]);
      setMessage("");
    }
  };

  const ocdFacts = [
    {
      icon: <MdPsychology className="text-2xl" />,
      title: "Clinical Definition",
      content: "OCD is characterized by unwanted recurring thoughts (obsessions) and repetitive behaviors (compulsions)."
    },
    {
      icon: <GiSpellBook className="text-2xl" />,
      title: "Prevalence",
      content: "Affects about 1-2% of the population, with symptoms typically appearing in childhood or early adulthood."
    },
    {
      icon: <FaRegClock className="text-2xl" />,
      title: "Treatment Success",
      content: "With proper treatment (CBT/ERP), 70% of people with OCD experience significant improvement."
    }
  ];

  const copingStrategies = [
    {
      title: "Delay Technique",
      description: "Gradually delay acting on compulsions to build tolerance to anxiety.",
      icon: <FaRegClock className="text-blue-500" />
    },
    {
      title: "Mindfulness Approach",
      description: "Observe obsessive thoughts without judgment or engagement.",
      icon: <MdSelfImprovement className="text-green-500" />
    },
    {
      title: "Exposure Therapy",
      description: "Systematic exposure to feared situations without compulsions.",
      icon: <GiBrain className="text-purple-500" />
    }
  ];

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8 pt-25">
        <div className="max-w-7xl mx-auto">
          {/* Healing Header */}
          <div className="mb-12 text-center">
            <div className="flex justify-center items-center mb-4">
              <GiBrain className="text-4xl text-indigo-600 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                Understanding OCD
              </h1>
            </div>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              You're not alone in this journey. OCD is manageable, and recovery is possible with the right support.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Knowledge Navigation */}
              <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="flex border-b border-gray-200">
                  <button
                    onClick={() => setActiveTab("symptoms")}
                    className={`flex-1 py-4 font-medium ${activeTab === "symptoms" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-600"}`}
                  >
                    Symptoms
                  </button>
                  <button
                    onClick={() => setActiveTab("causes")}
                    className={`flex-1 py-4 font-medium ${activeTab === "causes" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-600"}`}
                  >
                    Causes
                  </button>
                  <button
                    onClick={() => setActiveTab("treatment")}
                    className={`flex-1 py-4 font-medium ${activeTab === "treatment" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-600"}`}
                  >
                    Treatment
                  </button>
                </div>

                <div className="p-6 md:p-8">
                  {activeTab === "symptoms" && (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Recognizing OCD</h2>
                      <ul className="space-y-4">
                        <li className="flex items-start">
                          <div className="flex-shrink-0 mt-1 mr-3 text-indigo-600">•</div>
                          <p className="text-gray-700">Recurrent, unwanted thoughts (obsessions)</p>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 mt-1 mr-3 text-indigo-600">•</div>
                          <p className="text-gray-700">Repetitive behaviors or mental acts (compulsions)</p>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 mt-1 mr-3 text-indigo-600">•</div>
                          <p className="text-gray-700">Significant time consumed by symptoms (1+ hours/day)</p>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 mt-1 mr-3 text-indigo-600">•</div>
                          <p className="text-gray-700">Distress or impairment in daily functioning</p>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 mt-1 mr-3 text-indigo-600">•</div>
                          <p className="text-gray-700">Common themes: contamination, harm, symmetry, forbidden thoughts</p>
                        </li>
                      </ul>
                    </div>
                  )}

                  {activeTab === "causes" && (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Potential Causes</h2>
                      <p className="text-gray-700 mb-4">
                        OCD results from a combination of factors:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {ocdFacts.map((fact, index) => (
                          <div key={index} className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                            <div className="flex items-center mb-2">
                              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                                {fact.icon}
                              </div>
                              <h3 className="font-semibold text-blue-800">{fact.title}</h3>
                            </div>
                            <p className="text-blue-700 text-sm">{fact.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "treatment" && (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Treatment Options</h2>
                      <div className="space-y-6">
                        <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                          <h3 className="font-semibold text-indigo-800 mb-2">ERP Therapy</h3>
                          <p className="text-indigo-700">
                            Exposure and Response Prevention is the gold standard psychological treatment for OCD.
                          </p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                          <h3 className="font-semibold text-green-800 mb-2">Medication</h3>
                          <p className="text-green-700">
                            SSRIs are commonly prescribed and can help reduce symptoms.
                          </p>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                          <h3 className="font-semibold text-purple-800 mb-2">Support Groups</h3>
                          <p className="text-purple-700">
                            Connecting with others facing similar challenges can provide valuable support.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Coping Strategies */}
              <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <FaHandHoldingHeart className="mr-2 text-indigo-600" />
                  Immediate Coping Tools
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {copingStrategies.map((strategy, index) => (
                    <div key={index} className="bg-gradient-to-br from-white to-gray-50 rounded-lg p-4 border border-gray-200 hover:border-indigo-300 transition-all">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                          {strategy.icon}
                        </div>
                        <h3 className="font-medium text-gray-900">{strategy.title}</h3>
                      </div>
                      <p className="text-sm text-gray-600">{strategy.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hope Section */}
              <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl p-8 border border-blue-200 shadow-sm">
                <h3 className="text-2xl font-bold text-indigo-800 mb-4 flex items-center">
                  <FaSun className="mr-2" /> Reasons for Hope
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-6 h-6 rounded-full bg-indigo-200 text-indigo-700 flex items-center justify-center">
                        ✓
                      </div>
                    </div>
                    <p className="ml-3 text-gray-800">
                      ERP therapy has <span className="font-medium">60-80% effectiveness</span> for reducing OCD symptoms
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-6 h-6 rounded-full bg-indigo-200 text-indigo-700 flex items-center justify-center">
                        ✓
                      </div>
                    </div>
                    <p className="ml-3 text-gray-800">
                      Many people achieve significant symptom reduction with consistent treatment
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-6 h-6 rounded-full bg-indigo-200 text-indigo-700 flex items-center justify-center">
                        ✓
                      </div>
                    </div>
                    <p className="ml-3 text-gray-800">
                      New treatments like mindfulness-based CBT show promising results
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Community Support Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 sticky top-8">
                <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                  <h3 className="text-xl font-semibold flex items-center">
                    <FaComment className="mr-2" />
                    OCD Community
                  </h3>
                  <p className="text-indigo-100 mt-1">Share experiences and support</p>
                </div>

                <div className="p-4 h-96 overflow-y-auto">
                  {messages.map(msg => (
                    <div key={msg.id} className="mb-4 pb-4 border-b border-gray-100 last:border-0">
                      <div className="flex justify-between items-start">
                        <span className={`font-medium ${msg.userColor}`}>{msg.user}</span>
                        <span className="text-xs text-gray-500">{msg.time}</span>
                      </div>
                      <p className="text-gray-700 mt-1">{msg.text}</p>
                      <div className="flex items-center mt-2">
                        <button className="text-gray-400 hover:text-red-500 transition-colors">
                          <FaHeart className="mr-1" />
                        </button>
                        <span className="text-xs text-gray-500 ml-1">{msg.likes}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-gray-50">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share your experience or ask for support..."
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white"
                  ></textarea>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs text-gray-500">All messages are moderated</span>
                    <button 
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center shadow-sm"
                    >
                      <FaPaperPlane className="mr-2" />
                      Share
                    </button>
                  </div>
                </form>
              </div>

              {/* Emergency Resources */}
              <div className="mt-8 bg-red-50 rounded-2xl p-6 border border-red-200">
                <h3 className="text-xl font-semibold text-red-800 mb-3">Immediate Help</h3>
                <p className="text-red-700 mb-4 text-sm">
                  If you're in crisis or need urgent support:
                </p>
                <div className="space-y-3">
                  <a href="tel:988" className="block px-4 py-2 bg-white text-red-600 rounded-lg border border-red-200 hover:bg-red-100 transition-colors font-medium">
                    Call 988 (Suicide & Crisis Lifeline)
                  </a>
                  <a href="https://iocdf.org" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 bg-white text-red-600 rounded-lg border border-red-200 hover:bg-red-100 transition-colors font-medium">
                    International OCD Foundation
                  </a>
                  <Link to="/emergency-resources" className="block text-red-600 hover:underline text-sm mt-2">
                    More OCD resources
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OCD;