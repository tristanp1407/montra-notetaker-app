"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { useCallback } from "react";
import debounce from "lodash.debounce";

import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Heading from "@tiptap/extension-heading";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Link from "@tiptap/extension-link";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import Blockquote from "@tiptap/extension-blockquote";
import Placeholder from "@tiptap/extension-placeholder";
import EditorToolbar from "./editor-toolbar";

import { updateProjectContent } from "@actions/project/updateContent";

interface EditorProps {
  content?: any;
  projectId: string;
  editable?: boolean;
}

export default function Editor({
  content,
  projectId,
  editable = true,
}: EditorProps) {
  // Create a debounced update function (autosave)
  const debouncedUpdate = useCallback(
    debounce(async (json: any) => {
      await updateProjectContent(projectId, json);
    }, 1000),
    [projectId]
  );

  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Heading.configure({ levels: [1, 2, 3] }),
      Bold,
      Italic,
      Strike,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),
      BulletList,
      ListItem,
      Blockquote,
      Placeholder.configure({
        placeholder: "Start typing your note here...",
        emptyEditorClass:
          "cursor-text first:before:content-[attr(data-placeholder)] first:before:absolute first:before:top-3 first:before:left-3 first:before:text-gray-400 first:before:pointer-events-none first:before:h-0",
      }),
    ],
    // Ensure the editor starts with an empty doc if no content is provided.
    content: content ?? { type: "doc", content: [] },
    editable,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      debouncedUpdate(json);
    },
  });

  if (!editor) return null;

  return (
    <div className="flex flex-col h-full space-y-4">
      <EditorToolbar editor={editor} />
      <div className="flex-1 relative">
        {/* Container with fixed 200px left/right margin */}
        <div className="mx-[200px] h-full">
          <div className="prose prose-sm sm:prose-base max-w-none h-full">
            <EditorContent editor={editor} className="h-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
