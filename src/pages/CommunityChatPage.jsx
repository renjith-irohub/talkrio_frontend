// pages/CommunityChatPage.jsx
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import io from 'socket.io-client';
import { getChatMessagesAPI } from '../services/chatServices';
import { getToken } from '../utils/storageHandler';
import Navbar from '../components/Navbar';
import { useSelector } from 'react-redux';

const socket = io('http://localhost:5000', {
  auth: { token: getToken() },
});

const CommunityChatPage = () => {
  const { communityName } = useParams();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const { id: userId, name: username } = useSelector((state) => state.auth);
  const messagesEndRef = useRef(null);

  const { data: initialMessages = [], isLoading } = useQuery({
    queryKey: ['chatMessages', communityName],
    queryFn: () => getChatMessagesAPI(communityName),
    initialData: [],
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    setMessages(initialMessages);
    socket.emit('join_room', communityName);

    socket.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off('receive_message');
    };
  }, [communityName, initialMessages]);

  const sendMessage = () => {
    if (message.trim() && userId) {
      const messageData = {
        roomId: communityName,
        senderId: userId,
        receiverId: 'community',
        message,
        timestamp: new Date().toISOString(),
        username,
      };
      socket.emit('send_message', messageData);
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      {/* Added pt-20 (5rem) to create space below navbar */}
      <div className="max-w-4xl mx-auto pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            {communityName} Community
          </h1>
          <span className="ml-2 px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full">
            Live Chat
          </span>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          <div className="bg-indigo-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Community Chat Room</h2>
            <p className="text-indigo-100 text-sm">
              {messages.length} message{messages.length !== 1 ? 's' : ''} exchanged
            </p>
          </div>
          
          <div className="h-[480px] overflow-y-auto p-4 bg-gray-50">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                  <div className="text-gray-500">Loading messages...</div>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-full text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">💬</span>
                </div>
                <h3 className="text-lg font-medium text-gray-700">No messages yet</h3>
                <p className="text-gray-500 max-w-md mt-2">
                  Be the first to start the conversation in the {communityName} community!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.senderId === userId ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs sm:max-w-md md:max-w-lg rounded-2xl px-4 py-2 ${
                        msg.senderId === userId
                          ? 'bg-indigo-600 text-white rounded-br-none'
                          : 'bg-white text-gray-800 rounded-bl-none shadow-sm border border-gray-200'
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                   <span className={`text-xs font-medium ${
  msg.senderId === userId ? 'text-indigo-200' : 'text-gray-500'
}`}>
  {msg.senderId === userId ? 'You' : 'User'}
</span>
                        <span className={`text-xs ${
                          msg.senderId === userId ? 'text-indigo-300' : 'text-gray-400'
                        }`}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-sm">{msg.message}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
          
          <div className="border-t border-gray-200 bg-white p-4">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your message..."
                className="flex-grow px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button
                onClick={sendMessage}
                disabled={!message.trim()}
                className={`px-4 py-2 rounded-full ${
                  message.trim() 
                    ? 'bg-indigo-600 hover:bg-indigo-700' 
                    : 'bg-gray-300 cursor-not-allowed'
                } text-white transition-colors duration-200`}
              >
                Send
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Press Enter or click the button to send
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityChatPage;