"use client";

import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from "react";
import { useEditor, EditorContent } from "@tiptap/react";
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
import OrderedList from "@tiptap/extension-ordered-list";
import { updateProjectContent } from "@actions/project/updateContent";

import EditorToolbar from "./editor-toolbar";

// Our tiptap editor handle (ref) type
export type EditorHandle = {
  // For leftover text insertion, if you want to keep that
  appendChunk: (chunk: string) => void;
  // For replacing entire content with a TipTap JSON doc
  replaceContent: (jsonDoc: any) => void;
};

interface EditorProps {
  content?: any;
  projectId: string;
  editable?: boolean;
}

const Editor = forwardRef<EditorHandle, EditorProps>(
  ({ content, projectId, editable = true }, ref) => {
    // Debounce project content updates to avoid over-posting
    const debouncedUpdate = useCallback(
      debounce(async (json: any) => {
        await updateProjectContent(projectId, json);
      }, 1000),
      [projectId]
    );

    // Initialize the tiptap editor
    const editor = useEditor({
      extensions: [
        Document,
        Paragraph,
        Text,
        OrderedList,
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
            "cursor-text first:before:content-[attr(data-placeholder)] first:before:absolute first:before:text-gray-400 first:before:pointer-events-none first:before:h-0 text-5xl ",
        }),
      ],
      content: content ?? { type: "doc", content: [] },
      editable,
      immediatelyRender: false,
      onCreate: () => {
        console.log("[Editor] Editor initialized.");
      },
      onUpdate: ({ editor }) => {
        // Log current HTML if you want debugging
        console.log(
          "[Editor] Content updated. (HTML preview):",
          editor.getHTML()
        );
        // Save Tiptap JSON doc to server (debounced)
        debouncedUpdate(editor.getJSON());
      },
    });

    // Expose methods to parent via ref
    useImperativeHandle(ref, () => ({
      appendChunk: (chunk: string) => {
        if (!editor) {
          console.warn("[Editor] Editor not ready yet, skip chunk:", chunk);
          return;
        }
        // Insert plain text chunk
        console.log("[Editor] appendChunk =>", chunk);
        editor
          .chain()
          .focus()
          .insertContent(chunk, { updateSelection: false })
          .run();
      },
      replaceContent: (jsonDoc: any) => {
        if (!editor) {
          console.warn("[Editor] Editor not ready yet, skip doc:", jsonDoc);
          return;
        }
        console.log("[Editor] replaceContent =>", jsonDoc);

        // Set new content into editor
        editor.commands.setContent(jsonDoc, false);

        updateProjectContent(projectId, jsonDoc)
          .then(() =>
            console.log("[Editor] Project content saved after generation.")
          )
          .catch((err) =>
            console.error("[Editor] Failed to save generated note:", err)
          );
      },
    }));

    if (!editor) return null;

    return (
      <div className="flex flex-col h-full space-y-4">
        <EditorToolbar editor={editor} />
        <div className="flex-1 relative">
          <div className=" h-full max-w-[700px] mx-auto">
            <div className="prose prose-sm sm:prose-base max-w-none h-full">
              <EditorContent editor={editor} className="h-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

Editor.displayName = "Editor";
export default Editor;
