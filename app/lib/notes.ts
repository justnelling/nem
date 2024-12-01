// app/lib/notes.ts
"use client";
import { supabase } from "./supabase";
import type { Note } from "@/app/types/note";

export interface CreateNoteInput {
  user_id: string; // changed from user_id to match Note type
  parent_id?: string | null; // optional and nullable
  path?: string | null; // added to match Note type
  title: string; // required
  content: string; // required
  embedding?: string | null; // optional and nullable
  keywords?: string[] | null; // optional and nullable
  metadata?: {
    // optional and nullable
    source: "telegram" | "web" | "api";
    chat_id?: string;
    ai_summary?: string;
    language?: string;
  } | null;
  source_chat_id?: string | null; // optional and nullable
  source_message_id?: number | null; // optional and nullable
}

export interface UpdateNoteInput {
  id: string; // required for updates
  parent_id?: string | null; // optional and nullable
  path?: string | null; // optional and nullable
  title?: string; // optional
  content?: string; // optional
  embedding?: string | null; // optional and nullable
  keywords?: string[] | null; // optional and nullable
  metadata?: {
    // optional and nullable
    source: "telegram" | "web" | "api";
    chat_id?: string;
    ai_summary?: string;
    language?: string;
  } | null;
  source_chat_id?: string | null; // optional and nullable
  source_message_id?: number | null; // optional and nullable
}

function uuidToBase36(uuid: string): string {
  // Remove dashes and convert to base36
  return BigInt("0x" + uuid.replace(/-/g, "")).toString(36);
}

export const noteOperations = {
  async createNote(input: CreateNoteInput) {
    const { user_id, parent_id, ...noteData } = input;

    let path = "";
    if (parent_id) {
      const { data: parent } = await supabase
        .from("notes")
        .select("path")
        .eq("id", parent_id)
        .single();

      const parent_id_base36 = uuidToBase36(parent_id);

      path = parent?.path
        ? `${parent.path}.${parent_id_base36}`
        : `root.${parent_id_base36}`;
    }

    // Create an object that exactly matches Supabase's Insert type
    const insertData = {
      ...noteData,
      user_id: user_id, // changed from user_id to user_id to match Supabase
      parent_id: parent_id || null, // ensure null if undefined
      path: path || null, // ensure null if empty string
      source_chat_id: noteData.source_chat_id || null,
      source_message_id: noteData.source_message_id || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("notes")
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateNote(input: UpdateNoteInput) {
    const { id, ...updates } = input;

    const { data, error } = await supabase
      .from("notes")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Note;
  },

  async deleteNote(id: string) {
    const { error } = await supabase.from("notes").delete().eq("id", id);

    if (error) throw error;
  },

  async getNoteById(id: string) {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as Note;
  },

  async getNotesByUserId(user_id: string) {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Note[];
  },

  async getChildNotes(parent_id: string) {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("parent_id", parent_id)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data as Note[];
  },

  async getNoteBySourceMessage(
    chatId: string,
    messageId: number
  ): Promise<Note | null> {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("source_chat_id", chatId)
      .eq("source_message_id", messageId)
      .single();

    if (error) throw error;
    return data as Note;
  },
};
