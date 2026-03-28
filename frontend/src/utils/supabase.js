// const { createClient } = require('@supabase/supabase-js')

// if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
//     throw new Error('Missing Supabase environment variables')
// }

// // Service role client — bypasses RLS for admin operations
// // NEVER expose this key to the frontend
// const supabaseAdmin = createClient(
//     process.env.SUPABASE_URL,
//     process.env.SUPABASE_SERVICE_ROLE_KEY,
//     { auth: { autoRefreshToken: false, persistSession: false } }
// )

// // Anon client — respects RLS (use for user-scoped queries)
// const supabase = createClient(
//     process.env.SUPABASE_URL,
//     process.env.SUPABASE_ANON_KEY
// )

// module.exports = { supabase, supabaseAdmin }



// src/utils/supabase.js
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);