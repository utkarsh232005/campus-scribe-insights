
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
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
  const [isLoading, setIsLoading] = useState(false);

  // Enhanced function to add notification with better error handling
  const addNotification = useCallback(async (notification: Omit<Notification, 'id' | 'created_at'>) => {
    if (!user && notification.user_id) {
      console.error('Cannot add user-specific notification when not logged in');
      return;
    }
    
    try {
      console.log('Adding notification:', notification);
      
      // Make sure we have a created_at timestamp
      const notificationWithTimestamp = {
        ...notification,
        created_at: new Date().toISOString(),
      };
      
      const { data, error } = await supabase
        .from('notifications')
        .insert([notificationWithTimestamp])
        .select();

      if (error) {
        console.error('Error adding notification:', error);
        throw error;
      } else {
        console.log('Notification added successfully:', data);
      }
    } catch (error) {
      console.error('Error in addNotification:', error);
    }
  }, [user]);

  // Function to fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      console.log('Fetching notifications for user:', user.id);
      
      // First fetch user-specific notifications and broadcasts (null user_id)
      const { data: userNotifications, error: userError } = await supabase
        .from('notifications')
        .select('*')
        .or(`user_id.eq.${user.id},user_id.is.null`) // Get both user-specific and broadcast notifications
        .order('created_at', { ascending: false })
        .limit(50);
        
      if (userError) {
        console.error('Error fetching notifications:', userError);
        return;
      }
      
      if (userNotifications) {
        // Sort by created_at in descending order
        const sortedNotifications = userNotifications.sort((a, b) => {
          return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
        });
        
        setNotifications(sortedNotifications);
        console.log(`Fetched ${sortedNotifications.length} notifications for user ${user.id}`);
      }
    } catch (error) {
      console.error('Error in fetchNotifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Fetch notifications on component mount or when user changes
  useEffect(() => {
    fetchNotifications();
    
    // Clear notifications when user logs out
    if (!user) {
      setNotifications([]);
    }
  }, [user, fetchNotifications]);
  
  // Function to broadcast a notification to all users (no user_id)
  const broadcastNotification = useCallback(async (message: string, type: string = 'info') => {
    try {
      console.log('Broadcasting notification to all users:', message);
      await addNotification({
        message,
        type,
        // Omitting user_id makes this a broadcast notification
      });
    } catch (error) {
      console.error('Error broadcasting notification:', error);
    }
  }, [addNotification]);

  // Subscribe to real-time notifications for ALL notifications
  useEffect(() => {
    // This channel listens for all notification inserts
    const channel = supabase
      .channel('notifications-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications'
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          console.log('Real-time notification received:', newNotification);
          
          // Add to local state if it's for this user or has no user_id (broadcast)
          if (!newNotification.user_id || (user && newNotification.user_id === user.id)) {
            console.log('Adding notification to state:', newNotification);
            setNotifications(prev => [newNotification, ...prev]);
            
            // Show toast for all broadcasts or user-specific notifications
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
      .subscribe((status) => {
        console.log(`Notification subscription status: ${status}`);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast, shadowToast, user]);

  // Function for admin actions that create notifications
  const notifyAdminAction = useCallback(async (action: string, itemType: string, itemName: string) => {
    if (!user) return;
    
    const message = `Admin ${user.email} ${action} ${itemType}: ${itemName}`;
    
    // Add to user's personal notifications
    await addNotification({
      message,
      type: 'info',
      user_id: user.id
    });
    
    // For all submissions, broadcast to all users
    await broadcastNotification(
      `New ${itemType} "${itemName}" has been submitted by an administrator`,
      'info'
    );
  }, [user, addNotification, broadcastNotification]);
  
  // Function for faculty actions that create notifications
  const notifyFacultyAction = useCallback(async (action: string, itemType: string, itemName: string) => {
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
    
    // For all submissions, broadcast to all users
    await broadcastNotification(
      `New ${itemType} "${itemName}" has been submitted from the ${departmentFormatted} department`,
      'info'
    );
  }, [user, addNotification, broadcastNotification]);

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
