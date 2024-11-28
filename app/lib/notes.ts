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
  };
}

export const noteOperations = {
  async createNote(input: CreateNoteInput) {
    const { parentId, ...noteData } = input;

    let path = "";
    if (parentId) {
      const { data: parent } = await supabase
        .from("notes")
        .select("path")
        .eq("id", parentId)
        .single();

      path = parent ? `${parent.path}.${parentId}` : parentId;
    }

    const { data, error } = await supabase
      .from("notes")
      .insert({
        ...noteData,
        parent_id: parentId,
        path,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data as Note;
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
