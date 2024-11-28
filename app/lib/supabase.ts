"use client";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";

const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// initialize supabase on client side
let supabase: SupabaseClient<Database>;

if (typeof window !== "undefined") {
  supabase = createClient(supabaseURL!, supabaseAnonKey!);
}

export { supabase };
