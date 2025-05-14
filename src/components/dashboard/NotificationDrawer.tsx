import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, Trash2, X } from 'lucide-react';
import { useNotifications } from '@/context/NotificationContext';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const { notifications, markAllAsRead, clearAll } = useNotifications();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-96 bg-dark-surface border-l border-dark-border z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-dark-border">
              <div className="flex items-center space-x-3">
                <Bell className="h-5 w-5 text-accent-primary" />
                <h2 className="text-lg font-heading font-bold text-text-primary">
                  Notifications
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-dark-card transition-colors"
              >
                <X className="h-5 w-5 text-text-secondary" />
              </button>
            </div>

            {/* Actions */}
            <div className="p-4 border-b border-dark-border flex items-center justify-between">
              <button
                onClick={markAllAsRead}
                className="flex items-center space-x-2 text-sm text-accent-primary hover:text-accent-primary/80 transition-colors"
              >
                <Check className="h-4 w-4" />
                <span>Mark all as read</span>
              </button>
              <button
                onClick={clearAll}
                className="flex items-center space-x-2 text-sm text-accent-error hover:text-accent-error/80 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                <span>Clear all</span>
              </button>
            </div>

            {/* Notifications List */}
            <div className="h-[calc(100%-8rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-dark-border scrollbar-track-transparent">
              <AnimatePresence>
                {notifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border-b border-dark-border hover:bg-dark-card transition-colors"
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${
                        notification.type === 'success' ? 'bg-accent-success/10' :
                        notification.type === 'error' ? 'bg-accent-error/10' :
                        notification.type === 'warning' ? 'bg-accent-warning/10' :
                        'bg-accent-primary/10'
                      }`}>
                        {notification.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-text-primary">
                          {notification.title}
                        </p>
                        <p className="text-sm text-text-secondary mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-text-secondary mt-2">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="h-2 w-2 rounded-full bg-accent-primary" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}; 