import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { toast } from '@/components/ui/sonner';
import { supabase, enableRealtimeForTable } from '@/integrations/supabase/client';
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
    try {
      if (!notification.message) {
        console.error('Cannot add notification with empty message');
        return;
      }
      
      console.log('Adding notification:', notification);
      
      // Insert notification with explicit created_at timestamp
      const { data, error } = await supabase
        .from('notifications')
        .insert([{
          ...notification,
          created_at: new Date().toISOString()
        }])
        .select();

      if (error) {
        console.error('Error adding notification:', error);
        throw error;
      } else {
        console.log('Notification added successfully:', data);
        
        // Show immediate toast for better UX
        toast(notification.type === 'error' ? 'Error' : 'New Notification', {
          description: notification.message,
          position: 'top-right',
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Error in addNotification:', error);
    }
  }, []);

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
    if (user?.id) {
      fetchNotifications();
      
      // Try to enable realtime for the notifications table
      enableRealtimeForTable('notifications')
        .then(() => console.log('Enabled realtime for notifications table'))
        .catch(err => console.error('Failed to enable realtime:', err));
    } else {
      setNotifications([]);
    }
  }, [user, fetchNotifications]);
  
  // Function to broadcast a notification to all users (no user_id)
  const broadcastNotification = useCallback(async (message: string, type: string = 'info') => {
    try {
      if (!message) {
        console.error('Cannot broadcast empty message');
        return;
      }
      
      console.log('Broadcasting notification to all users:', message);
      
      // Insert into the notifications table
      const { data, error } = await supabase
        .from('notifications')
        .insert([{
          message,
          type,
          // Omitting user_id makes this a broadcast notification
          created_at: new Date().toISOString(),
        }])
        .select();
        
      if (error) {
        console.error('Error broadcasting notification:', error);
        throw error;
      }
      
      console.log('Broadcast notification created:', data);
    } catch (error) {
      console.error('Error broadcasting notification:', error);
    }
  }, []);

  // Subscribe to real-time notifications
  useEffect(() => {
    if (!user) return;
    
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
        (payload: { new: Notification }) => {
          console.log('Real-time notification received:', payload);
          
          // Add to local state if it's for this user or has no user_id (broadcast)
          if (!payload.new.user_id || (user && payload.new.user_id === user.id)) {
            console.log('Adding notification to state:', payload.new);
            setNotifications(prev => [payload.new, ...prev]);
            
            // Show toast for all broadcasts or user-specific notifications
            toast(
              payload.new.type === 'error' ? 'Error' : 'New Notification',
              {
                description: payload.new.message,
                position: 'top-right',
                duration: 5000,
              }
            );
            
            // Also use shadow toast for accessibility
            shadowToast({
              title: payload.new.type === 'error' ? 'Error' : 'New Notification',
              description: payload.new.message,
              variant: payload.new.type === 'error' ? 'destructive' : 'default',
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
  }, [user, shadowToast]);

  // Function for admin actions that create notifications
  const notifyAdminAction = useCallback(async (action: string, itemType: string, itemName: string) => {
    if (!user) return;
    
    console.log(`Admin action: ${action} ${itemType} ${itemName}`);
    
    try {
      const message = `Admin ${user.email} ${action} ${itemType}: ${itemName}`;
      
      // Add to user's personal notifications
      await addNotification({
        message,
        type: 'info',
        user_id: user.id
      });
      
      // For all submissions, broadcast to all users
      await broadcastNotification(
        `New ${itemType} "${itemName}" has been ${action} by an administrator`,
        'info'
      );
    } catch (error) {
      console.error('Error in notifyAdminAction:', error);
    }
  }, [user, addNotification, broadcastNotification]);
  
  // Function for faculty actions that create notifications
  const notifyFacultyAction = useCallback(async (action: string, itemType: string, itemName: string) => {
    if (!user) return;
    
    try {
      // Get faculty department info for better context
      const department = user.user_metadata?.department || 'unknown department';
      const departmentFormatted = department.split('_').map((word: string) => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      
      console.log(`Faculty action from ${departmentFormatted}: ${action} ${itemType} ${itemName}`);
      
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
    } catch (error) {
      console.error('Error in notifyFacultyAction:', error);
    }
  }, [user, addNotification, broadcastNotification]);

  const contextValue = {
    notifications,
    addNotification,
    notifyAdminAction,
    notifyFacultyAction,
    broadcastNotification
  };

  return (
    <NotificationContext.Provider value={contextValue}>
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
