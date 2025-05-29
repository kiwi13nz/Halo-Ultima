import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL or key is missing in environment variables. Please check your .env file.');
}

// Create and export Supabase client instance
export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
});

/**
 * Check if the Supabase client can connect to the database
 * @returns Promise<boolean> True if connection is successful
 */
export const checkConnection = async (): Promise<boolean> => {
  try {
    // Try to get the server timestamp as a lightweight connection test
    const { data, error } = await supabase.rpc('get_server_timestamp');
    
    if (error) {
      console.error('Supabase connection error:', error);
      return false;
    }
    
    return Boolean(data);
  } catch (err) {
    console.error('Failed to connect to Supabase:', err);
    return false;
  }
};