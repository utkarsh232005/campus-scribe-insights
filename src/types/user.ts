
export interface UserProfile {
  id: string;
  email: string;
  department: string;
  created_at: string;
  last_sign_in_at: string | null;
  isAdmin?: boolean;
}
