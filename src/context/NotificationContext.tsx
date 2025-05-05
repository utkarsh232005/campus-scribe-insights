
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import { Notification } from '@/types/user';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'created_at'>) => Promise<void>;
  notifyAdminAction: (action: string, itemType: string, itemName: string) => Promise<void>;
  notifyFacultyAction: (action: string, itemType: string, itemName: string) => Promise<void>;
  broadcastNotification: (message: string, type?: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { toast: shadowToast } = useToast();
  const { user, isAdmin } = useAuth();

  // Fetch existing notifications on component mount
  useEffect(() => {
    if (user) {
      const fetchNotifications = async () => {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20);
          
        if (error) {
          console.error('Error fetching notifications:', error);
        } else if (data) {
          setNotifications(data);
        }
      };
      
      fetchNotifications();
    }
  }, [user]);
  
  // Subscribe to all notifications, not just those for the current user
  useEffect(() => {
    // This channel listens for all notification inserts
    const channel = supabase
      .channel('all-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications'
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          
          // Add to local state if it's for this user or has no user_id (broadcast)
          if (!newNotification.user_id || (user && newNotification.user_id === user.id)) {
            setNotifications(prev => [newNotification, ...prev]);
          }
          
          // Show toast for all broadcasts or user-specific notifications
          if (!newNotification.user_id || (user && newNotification.user_id === user.id)) {
            // Use sonner toast for a better UX
            toast(
              newNotification.type === 'error' ? 'Error' : 'New Notification',
              {
                description: newNotification.message,
                position: 'top-right',
                duration: 5000,
              }
            );
            
            // Also use shadow toast for accessibility
            shadowToast({
              title: newNotification.type === 'error' ? 'Error' : 'New Notification',
              description: newNotification.message,
              variant: newNotification.type === 'error' ? 'destructive' : 'default',
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast, shadowToast, user]);

  const addNotification = async (notification: Omit<Notification, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert([
          {
            ...notification,
            created_at: new Date().toISOString(),
          }
        ]);

      if (error) {
        console.error('Error adding notification:', error);
      }

      return data;
    } catch (error) {
      console.error('Error in addNotification:', error);
    }
  };

  // New method to broadcast a notification to all users (no user_id)
  const broadcastNotification = async (message: string, type: string = 'info') => {
    if (!user) return;
    
    try {
      await addNotification({
        message,
        type,
        // Omitting user_id makes this a broadcast notification
      });
    } catch (error) {
      console.error('Error broadcasting notification:', error);
    }
  };

  // Function for admin actions that create notifications
  const notifyAdminAction = async (action: string, itemType: string, itemName: string) => {
    if (!user) return;
    
    const message = `Admin ${user.email} ${action} ${itemType}: ${itemName}`;
    
    await addNotification({
      message,
      type: 'info',
      user_id: user.id
    });
    
    // For report submissions, broadcast to all users
    if (itemType === 'report' && action === 'added') {
      await broadcastNotification(
        `New report "${itemName}" has been submitted by an administrator`,
        'info'
      );
    }
  };
  
  // Function for faculty actions that create notifications
  const notifyFacultyAction = async (action: string, itemType: string, itemName: string) => {
    if (!user) return;
    
    // Get faculty department info for better context
    const department = user.user_metadata?.department || 'unknown department';
    const departmentFormatted = department.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    
    const message = `Faculty from ${departmentFormatted} ${action} ${itemType}: ${itemName}`;
    
    // Add to user's personal notifications
    await addNotification({
      message,
      type: 'info',
      user_id: user.id
    });
    
    // For report submissions, broadcast to all users
    if (itemType === 'report' && action === 'added') {
      await broadcastNotification(
        `New report "${itemName}" has been submitted from the ${departmentFormatted} department`,
        'info'
      );
    }
  };

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      addNotification,
      notifyAdminAction,
      notifyFacultyAction,
      broadcastNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
