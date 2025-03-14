"use client";

import React, { useRef, useState } from "react";
import Editor, { EditorHandle } from "@components/rich-text/editor";
import AudioRecorder from "@components/audio/audio-recorder";
import TranscriptBox from "@components/project-editor/transcript-box";
import { transcribeAudio } from "@lib/transcription/transcribe-audio";
// Updated import from the new code that streams TipTap JSON
import { streamGenerateNote } from "@lib/note-generation/generate-note";

export default function ProjectEditorClient({
  projectId,
  initialContent,
}: {
  projectId: string;
  initialContent: any;
}) {
  const editorRef = useRef<EditorHandle>(null);
  const [transcript, setTranscript] = useState<string | null>(null);

  // Example: track if streaming is happening
  const [isStreaming, setIsStreaming] = useState(false);

  const handleTranscription = async (audioBlob: Blob) => {
    console.log("[ProjectEditorClient] Start transcription...");
    const transcriptText = await transcribeAudio(audioBlob);

    if (!transcriptText) {
      alert("Transcription failed");
      return;
    }

    setTranscript(transcriptText);
    console.log(
      "[ProjectEditorClient] Transcription complete =>",
      transcriptText
    );

    setIsStreaming(true);
    // stream JSON doc from server
    await streamGenerateNote(transcriptText, (jsonDoc) => {
      console.log("[ProjectEditorClient] Received TipTap JSON doc:", jsonDoc);
      // replace entire editor content with new doc
      editorRef.current?.replaceContent(jsonDoc);
    });
    setIsStreaming(false);
  };

  const handleManualGenerateNote = async () => {
    if (!transcript) return;
    console.log(
      "[ProjectEditorClient] Manually generating note from transcript..."
    );

    setIsStreaming(true);
    await streamGenerateNote(transcript, (jsonDoc) => {
      console.log(
        "[ProjectEditorClient] Received TipTap JSON doc (manual):",
        jsonDoc
      );
      editorRef.current?.replaceContent(jsonDoc);
    });
    setIsStreaming(false);
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 overflow-auto p-6">
        <Editor
          ref={editorRef}
          projectId={projectId}
          content={initialContent}
        />

        {/* If you'd like a subtle streaming indicator */}
        {isStreaming && (
          <div className="mt-4 text-xs text-muted-foreground animate-pulse">
            ⏳ Streaming structured note into editor...
          </div>
        )}
      </div>

      <div className="flex flex-col w-72 border-l border-muted bg-background p-4 space-y-4">
        <AudioRecorder onGenerate={handleTranscription} />

        {transcript && <TranscriptBox transcript={transcript} />}

        {/* TEMPORARY NOTE GENERATION BUTTON */}
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
