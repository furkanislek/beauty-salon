"use client";

import { useEffect, useRef, useState } from "react";
import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({
  value,
  onChange,
}: RichTextEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<Editor | null>(null);
  const initialValueRef = useRef(value);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!containerRef.current) return;

    const editorInstance = new Editor({
      element: containerRef.current,
      extensions: [StarterKit],
      content: initialValueRef.current || "",
      onUpdate: ({ editor: e }) => {
        onChangeRef.current(e.getHTML());
      },
    });

    setEditor(editorInstance);
    return () => {
      editorInstance.destroy();
      setEditor(null);
    };
  }, []);

  useEffect(() => {
    if (editor && value !== undefined && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [value, editor]);

  const buttonBase =
    "px-2 py-1 text-sm rounded-md border border-transparent hover:bg-gray-100 text-gray-700";

  const toggleClasses = (isActive: boolean) =>
    isActive ? "bg-gray-200 text-gray-900" : "bg-transparent text-gray-700";

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {editor && (
        <div className="flex flex-wrap gap-1 border-b border-gray-200 bg-gray-50 px-2 py-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`${buttonBase} ${toggleClasses(editor.isActive("bold"))}`}
          >
            B
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`${buttonBase} ${toggleClasses(editor.isActive("italic"))}`}
          >
            I
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`${buttonBase} ${toggleClasses(editor.isActive("strike"))}`}
          >
            S
          </button>
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={`${buttonBase} ${toggleClasses(editor.isActive("heading", { level: 2 }))}`}
          >
            H2
          </button>
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={`${buttonBase} ${toggleClasses(editor.isActive("heading", { level: 3 }))}`}
          >
            H3
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`${buttonBase} ${toggleClasses(editor.isActive("bulletList"))}`}
          >
            • Liste
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`${buttonBase} ${toggleClasses(editor.isActive("orderedList"))}`}
          >
            1. Liste
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={buttonBase}
          >
            Paragraf
          </button>
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().unsetAllMarks().clearNodes().run()
            }
            className={buttonBase}
          >
            Temizle
          </button>
        </div>
      )}
      <div
        ref={containerRef}
        className="min-h-[180px] max-h-[500px] overflow-y-auto prose max-w-none px-3 py-2 focus:outline-none [&_.ProseMirror]:min-h-[180px] [&_.ProseMirror]:outline-none"
      />
    </div>
  );
}
