import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, LogOut, HelpCircle, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface UserMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { icon: <User className="h-5 w-5" />, label: 'Profile', href: '/profile' },
  { icon: <Settings className="h-5 w-5" />, label: 'Settings', href: '/settings' },
  { icon: <Shield className="h-5 w-5" />, label: 'Admin Panel', href: '/admin' },
  { icon: <HelpCircle className="h-5 w-5" />, label: 'Help', href: '/help' },
];

export const UserMenu: React.FC<UserMenuProps> = ({ isOpen, onClose }) => {
  const { signOut } = useAuth();

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

          {/* Menu */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-16 right-4 w-64 bg-dark-surface rounded-lg border border-dark-border shadow-lg z-50"
          >
            {/* User Info */}
            <div className="p-4 border-b border-dark-border">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-text-primary">Admin User</h3>
                  <p className="text-xs text-text-secondary">admin@example.com</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              {menuItems.map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3 px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-dark-card rounded-lg transition-colors"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </motion.a>
              ))}

              {/* Logout Button */}
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: menuItems.length * 0.1 }}
                onClick={signOut}
                className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-accent-error hover:bg-dark-card rounded-lg transition-colors mt-2"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}; 