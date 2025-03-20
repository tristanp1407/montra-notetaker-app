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

import EditorToolbar from "./editor-toolbar";
import EditorContentSkeleton from "./editor-content-skeleton";
import { updateDraft } from "@actions/draft/updateDraft";

export type EditorHandle = {
  appendChunk: (chunk: string) => void;
  replaceContent: (html: string) => void;
  hasContent: () => boolean;
  getHTML: () => string;
};

interface EditorProps {
  content?: string | null;
  projectId: string;
  editable?: boolean;
  isLoading?: boolean;
  draftId: string | null;
}

const Editor = forwardRef<EditorHandle, EditorProps>(
  ({ content, projectId, editable = true, isLoading, draftId }, ref) => {
    // Debounce saving project content by 1 second
    const debouncedUpdate = useCallback(
      debounce(async (contentHtml: string) => {
        if (!draftId) return null;
        await updateDraft(draftId, { content: contentHtml });
      }, 500),
      [projectId, content]
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
          openOnClick: true,
          autolink: true,
          linkOnPaste: true,
        }),
        BulletList,
        ListItem,
        Blockquote,
        Placeholder.configure({
          placeholder: "Start typing here...",
          emptyEditorClass:
            "cursor-text first:before:content-[attr(data-placeholder)] first:before:absolute first:before:text-gray-300 first:before:pointer-events-none first:before:h-0 text-3xl font-bold",
        }),
      ],
      immediatelyRender: false,
      content: content ?? { type: "doc", content: [] },
      editable,
      onUpdate: ({ editor }) => {
        debouncedUpdate(editor.getHTML());
      },
    });

    useEffect(() => {
      if (!editor) return;
      editor.commands.setContent(
        content ?? { type: "doc", content: [] },
        false
      );
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
      replaceContent: (content: string) => {
        if (editor) {
          editor.commands.setContent(content, false);
          debouncedUpdate(content);
        }
      },
      // Check if the HTML output is not empty or only an empty paragraph.
      hasContent: () => {
        if (!editor) return false;
        return !editor.isEmpty;
      },
      getHTML: () => editor?.getHTML?.() ?? "",
    }));

    if (!editor) return null;

    return (
      <div className="flex flex-col h-full space-y-4">
        <div className="flex flex-col h-full">
          <EditorToolbar editor={editor} />
          <div className="flex-1 relative overflow-auto">
            <div className="h-full max-w-[700px] mx-auto">
              <div className="prose prose-sm sm:prose-base max-w-none h-full pt-10 px-10">
                {isLoading ? (
                  <EditorContentSkeleton />
                ) : (
                  <EditorContent editor={editor} className="h-full" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

Editor.displayName = "Editor";
export default Editor;
