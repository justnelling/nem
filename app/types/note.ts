// app/types/note.ts

// Import the base types from Supabase
import type { Database } from "./supabase";
type DbNote = Database["public"]["Tables"]["notes"]["Row"];

export type Note = {
  id: string;
  user_id: string;
  parent_id: string | null;
  path: string | null; // Changed from just string to match Supabase's unknown | null
  title: string;
  content: string;
  embedding: string | null; // Changed from number[] to match Supabase's string | null
  keywords: string[] | null; // Added null possibility to match Supabase
  created_at: string;
  updated_at: string;
  metadata: {
    source: "telegram" | "web" | "api";
    chat_id?: string;
    ai_summary?: string;
    language?: string;
  } | null; // Added null possibility to match Supabase's Json | null
  thread_depth: number | null; // Added null possibility to match Supabase
  source_chat_id: string | null;
  source_message_id: number | null;
};
