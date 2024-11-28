"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { noteOperations } from "@/app/lib/notes";
import type { Note } from "@/app/types/note";

interface NoteFormProps {
  userId: string;
  initialNote?: Note;
  onSubmit: () => void;
  onCancel?: () => void;
}

export function NoteForm({
  userId,
  initialNote,
  onSubmit,
  onCancel,
}: NoteFormProps) {
  const [title, setTitle] = useState(initialNote?.title || "");
  const [content, setContent] = useState(initialNote?.content || "");
  const [keywords, setKeywords] = useState(
    initialNote?.keywords.join(", ") || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const keywordArray = keywords
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k.length > 0);

      if (initialNote) {
        await noteOperations.updateNote({
          id: initialNote.id,
          title,
          content,
          keywords: keywordArray,
          metadata: initialNote.metadata,
        });
      } else {
        await noteOperations.createNote({
          userId,
          title,
          content,
          keywords: keywordArray,
          metadata: {
            source: "web",
          },
        });
      }
      onSubmit();

      if (!initialNote) {
        setTitle("");
        setContent("");
        setKeywords("");
      }
    } catch (error) {
      console.error("Error saving note: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Note title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <Textarea
        placeholder="Note content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        className="min-h-[100px]
      "
      />
      <Input
        placeholder="Keywords (comma-separated)" //! TBC
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)}
      />
      <div className="flex gap-2 justify-end">
        {oncancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : initialNote
            ? "Update Note"
            : "Create Note"}
        </Button>
      </div>
    </form>
  );
}
