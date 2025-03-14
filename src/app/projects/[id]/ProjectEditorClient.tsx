"use client";

import React, { useRef, useState } from "react";
import Editor, { EditorHandle } from "@components/rich-text/editor";
import AudioRecorder from "@components/audio/audio-recorder";
import TranscriptBox from "@components/project-editor/transcript-box";
import { transcribeAudio } from "@lib/transcription/transcribe-audio";
import { generateNote } from "@lib/note-generation/generate-note";
import { mergeDraft } from "@lib/note-generation/merge-draft";

interface ProjectEditorClientProps {
  projectId: string;
  initialContent: any;
}

export default function ProjectEditorClient({
  projectId,
  initialContent,
}: ProjectEditorClientProps) {
  const editorRef = useRef<EditorHandle>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTranscription = async (audioBlob: Blob) => {
    setIsLoading(true);
    try {
      const result = await transcribeAudio(audioBlob);
      if (!result) throw new Error("Transcription failed");

      setTranscript(result);

      const editorHasContent = editorRef.current?.hasContent?.() ?? false;
      const currentDraft = editorRef.current?.getJSON?.();

      const onUpdate = (doc: any) => editorRef.current?.replaceContent(doc);

      if (editorHasContent && currentDraft) {
        await mergeDraft(result, currentDraft, onUpdate, onUpdate);
      } else {
        await generateNote(result, onUpdate, onUpdate);
      }
    } catch (err) {
      console.error("[ProjectEditorClient] Error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 overflow-auto relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10 border border-gray-300 border-white">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-400 border-1 border-white rounded-full animate-pulse mb-2"></div>
              <div className="text-sm text-gray-400">
                Generating new draft...
              </div>
            </div>
          </div>
        )}
        <Editor
          ref={editorRef}
          projectId={projectId}
          content={initialContent}
        />
      </div>

      <div className="flex flex-col w-72 border-l border-muted bg-background ">
        <div className="h-10 border-b-1 p-0 mb-5 flex items-center pl-4">
          <p>New Draft</p>
        </div>
        <div className="p-4">
          <AudioRecorder onGenerate={handleTranscription} />
          {transcript && <TranscriptBox transcript={transcript} />}
        </div>
      </div>
    </div>
  );
}
