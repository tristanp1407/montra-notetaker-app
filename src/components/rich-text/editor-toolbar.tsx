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

// Helper to determine active state only when the editor is focused
const isButtonActive = (
  editor: TiptapEditor,
  command: string | object,
  options?: any
) => editor.isFocused && editor.isActive(command, options);

export default function EditorToolbar({ editor }: EditorToolbarProps) {
  if (!editor) return null;

  // Button class helper – ensures consistent width and height, removes border, and adds background styling when active.
  const btnClass = (active: boolean) =>
    `p-2 rounded flex items-center justify-center w-9 h-9 hover:bg-gray-100 ${
      active ? "bg-gray-200" : ""
    }`;

  // Vertical separator element
  const Separator = () => <div className="h-full w-px bg-gray-300 mx-2" />;

  return (
    <div className="flex justify-center items-center gap-2 flex-wrap border-b h-10">
      {/* Group 1: Text and Headings */}
      <button
        type="button"
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={btnClass(isButtonActive(editor, "paragraph"))}
      >
        <span>T</span>
      </button>

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
          className={btnClass(isButtonActive(editor, "heading", { level }))}
        >
          <span>H{level}</span>
        </button>
      ))}

      <Separator />

      {/* Group 2: Lists */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={btnClass(isButtonActive(editor, "bulletList"))}
      >
        <List className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={btnClass(isButtonActive(editor, "orderedList"))}
      >
        <ListOrdered className="w-4 h-4" />
      </button>

      <Separator />

      {/* Group 3: Text Styles */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={btnClass(isButtonActive(editor, "bold"))}
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={btnClass(isButtonActive(editor, "italic"))}
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={btnClass(isButtonActive(editor, "underline"))}
      >
        <Underline className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={btnClass(isButtonActive(editor, "strike"))}
      >
        <Strikethrough className="w-4 h-4" />
      </button>

      <Separator />

      {/* Group 4: Link, Align, Highlight, Quote */}
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
        className={btnClass(isButtonActive(editor, "link"))}
      >
        <Link2 className="w-4 h-4" />
      </button>
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
          editor.isFocused &&
            (editor.isActive({ textAlign: "center" }) ||
              editor.isActive({ textAlign: "left" }))
        )}
      >
        {editor.isActive({ textAlign: "center" }) ? (
          <AlignCenter className="w-4 h-4" />
        ) : (
          <AlignLeft className="w-4 h-4" />
        )}
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={btnClass(isButtonActive(editor, "highlight"))}
      >
        <Highlighter className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={btnClass(isButtonActive(editor, "blockquote"))}
      >
        <Quote className="w-4 h-4" />
      </button>
    </div>
  );
}
