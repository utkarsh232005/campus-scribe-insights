// This file contains the type definitions for the database tables and functions.
// For production, generate types using:
// npx supabase gen types typescript --project-id your-project-ref > src/types/database.types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      monthly_stats: {
        Row: {
          month: string;
          users: number;
          reports: number;
          awards: number;
          updated_at: string;
        };
        Insert: {
          month: string;
          users?: number;
          reports?: number;
          awards?: number;
          updated_at?: string;
        };
        Update: {
          month?: string;
          users?: number;
          reports?: number;
          awards?: number;
          updated_at?: string;
        };
      };
      admin_users: {
        Row: {
          id: string;
          email: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          is_active?: boolean;
          created_at?: string;
        };
      };
      awards: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          award_type: string;
          recipient: string;
          department: string;
          year: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          award_type: string;
          recipient: string;
          department: string;
          year: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          award_type?: string;
          recipient?: string;
          department?: string;
          year?: number;
          created_at?: string;
        };
      };
      faculty: {
        Row: {
          id: string;
          name: string;
          email: string;
          department: string;
          designation: string;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          department: string;
          designation: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          department?: string;
          designation?: string;
          created_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          message: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          message?: string;
          is_read?: boolean;
          created_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          updated_at: string | null;
          username: string | null;
          department: string | null;
          designation: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string | null;
          username?: string | null;
          department?: string | null;
          designation?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string | null;
          username?: string | null;
          department?: string | null;
          designation?: string | null;
          created_at?: string;
        };
      };
      reports: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string;
          status: string;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          content: string;
          status?: string;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          content?: string;
          status?: string;
          created_at?: string;
          updated_at?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      upsert_monthly_stat: {
        Args: {
          p_month: string;
          p_users: number;
          p_reports: number;
          p_awards: number;
        };
        Returns: void;
      };
      get_monthly_stats: {
        Args: {
          p_months: number;
        };
        Returns: Array<{
          month: string;
          users: number;
          reports: number;
          awards: number;
          updated_at: string;
        }>;
      };
      get_admin_status: {
        Args: {
          admin_email: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
