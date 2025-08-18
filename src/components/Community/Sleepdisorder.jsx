import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaComment, FaBookOpen, FaPlayCircle, FaPaperPlane, FaHeart, FaMoon, FaRegClock, FaBed, FaSun,   } from "react-icons/fa";
import { GiNightSleep, GiAlarmClock } from "react-icons/gi";
import { MdPsychology, MdHealthAndSafety } from "react-icons/md";
import Navbar from "../Navbar";

const Sleepdisorder = () => {
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("symptoms");
  const [messages, setMessages] = useState([
    {
      id: 1,
      user: "Alex",
      text: "Started a sleep routine with no screens 1 hour before bed - it's helping!",
      time: "2 hours ago",
      likes: 8,
      userColor: "text-blue-600"
    },
    {
      id: 2,
      user: "Sam",
      text: "White noise machines made a huge difference for my insomnia.",
      time: "1 hour ago",
      likes: 12,
      userColor: "text-purple-600"
    },
    {
      id: 3,
      user: "Taylor",
      text: "Remember that occasional bad nights are normal - don't stress about perfection.",
      time: "45 minutes ago",
      likes: 15,
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

  const sleepFacts = [
    {
      icon: <MdPsychology className="text-2xl" />,
      title: "Clinical Definition",
      content: "Sleep disorders involve problems with quality, timing, and amount of sleep that impair daily functioning."
    },
    {
      icon: <GiNightSleep className="text-2xl" />,
      title: "Prevalence",
      content: "About 30% of adults experience insomnia symptoms, and 10% have chronic insomnia disorder."
    },
    {
      icon: <FaRegClock className="text-2xl" />,
      title: "Recovery Timeline",
      content: "With CBT for insomnia, most see improvement within 4-8 weeks of consistent practice."
    }
  ];

  const copingStrategies = [
    {
      title: "Sleep Hygiene",
      description: "Establish consistent bedtime routine and optimal sleep environment.",
      icon: <FaBed className="text-blue-500" />
    },
    {
      title: "Stimulus Control",
      description: "Use bed only for sleep to strengthen bed-sleep association.",
      icon: <GiAlarmClock className="text-green-500" />
    },
    {
      title: "Relaxation Techniques",
      description: "Practice deep breathing or progressive muscle relaxation before bed.",
      icon: <FaMoon className="text-purple-500" />
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
              <GiNightSleep className="text-4xl text-indigo-600 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                Understanding Sleep Disorders
              </h1>
            </div>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Restful sleep is possible. Sleep disorders are manageable with the right strategies and support.
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
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Recognizing Sleep Disorders</h2>
                      <ul className="space-y-4">
                        <li className="flex items-start">
                          <div className="flex-shrink-0 mt-1 mr-3 text-indigo-600">•</div>
                          <p className="text-gray-700">Difficulty falling or staying asleep (insomnia)</p>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 mt-1 mr-3 text-indigo-600">•</div>
                          <p className="text-gray-700">Loud snoring and breathing pauses (sleep apnea)</p>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 mt-1 mr-3 text-indigo-600">•</div>
                          <p className="text-gray-700">Uncomfortable leg sensations (restless legs syndrome)</p>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 mt-1 mr-3 text-indigo-600">•</div>
                          <p className="text-gray-700">Excessive daytime sleepiness</p>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 mt-1 mr-3 text-indigo-600">•</div>
                          <p className="text-gray-700">Unusual behaviors during sleep (parasomnias)</p>
                        </li>
                      </ul>
                    </div>
                  )}

                  {activeTab === "causes" && (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Potential Causes</h2>
                      <p className="text-gray-700 mb-4">
                        Sleep disorders result from various factors:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {sleepFacts.map((fact, index) => (
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
                          <h3 className="font-semibold text-indigo-800 mb-2">CBT for Insomnia</h3>
                          <p className="text-indigo-700">
                            Cognitive Behavioral Therapy is the gold standard for chronic insomnia.
                          </p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                          <h3 className="font-semibold text-green-800 mb-2">CPAP Therapy</h3>
                          <p className="text-green-700">
                            Continuous Positive Airway Pressure devices treat sleep apnea.
                          </p>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                          <h3 className="font-semibold text-purple-800 mb-2">Lifestyle Changes</h3>
                          <p className="text-purple-700">
                            Sleep hygiene, stress management, and regular exercise help.
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
                  <FaHeart className="mr-2 text-indigo-600" />
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
                      CBT-I has <span className="font-medium">70-80% effectiveness</span> for chronic insomnia
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-6 h-6 rounded-full bg-indigo-200 text-indigo-700 flex items-center justify-center">
                        ✓
                      </div>
                    </div>
                    <p className="ml-3 text-gray-800">
                      Most sleep disorders improve significantly with proper treatment
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-6 h-6 rounded-full bg-indigo-200 text-indigo-700 flex items-center justify-center">
                        ✓
                      </div>
                    </div>
                    <p className="ml-3 text-gray-800">
                      New sleep tracking technologies help identify patterns
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
                    Sleep Community
                  </h3>
                  <p className="text-indigo-100 mt-1">Share experiences and tips</p>
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
                  If sleep problems are severely impacting your health:
                </p>
                <div className="space-y-3">
                  <a href="tel:988" className="block px-4 py-2 bg-white text-red-600 rounded-lg border border-red-200 hover:bg-red-100 transition-colors font-medium">
                    Call 988 (Suicide & Crisis Lifeline)
                  </a>
                  <a href="https://www.sleepfoundation.org" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 bg-white text-red-600 rounded-lg border border-red-200 hover:bg-red-100 transition-colors font-medium">
                    National Sleep Foundation
                  </a>
                  <Link to="/emergency-resources" className="block text-red-600 hover:underline text-sm mt-2">
                    More sleep resources
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

export default Sleepdisorder;