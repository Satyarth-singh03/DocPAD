import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

export let supabase = null;

if (supabaseUrl && supabaseKey && supabaseUrl.startsWith('https://')) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Supabase Client Initialized successfully.');
  } catch (err) {
    console.warn('⚠️ Supabase Initialization warning:', err.message);
  }
} else {
  console.log('ℹ️ Running Supabase with dynamic storage fallback (Supabase credentials not set or placeholder).');
}
