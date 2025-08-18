import React, { useState } from 'react';
import { FaBell } from 'react-icons/fa';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNotificationAPI, fetchNotificationsAPI, markNotificationAsReadAPI } from '../services/notificationService';
import Navbar from './Navbar';

const Notification = () => {
  const [filter, setFilter] = useState('all'); // Add filter state for all/unread
  const queryClient = useQueryClient();

  // Fetch notifications
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotificationsAPI,
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsReadAPI,
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteNotificationAPI,
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
    },
  });

  const handleMarkAsRead = (id) => {
    markAsReadMutation.mutate(id);
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  // Filter notifications based on read status
  const filteredNotifications = notifications.filter(note => 
    filter === 'all' ? true : !note.read
  );

  return (
    <div>
      <Navbar/>
    <div className="min-h-screen bg-white-900 text-blue-800 p-6 pt-23">
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FaBell size={24} />
            <h1 className="text-2xl font-bold">Notifications</h1>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded ${filter === 'all' ? 'bg-white-800' : 'bg-white-700'} hover:bg-gray-600`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded ${filter === 'unread' ? 'bg-white-800' : 'bg-white-700'} hover:bg-gray-600`}
            >
              Unread ({notifications.filter(n => !n.read).length})
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-blue-800 rounded-lg shadow-lg p-4">
          {isLoading ? (
            <p className="text-center py-4">Loading notifications...</p>
          ) : (
            <ul className="divide-y divide-gray-700">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((note) => (
                  <li
                    key={note._id}
                    className="py-4 flex justify-between items-center hover:bg-gray-750 transition-colors"
                  >
                    <div className="flex-1">
                      <p className={`${note.read ? 'text-gray-400' : 'text-white font-medium'}`}>
                        {note.message}
                      </p>
                      <p className="text-white text-sm">
                        {new Date(note.date).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-4 ml-4">
                      {!note.read && (
                        <button
                          onClick={() => handleMarkAsRead(note._id)}
                          className="text-blue-500 hover:text-blue-400 text-sm"
                        >
                          Mark as read
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(note._id)}
                        className="text-red-500 hover:text-red-400 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))
              ) : (
                <li className="py-4 text-center text-gray-400">
                  No {filter === 'all' ? '' : 'unread'} notifications
                </li>
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default Notification;
