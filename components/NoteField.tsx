"use client";
import { useState, useRef, useEffect } from "react";

export function NoteField({ initialNote, onSave }: { initialNote: string; onSave: (note: string) => void }) {
  const [note, setNote] = useState(initialNote);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [note]);

  return (
    <div className="mt-12 mb-24">
      <h3 className="font-serif text-xl mb-4 text-ink">Notes</h3>
      <textarea
        ref={textareaRef}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        onBlur={() => onSave(note)}
        placeholder="Any thoughts on today?"
        className="w-full bg-transparent border border-transparent focus:border-line hover:border-line/50 transition-colors resize-none overflow-hidden p-3 -mx-3 rounded-md text-ink text-base placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
        rows={3}
      />
    </div>
  );
}
