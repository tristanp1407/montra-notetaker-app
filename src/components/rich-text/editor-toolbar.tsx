"use client";

import { Editor } from "@tiptap/react";

interface EditorToolbarProps {
  editor: Editor | null;
}

export default function EditorToolbar({ editor }: EditorToolbarProps) {
  if (!editor) return null;

  // Helper function to build button classNames with fixed border to avoid layout shift
  const btnClass = (active: boolean) =>
    `p-2 rounded border ${
      active ? "border-gray-400 bg-muted" : "border-transparent"
    }`;

  return (
    <div className="flex justify-center gap-2">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={btnClass(editor.isActive("bold"))}
      >
        <span className="font-bold">𝗕</span>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={btnClass(editor.isActive("italic"))}
      >
        <span className="italic">𝑰</span>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={btnClass(editor.isActive("strike"))}
      >
        <span className="line-through">S</span>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={btnClass(editor.isActive("heading", { level: 1 }))}
      >
        <span>H1</span>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={btnClass(editor.isActive("heading", { level: 2 }))}
      >
        <span>H2</span>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={btnClass(editor.isActive("heading", { level: 3 }))}
      >
        <span>H3</span>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={btnClass(editor.isActive("bulletList"))}
      >
        <span>•</span>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={btnClass(editor.isActive("blockquote"))}
      >
        <span>❝</span>
      </button>
      <button
        type="button"
        onClick={() => {
          const url = prompt("Enter URL");
          if (url) {
            editor
              .chain()
              .focus()
              .extendMarkRange("link")
              .setLink({ href: url })
              .run();
          }
        }}
        className={btnClass(editor.isActive("link"))}
      >
        <span>🔗</span>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().unsetLink().run()}
        className="p-2 rounded border border-transparent"
      >
        <span>❌</span>
      </button>
    </div>
  );
}
