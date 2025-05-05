
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
    
    // Enable PostgreSQL replication for this table if not already done
    const setupReplication = async () => {
      try {
        // This is typically done in SQL migrations, but we'll do it here
        // to ensure the table is set up for realtime
        const { error } = await supabase.rpc('enable_realtime_for_table', {
          table_name: tableName
        });
        
        if (error) {
          console.log('Note: RPC failed, table may already be enabled or permissions lacking:', error);
          // This is not critical, as the table might already be set up
        }
      } catch (err) {
        console.error('Failed to set up replication:', err);
      }
    };
    
    setupReplication();

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
          // The user who created the item will get a personal notification
          // For all items, a broadcast notification is sent to all users
          if (isAdmin) {
            notifyAdminAction('added', itemType, itemName);
          } else {
            notifyFacultyAction('added', itemType, itemName);
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
