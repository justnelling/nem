"use client";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Note } from "@/app/types/note";

interface NoteItemProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

export function NoteItem({ note, onEdit, onDelete }: NoteItemProps) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">{note.title}</h3>
            {note.keywords && note.keywords.length > 0 && (
              <div className="flex gap-1 mt-1">
                {note.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="text-xs bg-slate-100 px-2 py-1 rounded"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(note)}>
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(note.id)}
            >
              Delete
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap text-sm text-gray-600">
          {note.content}
        </p>
        {note.metadata?.ai_summary && (
          <p className="mt-2 text-xs text-gray-500 italic">
            AI Summary: {note.metadata.ai_summary}
          </p>
        )}
      </CardContent>
      <CardFooter className="text-xs text-gray-500 flex justify-between">
        <span>Source: {note.metadata?.source}</span>
        <span>Last updated: {new Date(note.updated_at).toLocaleString()}</span>
      </CardFooter>
    </Card>
  );
}
