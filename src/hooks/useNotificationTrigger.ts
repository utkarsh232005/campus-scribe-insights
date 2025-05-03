
import { useEffect } from 'react';
import { useNotifications } from '@/context/NotificationContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface UseNotificationTriggerProps {
  tableName: string;
  itemType: string;
}

export const useNotificationTrigger = ({ tableName, itemType }: UseNotificationTriggerProps) => {
  const { notifyAdminAction, notifyFacultyAction } = useNotifications();
  const { isAdmin, user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`${tableName}-changes`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: tableName
        },
        (payload) => {
          const newItem = payload.new as any;
          
          // Determine item name based on table structure
          let itemName = '';
          if (tableName === 'awards') {
            itemName = newItem.title || 'New Award';
          } else if (tableName === 'faculty') {
            itemName = newItem.name || 'New Faculty Member';
          } else if (tableName === 'reports') {
            itemName = newItem.title || 'New Report';
          }
          
          // Trigger appropriate notification based on user role
          if (isAdmin) {
            notifyAdminAction('added', itemType, itemName);
          } else {
            notifyFacultyAction('added', itemType, itemName);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tableName, itemType, isAdmin, user, notifyAdminAction, notifyFacultyAction]);
};

export default useNotificationTrigger;
