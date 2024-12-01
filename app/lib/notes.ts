// app/lib/notes.ts
"use client";
import { supabase } from "./supabase";
import type { Note } from "@/app/types/note";

export interface CreateNoteInput {
  userId: string;
  parentId?: string;
  title: string;
  content: string;
  keywords?: string[];
  metadata: {
    source: "telegram" | "web" | "api";
    chat_id?: string;
    ai_summary?: string;
    language?: string;
  };
  source_chat_id?: string;
  source_message_id?: number;
}

export interface UpdateNoteInput {
  id: string;
  title?: string;
  content?: string;
  keywords?: string[];
  metadata: {
    source: "telegram" | "web" | "api";
    chat_id?: string;
    ai_summary?: string;
    language?: string;
  } | null;
  source_chat_id?: string;
  source_message_id?: number;
}

export const noteOperations = {
  async createNote(input: CreateNoteInput) {
    const { userId, parentId, ...noteData } = input;

    let path = "";
    if (parentId) {
      const { data: parent } = await supabase
        .from("notes")
        .select("path")
        .eq("id", parentId)
        .single();

      path = parent ? `${parent.path}.${parentId}` : parentId;
    }

    // Create an object that exactly matches Supabase's Insert type
    const insertData = {
      ...noteData,
      user_id: userId, // changed from userId to user_id to match Supabase
      parent_id: parentId || null, // ensure null if undefined
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

  async getNotesByUserId(userId: string) {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Note[];
  },

  async getChildNotes(parentId: string) {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("parent_id", parentId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data as Note[];
  },
};
