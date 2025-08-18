import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { 
  Send, 
  Bot, 
  Mic, 
  StopCircle, 
  Trash2, 
  Image, 
  Paperclip,
  Smile,
  ChevronDown,
  X,
  User
} from "lucide-react";

// const socket = io("http://localhost:5000");

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioRecorder, setAudioRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const chatContainerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  useEffect(() => {
    socket.on("message", (response) => {
      setMessages((prev) => [...prev, { text: response, sender: "bot" }]);
      setIsTyping(false);
    });
    return () => socket.off("message");
  }, []);

  useEffect(() => {
    // Auto-scroll to the latest message
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim() === "") return;
    setMessages([...messages, { text: input, sender: "user" }]);
    socket.emit("message", input);
    setInput("");
    setIsTyping(true);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const audioChunks = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        setAudioChunks(audioChunks);
        setAudioRecorder(audioBlob);
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
      // Create FormData to send audio file
      const formData = new FormData();
      formData.append('audio', audioRecorder, 'voice-message.webm');
      
      // Emit voice message to server
      socket.emit('voice-message', formData);
      
      // Add visual representation to messages
      setMessages((prev) => [
        ...prev, 
        { 
          text: "🎤 Voice Message", 
          sender: "user", 
          type: "voice" 
        }
      ]);

      // Reset audio state
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
      // Here you would implement file sending logic
      setMessages((prev) => [
        ...prev, 
        { 
          text: `📄 Document: ${file.name}`, 
          sender: "user", 
          type: "document" 
        }
      ]);
    }
    // Reset the input
    e.target.value = '';
  };

  const onImageSelected = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Here you would implement image sending logic
      setMessages((prev) => [
        ...prev, 
        { 
          text: `🖼️ Image: ${file.name}`, 
          sender: "user", 
          type: "image" 
        }
      ]);
    }
    // Reset the input
    e.target.value = '';
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const clearChat = () => {
    setMessages([]);
  };

  const formatTimestamp = () => {
    const now = new Date();
    return `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
  };

  // Background image style
  const backgroundStyle = {
    backgroundImage: "url('https://cdnjs.cloudflare.com/ajax/libs/placeholder-loading/0.6.0/img/backgroundImage.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat"
  };

  return (
    <div className="flex justify-center items-center min-h-screen" style={backgroundStyle}>
      {/* Semi-transparent overlay for better readability */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      
      <div className={`transition-all duration-300 w-full z-10 ${isExpanded ? 'max-w-md' : 'max-w-xs'} bg-gray-900/90 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden flex flex-col ${isExpanded ? 'h-[80vh]' : 'h-16'}`}>
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-indigo-600 to-purple-600 p-4">
          <div className="flex items-center">
            <div className="bg-white/10 p-2 rounded-full mr-3">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-wide">TALKRIO AI</h2>
            <div className="flex items-center ml-2">
              <span className="bg-green-500 rounded-full w-2 h-2 mr-1"></span>
              <span className="text-xs text-green-300">Online</span>
            </div>
          </div>
          <div className="flex space-x-2">
            <button onClick={clearChat} className="text-white/70 hover:text-white p-1 rounded-full transition">
              <Trash2 className="w-5 h-5" />
            </button>
            <button onClick={toggleExpand} className="text-white/70 hover:text-white p-1 rounded-full transition">
              {isExpanded ? <ChevronDown className="w-5 h-5" /> : <X className="w-5 h-5" />}
            </button>
          </div>
        </div>
        
        {isExpanded && (
          <>
            {/* Chat Window */}
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide bg-gray-900/60"
            >
              {/* Welcome message */}
              {messages.length === 0 && (
                <div className="flex justify-center my-10">
                  <div className="bg-gradient-to-br from-indigo-500/90 to-purple-600/90 rounded-2xl p-6 text-center shadow-lg max-w-xs">
                    <div className="bg-indigo-200/10 p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                      <Bot className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-white font-semibold text-lg mb-2">Welcome to TALKRIO AI</h3>
                    <p className="text-indigo-100/80 text-sm">I'm here to assist you with any questions or tasks. How can I help you today?</p>
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
                          <Image className="w-4 h-4 mr-2" />
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
                      <div className={`text-xs mt-1 ${msg.sender === "user" ? "text-blue-200" : "text-gray-500"} self-end`}>
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
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Hidden file inputs */}
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={onFileSelected} 
              accept=".pdf,.doc,.docx,.txt" 
            />
            <input 
              type="file" 
              ref={imageInputRef} 
              style={{ display: 'none' }} 
              onChange={onImageSelected} 
              accept="image/*" 
            />
            
            {/* Voice Recording Controls */}
            {isRecording ? (
              <div className="flex items-center bg-red-600/90 backdrop-blur-md p-4 rounded-lg m-3">
                <div className="relative mr-3">
                  <StopCircle className="w-6 h-6 text-white" />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-400 rounded-full animate-ping"></span>
                </div>
                <span className="text-white flex-1 font-medium">Recording your message...</span>
                <button 
                  onClick={stopRecording}
                  className="bg-white text-red-600 px-3 py-2 rounded-lg font-medium text-sm hover:bg-gray-100 transition"
                >
                  Stop
                </button>
              </div>
            ) : audioRecorder ? (
              <div className="flex items-center bg-gradient-to-r from-indigo-500/90 to-purple-600/90 backdrop-blur-md p-4 m-3 rounded-lg">
                <Mic className="w-6 h-6 text-white mr-3" />
                <span className="text-white flex-1 font-medium">Voice message ready to send</span>
                <div className="flex space-x-2">
                  <button 
                    onClick={sendVoiceMessage}
                    className="bg-white text-indigo-600 px-3 py-2 rounded-lg font-medium text-sm hover:bg-gray-100 transition flex items-center"
                  >
                    <Send className="w-4 h-4 mr-1" /> Send
                  </button>
                  <button 
                    onClick={cancelVoiceMessage}
                    className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              /* Chat Input */
              <div className="p-3 bg-gray-900/90 backdrop-blur-md border-t border-gray-800/50">
                {/* Attachment buttons row */}
                <div className="flex justify-between mb-2">
                  <div className="flex space-x-2">
                    <button 
                      className="bg-gray-800/80 p-2 rounded-full hover:bg-gray-700/80 transition"
                      onClick={handleImageUpload}
                    >
                      <Image className="w-5 h-5 text-gray-400" />
                    </button>
                    <button 
                      className="bg-gray-800/80 p-2 rounded-full hover:bg-gray-700/80 transition"
                      onClick={handleFileUpload}
                    >
                      <Paperclip className="w-5 h-5 text-gray-400" />
                    </button>
                    <button 
                      className="bg-gray-800/80 p-2 rounded-full hover:bg-gray-700/80 transition"
                    >
                      <Smile className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>
                
                {/* Main input area */}
                <div className="flex items-center bg-gray-800/80 backdrop-blur-md rounded-lg p-1">
                  <input
                    type="text"
                    className="flex-1 bg-transparent text-white p-2 outline-none placeholder-gray-500"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  />
                  <div className="flex">
                    <button
                      className={`p-2 rounded-full transition ${input.trim() ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-700 text-gray-500'}`}
                      onClick={sendMessage}
                      disabled={!input.trim()}
                    >
                      <Send className="w-5 h-5 text-white" />
                    </button>
                    <button
                      className="ml-2 bg-purple-600 p-2 rounded-full hover:bg-purple-700 transition"
                      onClick={startRecording}
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

export default Chatbot;