
import { useEffect } from 'react';
import { useNotifications } from '@/context/NotificationContext';
import { useAuth } from '@/context/AuthContext';
import { supabase, enableRealtimeForTable } from '@/integrations/supabase/client';

interface UseNotificationTriggerProps {
  tableName: string;
  itemType: string;
}

export const useNotificationTrigger = ({ tableName, itemType }: UseNotificationTriggerProps) => {
  const { notifyAdminAction, notifyFacultyAction } = useNotifications();
  const { isAdmin, user } = useAuth();

  useEffect(() => {
    if (!user) return;

    console.log(`Setting up notification trigger for ${tableName} table`);
    
    // Enable PostgreSQL replication for this table if not already done
    const setupReplication = async () => {
      try {
        console.log(`Attempting to enable realtime for ${tableName}`);
        const result = await enableRealtimeForTable(tableName);
        console.log(`Realtime setup result for ${tableName}:`, result);
      } catch (err) {
        console.error('Failed to set up replication:', err);
      }
    };
    
    setupReplication();

    // Also enable realtime for notifications table to ensure we can listen to new notifications
    enableRealtimeForTable('notifications')
      .then(result => console.log('Notifications table realtime setup:', result))
      .catch(err => console.error('Failed to set up notifications realtime:', err));

    // Subscribe to changes in the specified table
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
          console.log(`New ${itemType} detected:`, payload);
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
            notifyAdminAction('added', itemType, itemName)
              .then(() => console.log(`Admin notification sent for ${itemName}`))
              .catch(e => console.error("Error sending admin notification:", e));
          } else {
            notifyFacultyAction('added', itemType, itemName)
              .then(() => console.log(`Faculty notification sent for ${itemName}`))
              .catch(e => console.error("Error sending faculty notification:", e));
          }
        }
      )
      .subscribe((status) => {
        console.log(`Subscription status for ${tableName}: ${status}`);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tableName, itemType, isAdmin, user, notifyAdminAction, notifyFacultyAction]);
};

export default useNotificationTrigger;
