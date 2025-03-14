"use client";

import type { Editor as TiptapEditor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Strikethrough,
  Underline,
  List,
  ListOrdered,
  Quote,
  Link2,
  AlignLeft,
  AlignCenter,
  Highlighter,
} from "lucide-react";

interface EditorToolbarProps {
  editor: TiptapEditor | null;
}

export default function EditorToolbar({ editor }: EditorToolbarProps) {
  if (!editor) return null;

  // Button class helper – adds active styling if the command is active.
  const btnClass = (active: boolean) =>
    `p-2 rounded border flex items-center justify-center ${
      active ? "border-gray-400 bg-muted w-10 h-10" : "border-transparent"
    }`;

  // Vertical separator element
  const Separator = () => <div className="h-full w-px bg-gray-300 mx-2" />;

  return (
    <div className="flex justify-center gap-2 flex-wrap border-b-1 h-10">
      {/* Group 1: Standard Text and Headings */}
      {/* Standard Text (T) */}
      <button
        type="button"
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={btnClass(editor.isActive("paragraph"))}
      >
        <span className="">T</span>
      </button>

      {/* Heading levels */}
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
          <span className="">H{level}</span>
        </button>
      ))}

      <Separator />

      {/* Group 2: Lists */}
      {/* Bullet List */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={btnClass(editor.isActive("bulletList"))}
      >
        <List className="w-4 h-4" />
      </button>

      {/* Numbered (Ordered) List */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList?.().run()}
        className={btnClass(editor.isActive("orderedList"))}
      >
        <ListOrdered className="w-4 h-4" />
      </button>

      <Separator />

      {/* Group 3: Text Styles */}
      {/* Bold */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={btnClass(editor.isActive("bold"))}
      >
        <Bold className="w-4 h-4" />
      </button>

      {/* Italic */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={btnClass(editor.isActive("italic"))}
      >
        <Italic className="w-4 h-4" />
      </button>

      {/* Underline */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={btnClass(editor.isActive("underline"))}
      >
        <Underline className="w-4 h-4" />
      </button>

      {/* Strikethrough */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={btnClass(editor.isActive("strike"))}
      >
        <Strikethrough className="w-4 h-4" />
      </button>

      <Separator />

      {/* Group 4: Link, Align, Highlight, Quote */}
      {/* Link toggle: if active, clicking unsets link */}
      <button
        type="button"
        onClick={() => {
          if (editor.isActive("link")) {
            editor.chain().focus().unsetLink().run();
          } else {
            const url = prompt("Enter URL");
            if (url) {
              editor
                .chain()
                .focus()
                .extendMarkRange("link")
                .setLink({ href: url })
                .run();
            }
          }
        }}
        className={btnClass(editor.isActive("link"))}
      >
        <Link2 className="w-4 h-4" />
      </button>

      {/* Align text toggle between left and center */}
      <button
        type="button"
        onClick={() => {
          if (editor.isActive({ textAlign: "center" })) {
            editor.chain().focus().setTextAlign("left").run();
          } else {
            editor.chain().focus().setTextAlign("center").run();
          }
        }}
        className={btnClass(
          editor.isActive({ textAlign: "center" }) ||
            editor.isActive({ textAlign: "left" })
        )}
      >
        {editor.isActive({ textAlign: "center" }) ? (
          <AlignCenter className="w-4 h-4" />
        ) : (
          <AlignLeft className="w-4 h-4" />
        )}
      </button>

      {/* Text Highlight */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={btnClass(editor.isActive("highlight"))}
      >
        <Highlighter className="w-4 h-4" />
      </button>

      {/* Quote */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={btnClass(editor.isActive("blockquote"))}
      >
        <Quote className="w-4 h-4" />
      </button>
    </div>
  );
}
