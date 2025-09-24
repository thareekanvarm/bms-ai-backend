import { createClient } from "@supabase/supabase-js";

// Get environment variables from Cloudflare Workers or Node.js
const getEnvVar = (key: string): string | undefined => {
  // In Cloudflare Workers, use env binding
  if (typeof globalThis !== 'undefined' && (globalThis as any).env) {
    return (globalThis as any).env[key];
  }
  // Fallback to process.env for Node.js (only if process exists)
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key];
  }
  return undefined;
};

// Initialize with default values
let supabaseUrl = 'https://placeholder.supabase.co';
let supabaseServiceKey = 'placeholder-key';
let supabaseClient: any = null;

// Function to initialize Supabase client with environment variables
export const initializeSupabase = (env: any) => {
  supabaseUrl = env?.SUPABASE_URL || getEnvVar('SUPABASE_URL') || 'https://placeholder.supabase.co';
  supabaseServiceKey = env?.SUPABASE_SERVICE_ROLE_KEY || getEnvVar('SUPABASE_SERVICE_ROLE_KEY') || 'placeholder-key';
  
  // Recreate the client with new credentials
  supabaseClient = createClient(supabaseUrl, supabaseServiceKey);
};

// Get Supabase client (lazy initialization)
export const getSupabaseClient = () => {
  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseServiceKey);
  }
  return supabaseClient;
};

// Export for backward compatibility
export const supabase = getSupabaseClient();
