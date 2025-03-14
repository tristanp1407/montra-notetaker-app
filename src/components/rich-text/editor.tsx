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
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import { updateProjectContent } from "@actions/project/updateContent";

import EditorToolbar from "./editor-toolbar";

// Extended handle interface
export type EditorHandle = {
  appendChunk: (chunk: string) => void;
  replaceContent: (jsonDoc: any) => void;
  hasContent: () => boolean;
  getJSON: () => any;
};

interface EditorProps {
  content?: any;
  projectId: string;
  editable?: boolean;
}

const Editor = forwardRef<EditorHandle, EditorProps>(
  ({ content, projectId, editable = true }, ref) => {
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
        Underline,
        Highlight.configure({ multicolor: false }),
        TextAlign.configure({ types: ["heading", "paragraph"] }),
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
          placeholder: "Start typing here...",
          emptyEditorClass:
            "cursor-text first:before:content-[attr(data-placeholder)] first:before:absolute first:before:text-gray-400 first:before:pointer-events-none first:before:h-0 text-3xl ",
        }),
      ],
      content: content ?? { type: "doc", content: [] },
      editable,
      immediatelyRender: false,
      onCreate: () => {
        console.log("[Editor] Editor initialized.");
      },
      onUpdate: ({ editor }) => {
        console.log(
          "[Editor] Content updated. (HTML preview):",
          editor.getHTML()
        );
        debouncedUpdate(editor.getJSON());
      },
    });

    useImperativeHandle(ref, () => ({
      appendChunk: (chunk: string) => {
        if (!editor) {
          console.warn("[Editor] Editor not ready yet, skipping append.");
          return;
        }
        editor
          .chain()
          .focus()
          .insertContent(chunk, { updateSelection: false })
          .run();
      },
      replaceContent: (jsonDoc: any) => {
        if (!editor) {
          console.warn("[Editor] Editor not ready yet, skipping replace.");
          return;
        }
        console.log("[Editor] replaceContent =>", jsonDoc);
        editor.commands.setContent(jsonDoc, false);
        updateProjectContent(projectId, jsonDoc)
          .then(() =>
            console.log("[Editor] Project content saved after generation.")
          )
          .catch((err) =>
            console.error("[Editor] Failed to save content:", err)
          );
      },
      hasContent: () => {
        if (!editor) return false;
        const json = editor.getJSON();
        if (!json || !json.content || json.content.length === 0) return false;
        // If there is exactly one node and it is a paragraph, ensure it's not empty.
        if (json.content.length === 1 && json.content[0].type === "paragraph") {
          const paragraph = json.content[0];
          if (!paragraph.content || paragraph.content.length === 0)
            return false;
          const allEmpty = paragraph.content.every(
            (child: any) =>
              child.type === "text" &&
              (!child.text || child.text.trim().length === 0)
          );
          if (allEmpty) return false;
        }
        return true;
      },
      getJSON: () => editor?.getJSON?.(),
    }));

    if (!editor) return null;

    return (
      <div className="flex flex-col h-full space-y-4">
        <EditorToolbar editor={editor} />
        <div className="flex-1 relative">
          <div className="h-full max-w-[700px] mx-auto">
            <div className="prose prose-sm sm:prose-base max-w-none h-full pt-10">
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
