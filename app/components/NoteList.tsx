"use client";
import { useState, useEffect } from "react";
import { noteOperations } from "@/app/lib/notes";
import { NoteItem } from "./NoteItem";
import { NoteForm } from "./NoteForm";
import { Card } from "@/components/ui/card";
import type { Note } from "@/app/types/note";

interface NoteListProps {
  userId: string;
}

export function NoteList({ userId }: NoteListProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingNote, setEditingNote] = useState<Note | null>(null); // tracks which note (if any) is currently being edited
  const [isLoading, setIsLoading] = useState(true);

  const loadNotes = async () => {
    try {
      const fetchedNotes = await noteOperations.getNotesByUserId(userId);
      setNotes(fetchedNotes);
    } catch (error) {
      console.error(`Error loading notes: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, [userId]);

  const handleDelete = async (id: string) => {
    try {
      await noteOperations.deleteNote(id);
      await loadNotes();
    } catch (error) {
      console.error(`Error deleting note: ${error}`);
    }
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note); //* once editingNote is set, it will be passed down to NoteForm, which is where will handle the edit logic
  };

  if (isLoading) {
    return <div>Loading notes...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">
          {editingNote ? "Edit Note" : "Create New Note"}
        </h2>
        <NoteForm
          userId={userId}
          initialNote={editingNote || undefined}
          onSubmit={() => {
            loadNotes();
            setEditingNote(null);
          }}
          onCancel={editingNote ? () => setEditingNote(null) : undefined}
        />
      </Card>

      <div className="space-y-4">
        {notes.length === 0 ? (
          <p className="text-center text-gray-500">No notes yet</p>
        ) : (
          notes.map((note) => (
            <NoteItem
              key={note.id}
              note={note}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
