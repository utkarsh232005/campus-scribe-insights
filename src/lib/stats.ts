import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';
import { supabase } from '@/integrations/supabase/client';

type MonthlyStat = Database['public']['Tables']['monthly_stats']['Row'];

type SupabaseClient = ReturnType<typeof createClient<Database>>;

/**
 * Updates the monthly statistics in the database
 * @returns Promise<boolean> - True if successful, false otherwise
 */
export async function updateMonthlyStats(): Promise<boolean> {
  try {
    // Get current month
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    // Get user count for current month
    const { count: userCount, error: userError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', currentMonth.toISOString());

    // Get report count for current month
    const { count: reportCount, error: reportError } = await supabase
      .from('reports')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', currentMonth.toISOString());

    // Get award count for current month
    const { count: awardCount, error: awardError } = await supabase
      .from('awards')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', currentMonth.toISOString());

    if (userError || reportError || awardError) {
      console.error('Error fetching counts:', { userError, reportError, awardError });
      throw new Error('Error fetching monthly statistics');
    }

    try {
      // Update monthly stats using the RPC function
      const { error: updateError } = await (supabase as any).rpc('upsert_monthly_stat', {
        p_month: currentMonth.toISOString(),
        p_users: userCount || 0,
        p_reports: reportCount || 0,
        p_awards: awardCount || 0
      });

      if (updateError) {
        console.error('Error updating stats:', updateError);
        throw new Error('Error updating monthly statistics');
      }
    } catch (rpcError) {
      console.error('RPC Error:', rpcError);
      throw new Error('Database function error');
    }

    return true;
  } catch (error) {
    console.error('Error updating monthly stats:', error);
    return false;
  }
}

/**
 * Fetches monthly statistics for the specified number of months
 * @param months - Number of months of data to fetch (default: 12)
 * @returns Promise<MonthlyStat[]> - Array of monthly statistics
 */
export async function getMonthlyStats(months: number = 12): Promise<MonthlyStat[]> {
  try {
    // First, ensure we have the latest data
    await updateMonthlyStats();
    
    // Get the last N months of data using the RPC function
    const { data, error } = await (supabase as any).rpc('get_monthly_stats', {
      p_months: months
    }) as { data: MonthlyStat[] | null; error: any };

    if (error) {
      console.error('Error fetching monthly stats:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getMonthlyStats:', error);
    return [];
  }
}