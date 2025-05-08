
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

    console.log(`Setting up notification trigger for ${tableName} table`);
    
    // Set up replication for the table
    const setupReplication = async () => {
      try {
        console.log(`Attempting to enable realtime for ${tableName}`);
        
        // Try direct SQL approach first (admin only)
        if (isAdmin) {
          const { error } = await supabase.rpc('enable_realtime_for_table', {
            table_name: tableName,
          });
          
          if (error) {
            console.error(`Error enabling realtime for ${tableName}:`, error);
          } else {
            console.log(`Successfully enabled realtime for ${tableName}`);
          }
        }
        
        // Also ensure notifications table has realtime enabled
        await supabase.rpc('enable_realtime_for_table', {
          table_name: 'notifications',
        });
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
            if (isAdmin) {
              notifyAdminAction('added', itemType, itemName)
                .catch(e => console.error("Error sending admin notification:", e));
            } else {
              notifyFacultyAction('added', itemType, itemName)
                .catch(e => console.error("Error sending faculty notification:", e));
            }
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
  }, [tableName, itemType, isAdmin, user, notifyAdminAction, notifyFacultyAction]);
};

export default useNotificationTrigger;
