import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom"; // Changed to NavLink
import { FaBell } from "react-icons/fa";
import {
  Send,
  Bot,
  Mic,
  StopCircle,
  LogOut,
  Image,
  Paperclip,
  Smile,
  ChevronDown,
  X,
  User,
  MessageSquare,
  Trash2,
  Plus,
  Menu,
  Settings,
  ImageIcon,
} from "lucide-react";
import io from "socket.io-client";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(() => {
    return localStorage.getItem("isChatOpen") === "true";
  });
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifications = [
    "New message from John",
    "Your post received a new comment",
    "Reminder: Mental health session at 5 PM",
  ];

  useEffect(() => {
    localStorage.setItem("isChatOpen", isChatOpen);
  }, [isChatOpen]);

  const notificationRef = useRef(null);
  const userMenuRef = useRef(null);
  const chatbotRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (
        isChatOpen &&
        chatbotRef.current &&
        !chatbotRef.current.contains(event.target) &&
        !event.target.closest(".chat-toggle-button")
      ) {
        // Optional: Uncomment to close chat on outside click
        // setIsChatOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isChatOpen]);

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.clear();
    window.location.href = "/homepage";
  };

  return (
    <>
      <header
        className="bg-white shadow-lg shadow-blue-200/30 fixed w-full z-40 
                  text-blue-800 hover:text-blue-900 transition-all duration-300
                  border-b-2 border-blue-50"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <NavLink
            to="/"
            className="flex items-center space-x-2 hover:scale-102 transition-transform"
          >
            <img
              src="/logo-img.png"
              alt="Talkrio Logo"
              className="w-12 h-10 object-contain drop-shadow-sm"
            />
            <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Talkrio
            </span>
          </NavLink>

          <nav className="hidden lg:flex space-x-8 items-center">
            <NavLink
              to="/homepage2"
              className={({ isActive }) =>
                `hover:text-blue-600 transition-colors duration-200 font-medium
                 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] 
                 after:bg-blue-600 after:transition-all ${
                   isActive
                     ? "text-blue-600 after:w-full"
                     : "after:w-0 hover:after:w-full"
                 }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/community"
              className={({ isActive }) =>
                `hover:text-blue-600 transition-colors duration-200 font-medium
                 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] 
                 after:bg-blue-600 after:transition-all ${
                   isActive
                     ? "text-blue-600 after:w-full"
                     : "after:w-0 hover:after:w-full"
                 }`
              }
            >
              Community
            </NavLink>
            <NavLink
              to="/postview"
              className={({ isActive }) =>
                `hover:text-blue-600 transition-colors duration-200 font-medium
                 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] 
                 after:bg-blue-600 after:transition-all ${
                   isActive
                     ? "text-blue-600 after:w-full"
                     : "after:w-0 hover:after:w-full"
                 }`
              }
            >
              Posts
            </NavLink>
            <NavLink
              to="/resources"
              className={({ isActive }) =>
                `hover:text-blue-600 transition-colors duration-200 font-medium
                 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] 
                 after:bg-blue-600 after:transition-all ${
                   isActive
                     ? "text-blue-600 after:w-full"
                     : "after:w-0 hover:after:w-full"
                 }`
              }
            >
              Resources
            </NavLink>
            <NavLink
              to="/viewuserappointment"
              className={({ isActive }) =>
                `hover:text-blue-600 transition-colors duration-200 font-medium
                 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] 
                 after:bg-blue-600 after:transition-all ${
                   isActive
                     ? "text-blue-600 after:w-full"
                     : "after:w-0 hover:after:w-full"
                 }`
              }
            >
              Appointments
            </NavLink>
          </nav>

          <div className="hidden lg:flex items-center space-x-3">
            <button
              className="chat-toggle-button flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg hover:scale-105 transition-all duration-300 relative group"
              onClick={toggleChat}
              aria-label="Open AI Chat"
            >
              <MessageSquare className="w-5 h-5" />
              {!isChatOpen && (
                <span className="absolute top-0 right-0 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
              )}
              <span className="absolute invisible group-hover:visible bg-gray-900 text-white text-xs rounded py-1 px-2 -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                AI Chat
              </span>
            </button>

            <NavLink to="/post-view">
              <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg hover:scale-105 transition-all duration-300 relative group">
                <Plus className="w-5 h-5" />
                <span className="absolute invisible group-hover:visible bg-gray-900 text-white text-xs rounded py-1 px-2 -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  New Post
                </span>
              </button>
            </NavLink>

            <div className="relative">
              <a
                href="/notification"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 transition-all duration-200 relative"
                aria-label="Notifications"
              >
                <FaBell size={16} />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 flex h-2 w-2">
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                )}
              </a>
            </div>

            <div className="relative" ref={userMenuRef}>
              <button
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 transition-all duration-200"
                onClick={() => setShowUserMenu(!showUserMenu)}
                aria-label="User menu"
              >
                <User size={16} />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 text-white shadow-lg rounded-lg overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-gray-800">
                    <p className="text-sm font-medium">User Name</p>
                    <p className="text-xs text-gray-400">user@example.com</p>
                  </div>
                  <ul>
                    <li>
                      <NavLink
                        to="/profile"
                        className=" px-4 py-2 text-sm hover:bg-gray-800 flex items-center"
                      >
                        <User size={14} className="mr-2" /> Profile
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/settings"
                        className=" px-4 py-2 text-sm hover:bg-gray-800 flex items-center"
                      >
                        <Settings size={14} className="mr-2" /> Settings
                      </NavLink>
                    </li>
                    <li className="border-t border-gray-800">
                      <button
                        onClick={handleLogout}
                        className=" px-4 py-2 text-sm hover:bg-gray-800 text-red-400 flex items-center"
                      >
                        <LogOut size={14} className="mr-2" /> Log Out
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="lg:hidden flex items-center space-x-3">
            <button
              className="chat-toggle-button flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg"
              onClick={toggleChat}
              aria-label="Open AI Chat"
            >
              <MessageSquare className="w-4 h-4" />
            </button>

            <NavLink to="/postview">
              <button className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg">
                <Plus className="w-4 h-4" />
              </button>
            </NavLink>

            <button
              className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-800 hover:bg-gray-700"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="lg:hidden bg-gray-900/95 backdrop-blur-sm shadow-lg absolute w-full left-0 border-t border-gray-800 z-50">
            <nav className="flex flex-col divide-y divide-gray-800">
              <NavLink
                to="/homepage2"
                className={({ isActive }) =>
                  `px-6 py-3 ${
                    isActive ? "bg-gray-800 text-blue-600" : "hover:bg-gray-800/50"
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                Home
              </NavLink>
              <NavLink
                to="/community"
                className={({ isActive }) =>
                  `px-6 py-3 ${
                    isActive ? "bg-gray-800 text-blue-600" : "hover:bg-gray-800/50"
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                Community
              </NavLink>
              <NavLink
                to="/resources"
                className={({ isActive }) =>
                  `px-6 py-3 ${
                    isActive ? "bg-gray-800 text-blue-600" : "hover:bg-gray-800/50"
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                Resources
              </NavLink>
              <NavLink
                to="/viewuserappointment"
                className={({ isActive }) =>
                  `px-6 py-3 ${
                    isActive ? "bg-gray-800 text-blue-600" : "hover:bg-gray-800/50"
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                Appointments
              </NavLink>
              <NavLink
                to="/postview"
                className={({ isActive }) =>
                  `px-6 py-3 ${
                    isActive ? "bg-gray-800 text-blue-600" : "hover:bg-gray-800/50"
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                Posts
              </NavLink>
              <div className="px-6 py-3 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <button className="relative">
                    <FaBell size={16} />
                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                  </button>
                  <NavLink to="/profile">
                    <User size={16} />
                  </NavLink>
                </div>
              </div>
            </nav>
          </div>
        )}
      </header>

      <div
        ref={chatbotRef}
        className={`fixed bottom-0 right-0 z-50 transform transition-all duration-500 ease-in-out ${
          isChatOpen ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
        }`}
      >
        <TalkrioAIChat onClose={() => setIsChatOpen(false)} />
      </div>
    </>
  );
};

// TalkrioAIChat component remains unchanged
const TalkrioAIChat = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioRecorder, setAudioRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const chatContainerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    const socketUrl = "http://localhost:5000";
    socketRef.current = io(socketUrl, {
      withCredentials: true,
      transports: ["websocket"],
    });

    socketRef.current.on("connect", () => {
      console.log("Socket.IO connected");
      if (isMounted) setIsConnected(true);
    });

    socketRef.current.on("messageResponse", (data) => {
      if (isMounted) {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            text: data.text,
            sender: "bot",
            intent: data.intent,
            confidence: data.confidence,
            payload: data.payload,
          },
        ]);
      }
    });

    socketRef.current.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error);
      if (isMounted) {
        setMessages((prev) => [
          ...prev,
          {
            text: "Failed to connect to the server. Please try again later.",
            sender: "bot",
            intent: "ERROR",
            confidence: 0,
          },
        ]);
        setIsConnected(false);
      }
    });

    socketRef.current.on("disconnect", () => {
      console.log("Socket.IO disconnected");
      if (isMounted) setIsConnected(false);
    });

    return () => {
      isMounted = false;
      socketRef.current.disconnect();
      if (mediaRecorderRef.current?.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const sendMessage = () => {
    if (input.trim() === "") return;

    const newMessage = {
      text: input,
      sender: "user",
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsTyping(true);

    const userId = sessionStorage.getItem("userId") || `user-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem("userId", userId);
    const sessionId = sessionStorage.getItem("sessionId") || `session-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem("sessionId", sessionId);
    const roomId = `chatbot-room-${userId}`;

    if (socketRef.current) {
      socketRef.current.emit(
        "bot_message",
        {
          message: input,
          sessionId,
          roomId,
          senderId: userId,
        },
        (response) => {
          if (response?.error) {
            console.error("Error sending message:", response.error);
            setMessages((prev) => [
              ...prev,
              {
                text: "Failed to send message. Please try again.",
                sender: "bot",
                intent: "ERROR",
                confidence: 0,
              },
            ]);
            setIsTyping(false);
          }
        }
      );
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorderRef.current.stream = stream;

      const chunks = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: "audio/webm" });
        setAudioChunks(chunks);
        setAudioRecorder(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendVoiceMessage = () => {
    if (audioRecorder) {
      setMessages((prev) => [
        ...prev,
        {
          text: "🎤 Voice Message",
          sender: "user",
          type: "voice",
        },
      ]);

      if (socketRef.current) {
        const reader = new FileReader();
        reader.readAsDataURL(audioRecorder);
        reader.onloadend = () => {
          socketRef.current.emit(
            "voice_message",
            {
              sessionId: sessionStorage.getItem("sessionId") || "default-session-id",
              audio: reader.result,
            },
            (response) => {
              if (response?.error) {
                console.error("Error sending voice message:", response.error);
                setMessages((prev) => [
                  ...prev,
                  {
                    text: "Failed to send voice message. Please try again.",
                    sender: "bot",
                    intent: "ERROR",
                    confidence: 0,
                  },
                ]);
              }
            }
          );
        };
      }

      setAudioRecorder(null);
      setAudioChunks([]);
    }
  };

  const cancelVoiceMessage = () => {
    setAudioRecorder(null);
    setAudioChunks([]);
  };

  const handleFileUpload = () => {
    fileInputRef.current.click();
  };

  const handleImageUpload = () => {
    imageInputRef.current.click();
  };

  const onFileSelected = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
      ];
      if (!validTypes.includes(file.type)) {
        alert("Invalid file type. Please upload a PDF, DOC, DOCX, or TXT file.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("File is too large. Maximum size is 5MB.");
        return;
      }

      setIsUploading(true);
      setMessages((prev) => [
        ...prev,
        {
          text: `📄 Document: ${file.name}`,
          sender: "user",
          type: "document",
        },
      ]);

      if (socketRef.current) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          socketRef.current.emit(
            "document",
            {
              filename: file.name,
              sessionId: sessionStorage.getItem("sessionId") || "default-session-id",
              file: reader.result,
            },
            (response) => {
              setIsUploading(false);
              if (response?.error) {
                console.error("Error uploading document:", response.error);
                setMessages((prev) => [
                  ...prev,
                  {
                    text: "Failed to upload document. Please try again.",
                    sender: "bot",
                    intent: "ERROR",
                    confidence: 0,
                  },
                ]);
              }
            }
          );
        };
      }
    }
    e.target.value = "";
  };

  const onImageSelected = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Invalid file type. Please upload an image file.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("Image is too large. Maximum size is 5MB.");
        return;
      }

      setIsUploading(true);
      setMessages((prev) => [
        ...prev,
        {
          text: `🖼️ Image: ${file.name}`,
          sender: "user",
          type: "image",
        },
      ]);

      if (socketRef.current) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          socketRef.current.emit(
            "image",
            {
              filename: file.name,
              sessionId: sessionStorage.getItem("sessionId") || "default-session-id",
              file: reader.result,
            },
            (response) => {
              setIsUploading(false);
              if (response?.error) {
                console.error("Error uploading image:", response.error);
                setMessages((prev) => [
                  ...prev,
                  {
                    text: "Failed to upload image. Please try again.",
                    sender: "bot",
                    intent: "ERROR",
                    confidence: 0,
                  },
                ]);
              }
            }
          );
        };
      }
    }
    e.target.value = "";
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const exitChat = () => {
    onClose();
  };

  const clearChat = () => {
    setMessages([]);
    setAudioRecorder(null);
    setAudioChunks([]);
    setInput("");
    setIsTyping(false);
  };

  const formatTimestamp = () => {
    const now = new Date();
    return `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
  };

  return (
    <div className="m-4 md:m-6">
      <div
        className={`transition-all duration-300 w-full ${
          isExpanded ? "max max-w-lg" : "max-w-xs"
        } bg-gray-900/90 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden flex flex-col ${
          isExpanded ? "h-[600px]" : "h-16"
        }`}
      >
        <div className="flex items-center justify-between bg-gradient-to-r from-indigo-600 to-purple-600 p-4">
          <div className="flex items-center">
            <div className="bg-white/10 p-2 rounded-full mr-3">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-wide">TALKRIO AI</h2>
            <div className="flex items-center ml-2">
              <span
                className={`rounded-full w-2 h-2 mr-1 ${
                  isConnected ? "bg-green-500" : "bg-red-500"
                }`}
              ></span>
              <span className="text-xs text-green-300">
                {isConnected ? "Online" : "Offline"}
              </span>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={clearChat}
              className="text-white/70 hover:text-white p-1 rounded-full transition"
              title="Clear Chat"
              aria-label="Clear chat"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button
              onClick={exitChat}
              className="text-white/70 hover:text-white p-1 rounded-full transition"
              title="Exit Chat"
              aria-label="Exit chat"
            >
              <LogOut className="w-5 h-5" />
            </button>
            <button
              onClick={toggleExpand}
              className="text-white/70 hover:text-white p-1 rounded-full transition"
              aria-label={isExpanded ? "Minimize chat" : "Expand chat"}
            >
              {isExpanded ? <ChevronDown className="w-5 h-5" /> : <X className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {isExpanded && (
          <>
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide bg-gray-900/60"
            >
              {messages.length === 0 && (
                <div className="flex justify-center my-10">
                  <div className="bg-gradient-to-br from-indigo-500/90 to-purple-600/90 rounded-2xl p-6 text-center shadow-lg max-w-sm">
                    <div className="bg-indigo-200/10 p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                      <Bot className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-white font-semibold text-lg mb-2">
                      Welcome to TALKRIO AI
                    </h3>
                    <p className="text-indigo-100/80 text-sm">
                      I'm here to assist you with any questions or tasks. How can I help you today?
                    </p>
                  </div>
                </div>
              )}

              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender === "bot" && (
                    <div className="bg-indigo-600 rounded-full w-8 h-8 flex items-center justify-center mr-2 flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}

                  <div
                    className={`p-3 max-w-xs rounded-2xl shadow-md ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-blue-600/90 to-indigo-700/90 text-white backdrop-blur-md"
                        : "bg-white/90 text-gray-800 backdrop-blur-md"
                    }`}
                  >
                    <div className="flex flex-col">
                      {msg.type === "image" && (
                        <div className="bg-indigo-100/10 p-2 rounded-lg mb-2 flex items-center">
                          <ImageIcon className="w-4 h-4 mr-2" />
                          <span>Image attachment</span>
                        </div>
                      )}
                      {msg.type === "document" && (
                        <div className="bg-indigo-100/10 p-2 rounded-lg mb-2 flex items-center">
                          <Paperclip className="w-4 h-4 mr-2" />
                          <span>Document attachment</span>
                        </div>
                      )}
                      {msg.type === "voice" && (
                        <div className="bg-indigo-100/10 p-2 rounded-lg mb-2 flex items-center">
                          <Mic className="w-4 h-4 mr-2" />
                          <span>Voice recording</span>
                        </div>
                      )}
                      <div>{msg.text}</div>
                      {msg.intent && msg.sender === "bot" && (
                        <div className="text-xs text-gray-500 mt-1">
                          Intent: {msg.intent} ({Math.round(msg.confidence * 100)}%)
                        </div>
                      )}
                      <div
                        className={`text-xs mt-1 ${
                          msg.sender === "user" ? "text-blue-200" : "text-gray-500"
                        } self-end`}
                      >
                        {formatTimestamp()}
                      </div>
                    </div>
                  </div>

                  {msg.sender === "user" && (
                    <div className="bg-purple-600 rounded-full w-8 h-8 flex items-center justify-center ml-2 flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center">
                  <div className="bg-indigo-600 rounded-full w-8 h-8 flex items-center justify-center mr-2">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white/90 p-3 rounded-2xl shadow text-gray-800 backdrop-blur-md">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              {isUploading && (
                <div className="flex items-center">
                  <div className="bg-indigo-600 rounded-full w-8 h-8 flex items-center justify-center mr-2">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white/90 p-3 rounded-2xl shadow text-gray-800 backdrop-blur-md">
                    Uploading...
                  </div>
                </div>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={onFileSelected}
              accept=".pdf,.doc,.docx,.txt"
            />
            <input
              type="file"
              ref={imageInputRef}
              style={{ display: "none" }}
              onChange={onImageSelected}
              accept="image/*"
            />

            {isRecording ? (
              <div className="flex items-center bg-red-600/90 backdrop-blur-md p-4 rounded-lg m-3">
                <div className="relative mr-3">
                  <Mic className="w-6 h-6 text-white" />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-400 rounded-full animate-ping"></span>
                </div>
                <span className="text-white flex-1 font-medium">
                  Recording your message...
                </span>
                <button
                  onClick={stopRecording}
                  className="bg-white text-red-600 px-3 py-2 rounded-lg font-medium text-sm hover:bg-gray-100 transition"
                  aria-label="Stop recording"
                >
                  Stop
                </button>
              </div>
            ) : audioRecorder ? (
              <div className="flex items-center bg-gradient-to-r from-indigo-500/90 to-purple-600/90 backdrop-blur-md p-4 m-3 rounded-lg">
                <Mic className="w-6 h-6 text-white mr-3" />
                <span className="text-white flex-1 font-medium">
                  Voice message ready to send
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={sendVoiceMessage}
                    className="bg-white text-indigo-600 px-3 py-2 rounded-lg font-medium text-sm hover:bg-gray-100 transition flex items-center"
                    aria-label="Send voice message"
                  >
                    <Send className="w-4 h-4 mr-1" /> Send
                  </button>
                  <button
                    onClick={cancelVoiceMessage}
                    className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
                    aria-label="Cancel voice message"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-gray-900/90 backdrop-blur-md border-t border-gray-800/50">
                <div className="flex justify-between mb-2">
                  <div className="flex space-x-2">
                    <button
                      className="bg-gray-800/80 p-2 rounded-full hover:bg-gray-700/80 transition"
                      onClick={handleImageUpload}
                      aria-label="Upload image"
                    >
                      <ImageIcon className="w-5 h-5 text-gray-400" />
                    </button>
                    <button
                      className="bg-gray-800/80 p-2 rounded-full hover:bg-gray-700/80 transition"
                      onClick={handleFileUpload}
                      aria-label="Upload document"
                    >
                      <Paperclip className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center bg-gray-800/80 backdrop-blur-md rounded-lg p-1">
                  <input
                    type="text"
                    className="flex-1 bg-transparent text-white p-2 outline-none placeholder-gray-500"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    aria-label="Chat input"
                  />
                  <div className="flex">
                    <button
                      className={`p-2 rounded-full transition ${
                        input.trim()
                          ? "bg-indigo-600 hover:bg-indigo-700"
                          : "bg-gray-700 text-gray-500"
                      }`}
                      onClick={sendMessage}
                      disabled={!input.trim()}
                      aria-label="Send message"
                    >
                      <Send className="w-5 h-5 text-white" />
                    </button>
                    <button
                      className="ml-2 bg-purple-600 p-2 rounded-full hover:bg-purple-700 transition"
                      onClick={startRecording}
                      aria-label="Start recording"
                    >
                      <Mic className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;