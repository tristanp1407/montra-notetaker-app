"use client";

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
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
import History from "@tiptap/extension-history";
import { updateProjectContent } from "@actions/project/updateContent";

import EditorToolbar from "./editor-toolbar";
import EditorContentSkeleton from "./editor-content-skeleton";

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
  isLoading?: boolean;
}

const Editor = forwardRef<EditorHandle, EditorProps>(
  ({ content, projectId, editable = true, isLoading }, ref) => {
    // Debounce saving project content by 1 second
    const debouncedUpdate = useCallback(
      debounce(async (json: any) => {
        await updateProjectContent(projectId, json);
      }, 1000),
      [content]
    );

    const editor = useEditor({
      extensions: [
        History,
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
            "cursor-text first:before:content-[attr(data-placeholder)] first:before:absolute first:before:text-gray-400 first:before:pointer-events-none first:before:h-0 text-3xl",
        }),
      ],
      immediatelyRender: false,
      content: content ?? { type: "doc", content: [] },
      editable,
      onUpdate: ({ editor }) => {
        debouncedUpdate(editor.getJSON());
      },
    });

    useEffect(() => {
      if (!editor) return;
      editor.commands.setContent(content, false);
    }, [content, editor]);

    useImperativeHandle(ref, () => ({
      appendChunk: (chunk: string) => {
        if (editor) {
          editor
            .chain()
            .focus()
            .insertContent(chunk, { updateSelection: false })
            .run();
        }
      },
      replaceContent: (jsonDoc: any) => {
        if (editor) {
          editor.commands.setContent(jsonDoc, false);
          updateProjectContent(projectId, jsonDoc).catch(() => {});
        }
      },
      // Check if the HTML output is not empty or only an empty paragraph.
      hasContent: () => {
        if (!editor) return false;
        const html = editor.getHTML().trim();
        return !(html === "<p></p>" || html === "<p><br></p>" || html === "");
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
              {isLoading ? (
                <EditorContentSkeleton />
              ) : (
                <EditorContent editor={editor} className="h-full" />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

Editor.displayName = "Editor";
export default Editor;
