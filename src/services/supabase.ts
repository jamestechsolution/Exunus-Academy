import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabaseConfigured = Boolean(url && publishableKey);

export const supabase = supabaseConfigured
  ? createClient(url, publishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export type AcademyRole =
  | 'super_admin'
  | 'school_admin'
  | 'principal'
  | 'vice_principal'
  | 'academic_director'
  | 'registrar'
  | 'teacher'
  | 'student'
  | 'parent'
  | 'accountant'
  | 'hr_manager'
  | 'librarian'
  | 'transport_manager'
  | 'store_manager'
  | 'staff';

export interface AcademyProfile {
  id: string;
  username: string | null;
  full_name: string;
  app_role: AcademyRole;
  school_id: string;
  phone: string | null;
  is_active: boolean;
}
