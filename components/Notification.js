import React, { useState, useEffect } from 'react';
import { XIcon } from '@heroicons/react/outline';

/**
 * Notification Component
 *
 * Displays status change notifications in a toast-like component
 */
const Notification = ({
  message,
  type = 'info',
  duration = 5000,
  onDismiss,
  icon
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  // Handle automatic dismissal after duration
  useEffect(() => {
    if (!duration) return;

    const timer = setTimeout(() => {
      handleDismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  // Handle dismiss with animation
  const handleDismiss = () => {
    setIsExiting(true);
    // Wait for exit animation to complete
    setTimeout(() => {
      setIsVisible(false);
      if (onDismiss) onDismiss();
    }, 300);
  };

  if (!isVisible) return null;

  // Set notification styling based on type
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50 dark:bg-green-900/20',
          border: 'border-green-300 dark:border-green-800',
          text: 'text-green-800 dark:text-green-100',
          iconBg: 'bg-green-100 dark:bg-green-800'
        };
      case 'error':
        return {
          bg: 'bg-red-50 dark:bg-red-900/20',
          border: 'border-red-300 dark:border-red-800',
          text: 'text-red-800 dark:text-red-100',
          iconBg: 'bg-red-100 dark:bg-red-800'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50 dark:bg-yellow-900/20',
          border: 'border-yellow-300 dark:border-yellow-800',
          text: 'text-yellow-800 dark:text-yellow-100',
          iconBg: 'bg-yellow-100 dark:bg-yellow-800'
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          border: 'border-blue-300 dark:border-blue-800',
          text: 'text-blue-800 dark:text-blue-100',
          iconBg: 'bg-blue-100 dark:bg-blue-800'
        };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-md transition-all duration-300 transform ${
        isExiting ? 'opacity-0 translate-x-10' : 'opacity-100 translate-x-0'
      }`}
    >
      <div
        className={`flex items-center p-4 rounded-lg shadow-md border ${typeStyles.bg} ${typeStyles.border}`}
        role="alert"
      >
        {icon && (
          <div className={`flex-shrink-0 ${typeStyles.iconBg} p-2 rounded-full mr-3`}>
            {icon}
          </div>
        )}
        <div className="flex-1">
          <p className={`text-sm font-medium ${typeStyles.text}`}>
            {message}
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className={`ml-4 ${typeStyles.text} hover:bg-opacity-20 hover:bg-gray-500 p-1 rounded-full focus:outline-none`}
        >
          <span className="sr-only">Dismiss</span>
          <XIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

/**
 * NotificationProvider Component
 *
 * Manages multiple notifications in a stack
 */
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Add a new notification
  const addNotification = (notification) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { ...notification, id }]);
    return id;
  };

  // Remove a notification by id
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // Provide context value to children
  const contextValue = {
    addNotification,
    removeNotification
  };

  return (
    <>
      {children}
      <div className="notification-container">
        {notifications.map(notification => (
          <Notification
            key={notification.id}
            {...notification}
            onDismiss={() => removeNotification(notification.id)}
          />
        ))}
      </div>
    </>
  );
};

// Create a notification context
export const NotificationContext = React.createContext({
  addNotification: () => {},
  removeNotification: () => {}
});

// Custom hook to use notifications
export const useNotification = () => {
  const context = React.useContext(NotificationContext);

  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }

  return {
    notify: (message, options = {}) => {
      return context.addNotification({
        message,
        ...options
      });
    },
    success: (message, options = {}) => {
      return context.addNotification({
        message,
        type: 'success',
        ...options
      });
    },
    error: (message, options = {}) => {
      return context.addNotification({
        message,
        type: 'error',
        ...options
      });
    },
    warning: (message, options = {}) => {
      return context.addNotification({
        message,
        type: 'warning',
        ...options
      });
    },
    info: (message, options = {}) => {
      return context.addNotification({
        message,
        type: 'info',
        ...options
      });
    },
    dismiss: (id) => {
      context.removeNotification(id);
    }
  };
};

export default Notification;
