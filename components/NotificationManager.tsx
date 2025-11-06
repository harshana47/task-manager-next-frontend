"use client";

import { useEffect } from 'react';
import { useApp } from '@/contexts';

export default function NotificationManager() {
  const { notifications, removeNotification } = useApp();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
}

interface NotificationItemProps {
  notification: {
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
  };
  onClose: () => void;
}

function NotificationItem({ notification, onClose }: NotificationItemProps) {
  const bgColors = {
    success: 'bg-green-50 border-green-500',
    error: 'bg-red-50 border-red-500',
    info: 'bg-blue-50 border-blue-500',
    warning: 'bg-yellow-50 border-yellow-500',
  };

  const textColors = {
    success: 'text-green-800',
    error: 'text-red-800',
    info: 'text-blue-800',
    warning: 'text-yellow-800',
  };

  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️',
  };

  return (
    <div
      className={`${bgColors[notification.type]} ${textColors[notification.type]} px-4 py-3 rounded-lg shadow-lg border-l-4 flex items-start gap-3 animate-slideIn`}
    >
      <span className="text-xl">{icons[notification.type]}</span>
      <p className="flex-1 font-medium">{notification.message}</p>
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-gray-700 font-bold"
      >
        ×
      </button>
    </div>
  );
}
