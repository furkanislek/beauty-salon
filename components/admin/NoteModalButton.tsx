"use client";

import { useState } from "react";

export default function NoteModalButton({ note }: { note: string | null }) {
  const [open, setOpen] = useState(false);

  if (!note || !note.trim()) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg border border-gray-200"
      >
        Not
      </button>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Randevu Notu</h3>
            <p className="text-gray-700 whitespace-pre-wrap mb-6">{note}</p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
