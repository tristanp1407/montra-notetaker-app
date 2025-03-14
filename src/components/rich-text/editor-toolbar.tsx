"use client";

import type { Editor as TiptapEditor } from "@tiptap/react";

interface EditorToolbarProps {
  editor: TiptapEditor | null;
}

export default function EditorToolbar({ editor }: EditorToolbarProps) {
  if (!editor) return null;

  // Helper class builder
  const btnClass = (active: boolean) =>
    `p-2 rounded border ${
      active ? "border-gray-400 bg-muted" : "border-transparent"
    }`;

  return (
    <div className="flex justify-center gap-2 flex-wrap">
      {/* Bold */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={btnClass(editor.isActive("bold"))}
      >
        <span className="font-bold">𝗕</span>
      </button>

      {/* Italic */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={btnClass(editor.isActive("italic"))}
      >
        <span className="italic">𝑰</span>
      </button>

      {/* Strike */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={btnClass(editor.isActive("strike"))}
      >
        <span className="line-through">S</span>
      </button>

      {/* Headings */}
      {[1, 2, 3].map((level) => (
        <button
          key={level}
          type="button"
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({ level: level as 1 | 2 | 3 })
              .run()
          }
          className={btnClass(editor.isActive("heading", { level }))}
        >
          H{level}
        </button>
      ))}

      {/* Bullet list */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={btnClass(editor.isActive("bulletList"))}
      >
        •
      </button>

      {/* ✅ Ordered list */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList?.().run()}
        className={btnClass(editor.isActive("orderedList"))}
      >
        1.
      </button>

      {/* Blockquote */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={btnClass(editor.isActive("blockquote"))}
      >
        ❝
      </button>

      {/* Link */}
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
        🔗
      </button>

      {/* Unlink */}
      <button
        type="button"
        onClick={() => editor.chain().focus().unsetLink().run()}
        className="p-2 rounded border border-transparent"
      >
        ❌
      </button>
    </div>
  );
}
