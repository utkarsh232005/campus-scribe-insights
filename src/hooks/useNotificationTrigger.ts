
import { useEffect } from 'react';
import { useNotifications } from '@/context/NotificationContext';
import { useAuth } from '@/context/AuthContext';
import { supabase, enableRealtimeForTable } from '@/integrations/supabase/client';

interface UseNotificationTriggerProps {
  tableName: string;
  itemType: string;
}

export const useNotificationTrigger = ({ tableName, itemType }: UseNotificationTriggerProps) => {
  const { addNotification } = useNotifications();
  const { isAdmin, user } = useAuth();

  useEffect(() => {
    if (!user) return;

    console.log(`Setting up notification trigger for ${tableName} table`);
    
    // Set up replication for the table
    const setupReplication = async () => {
      try {
        console.log(`Attempting to enable realtime for ${tableName}`);
        
        // Try to enable realtime for the table
        const result = await enableRealtimeForTable(tableName);
        if (!result.success) {
          console.error(`Error enabling realtime for ${tableName}:`, result.error);
        } else {
          console.log(`Successfully enabled realtime for ${tableName}`);
        }
        
        // Also ensure notifications table has realtime enabled
        await enableRealtimeForTable('notifications');
      } catch (err) {
        console.error('Failed to set up replication:', err);
      }
    };
    
    setupReplication();

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
          try {
            addNotification({
              title: `New ${itemType}`,
              message: `${itemName} has been added`,
              type: 'info',
            });
          } catch (error) {
            console.error("Error sending notification:", error);
          }
        }
      )
      .subscribe((status) => {
        console.log(`Subscription status for ${tableName}: ${status}`);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tableName, itemType, isAdmin, user, addNotification]);
};

export default useNotificationTrigger;
