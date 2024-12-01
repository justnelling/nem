"use client";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";
import dotenv from "dotenv";
dotenv.config();

const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseURL || !supabaseAnonKey) {
  throw new Error("Supabase environment variables not set.");
}

// initialize supabase on client side
let supabase: SupabaseClient<Database>;

supabase = createClient(supabaseURL, supabaseAnonKey);

export { supabase };
