"use client";
import { createClient } from "@supabase/supabase-js";

const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// initialize supabase on client side
let supabase;

if (typeof window !== "undefined") {
  supabase = createClient(supabaseURL!, supabaseAnonKey!);
}

export { supabase };
