import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  FaComment, 
  FaBookOpen, 
  FaPlayCircle, 
  FaPaperPlane, 
  FaLightbulb, 
  FaRunning, 
  FaRegClock,
  FaBrain, 
  FaHeart
} from "react-icons/fa";
import { GiSprint, GiThink } from "react-icons/gi";
import { MdOutlinePsychology, MdFamilyRestroom } from "react-icons/md";

const ADHD = () => {
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("symptoms");
  const [messages, setMessages] = useState([
    {
      id: 1,
      user: "Jamie",
      text: "Using visual timers has been a game-changer for my time blindness!",
      time: "2 hours ago",
      likes: 8,
      userColor: "text-blue-600"
    },
    {
      id: 2,
      user: "Alex",
      text: "Pro tip: I keep a 'don't put it down, put it away' mantra to avoid lost items",
      time: "1 hour ago",
      likes: 12,
      userColor: "text-purple-600"
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

  // ADHD facts data
  const adhdFacts = [
    {
      icon: <FaBrain className="text-xl" />,
      title: "Brain Differences",
      content: "ADHD brains show different activity in areas controlling attention and impulse control"
    },
    {
      icon: <MdFamilyRestroom className="text-xl" />,
      title: "Highly Genetic",
      content: "About 75% of ADHD cases have a genetic component"
    },
    {
      icon: <MdOutlinePsychology className="text-xl" />,
      title: "Not Just Kids",
      content: "Approximately 60% of children with ADHD continue to experience symptoms as adults"
    }
  ];

  // Coping strategies
  const copingStrategies = [
    {
      title: "Body Doubling",
      description: "Work alongside someone to maintain focus",
      icon: <FaRunning className="text-blue-500" />
    },
    {
      title: "Pomodoro Technique",
      description: "25-minute focused sessions with short breaks",
      icon: <FaRegClock className="text-green-500" />
    },
    {
      title: "Externalize Memory",
      description: "Use visible reminders instead of mental notes",
      icon: <FaLightbulb className="text-purple-500" />
    }
  ];

  return (
    
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8 pt-25">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <GiThink className="text-4xl text-indigo-600 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              ADHD Support Community
            </h1>
          </div>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Strategies, support, and celebration of neurodiversity
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tabbed Content */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("symptoms")}
                  className={`flex-1 py-4 font-medium ${activeTab === "symptoms" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-600"}`}
                >
                  Symptoms
                </button>
                <button
                  onClick={() => setActiveTab("strengths")}
                  className={`flex-1 py-4 font-medium ${activeTab === "strengths" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-600"}`}
                >
                  Strengths
                </button>
                <button
                  onClick={() => setActiveTab("strategies")}
                  className={`flex-1 py-4 font-medium ${activeTab === "strategies" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-600"}`}
                >
                  Strategies
                </button>
              </div>

              <div className="p-6">
                {/* Symptoms Tab */}
                {activeTab === "symptoms" && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">ADHD Symptoms</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
                          <GiSprint className="mr-2" /> Inattention
                        </h3>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <span className="text-indigo-600 mr-2">•</span>
                            <span>Difficulty sustaining attention</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-indigo-600 mr-2">•</span>
                            <span>Easily distracted</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-indigo-600 mr-2">•</span>
                            <span>Forgetfulness in daily activities</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-semibold text-purple-800 mb-3 flex items-center">
                          <FaRunning className="mr-2" /> Hyperactivity/Impulsivity
                        </h3>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <span className="text-indigo-600 mr-2">•</span>
                            <span>Fidgeting or restlessness</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-indigo-600 mr-2">•</span>
                            <span>Impulsive decisions</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-indigo-600 mr-2">•</span>
                            <span>Interrupting conversations</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Strengths Tab */}
                {activeTab === "strengths" && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">ADHD Strengths</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {adhdFacts.map((fact, index) => (
                        <div key={index} className="bg-blue-50 p-4 rounded-lg border border-blue-100">
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

                {/* Strategies Tab */}
                {activeTab === "strategies" && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Management Strategies</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {copingStrategies.map((strategy, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors shadow-sm">
                          <div className="flex items-center mb-2">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-3">
                              {strategy.icon}
                            </div>
                            <h3 className="font-medium text-gray-900">{strategy.title}</h3>
                          </div>
                          <p className="text-gray-600 text-sm">{strategy.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Resources Section */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <FaBookOpen className="mr-2 text-indigo-600" />
                Helpful Resources
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link 
                  to="/adhd-in-adults" 
                  className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                >
                  <h3 className="font-medium text-indigo-600">ADHD in Adults Guide</h3>
                  <p className="text-sm text-gray-600 mt-1">Recognizing symptoms later in life</p>
                </Link>
                <Link 
                  to="/adhd-productivity" 
                  className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                >
                  <h3 className="font-medium text-indigo-600">Productivity Strategies</h3>
                  <p className="text-sm text-gray-600 mt-1">ADHD-friendly work techniques</p>
                </Link>
              </div>
            </div>
          </div>

          {/* Community Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-8">
              <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <h3 className="text-xl font-semibold flex items-center">
                  <FaComment className="mr-2" />
                  Community Tips
                </h3>
                <p className="text-indigo-100">Share what works for you</p>
              </div>

              <div className="p-4 h-80 overflow-y-auto">
                {messages.map((msg) => (
                  <div key={msg.id} className="mb-4 pb-4 border-b border-gray-100">
                    <div className="flex justify-between">
                      <span className={`font-medium ${msg.userColor}`}>{msg.user}</span>
                      <span className="text-xs text-gray-500">{msg.time}</span>
                    </div>
                    <p className="text-gray-700 mt-1">{msg.text}</p>
                    <button className="text-gray-400 hover:text-red-500 mt-2">
                      <FaHeart className="inline mr-1" />
                      <span className="text-xs">{msg.likes}</span>
                    </button>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share your ADHD tip..."
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                ></textarea>
                <button 
                  type="submit"
                  className="mt-3 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Post
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ADHD;