
export interface UserProfile {
  id: string;
  email: string;
  department: string;
  created_at: string;
  last_sign_in_at: string | null;
  isAdmin?: boolean;
}

export interface Notification {
  id: string;
  message: string;
  type?: string;
  read?: boolean;
  created_at?: string;
  user_id?: string;
}
