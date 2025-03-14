"use client";

import React, { useRef, useState } from "react";
import Editor, { EditorHandle } from "@components/rich-text/editor";
import AudioRecorder from "@components/audio/audio-recorder";
import TranscriptBox from "@components/project-editor/transcript-box";
import { transcribeAudio } from "@lib/transcription/transcribe-audio";
import { generateNote } from "@lib/note-generation/generate-note";

export default function ProjectEditorClient({
  projectId,
  initialContent,
}: {
  projectId: string;
  initialContent: any;
}) {
  const editorRef = useRef<EditorHandle>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTranscription = async (audioBlob: Blob) => {
    console.log("[ProjectEditorClient] Starting transcription...");
    const transcriptText = await transcribeAudio(audioBlob);
    if (!transcriptText) {
      alert("Transcription failed");
      return;
    }
    setTranscript(transcriptText);
    console.log(
      "[ProjectEditorClient] Transcription complete:",
      transcriptText
    );

    setIsLoading(true);
    try {
      await generateNote(
        transcriptText,
        (tiptapDoc: any) => {
          // Replace the editor content with the complete TipTap document.
          editorRef.current?.replaceContent(tiptapDoc);
        },
        (tiptapDoc: any) => {
          console.log("[ProjectEditorClient] Final JSON received:", tiptapDoc);
        }
      );
    } catch (err) {
      console.error("Error generating note:", err);
    }
    setIsLoading(false);
  };

  const handleManualGenerateNote = async () => {
    if (!transcript) return;
    console.log("[ProjectEditorClient] Generating note manually...");
    setIsLoading(true);
    try {
      await generateNote(
        transcript,
        (tiptapDoc: any) => {
          editorRef.current?.replaceContent(tiptapDoc);
        },
        (tiptapDoc: any) => {
          console.log(
            "[ProjectEditorClient] Final JSON received (manual):",
            tiptapDoc
          );
        }
      );
    } catch (err) {
      console.error("Error generating note manually:", err);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 overflow-auto p-6 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
            <div className="text-xl font-bold">Loading...</div>
          </div>
        )}
        <Editor
          ref={editorRef}
          projectId={projectId}
          content={initialContent}
        />
      </div>
      <div className="flex flex-col w-72 border-l border-muted bg-background p-4 space-y-4">
        <AudioRecorder onGenerate={handleTranscription} />
        {transcript && <TranscriptBox transcript={transcript} />}
        {transcript && (
          <button
            onClick={handleManualGenerateNote}
            className="mt-2 w-full text-sm font-medium py-2 px-3 rounded-xl border border-border hover:bg-muted transition"
          >
            🔁 Generate Note from Transcript
          </button>
        )}
      </div>
    </div>
  );
}
