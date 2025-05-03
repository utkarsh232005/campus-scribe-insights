
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Notification } from '@/types/user';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'created_at'>) => Promise<void>;
  notifyAdminAction: (action: string, itemType: string, itemName: string) => Promise<void>;
  notifyFacultyAction: (action: string, itemType: string, itemName: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { toast } = useToast();
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
  
  // Subscribe to realtime notification updates
  useEffect(() => {
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications'
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          setNotifications(prev => [newNotification, ...prev]);
          toast({
            title: "New Notification",
            description: newNotification.message,
            variant: newNotification.type === 'error' ? 'destructive' : 'default',
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

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

  // Function for admin actions that create notifications
  const notifyAdminAction = async (action: string, itemType: string, itemName: string) => {
    if (!user) return;
    
    const message = `Admin ${user.email} ${action} ${itemType}: ${itemName}`;
    
    await addNotification({
      message,
      type: 'info',
      user_id: user.id
    });
  };
  
  // Function for faculty actions that create notifications
  const notifyFacultyAction = async (action: string, itemType: string, itemName: string) => {
    if (!user) return;
    
    // Get faculty department info for better context
    const department = user.user_metadata?.department || 'unknown department';
    const message = `Faculty from ${department} ${action} ${itemType}: ${itemName}`;
    
    await addNotification({
      message,
      type: 'info',
      user_id: user.id
    });
  };

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      addNotification,
      notifyAdminAction,
      notifyFacultyAction
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
