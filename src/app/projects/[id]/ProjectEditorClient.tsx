"use client";

import React, { useCallback, useState } from "react";
import Editor from "@components/rich-text/editor";
import AudioRecorder from "@components/audio/audio-recorder";

interface ProjectEditorClientProps {
  projectId: string;
  initialContent: any;
}

export default function ProjectEditorClient({
  projectId,
  initialContent,
}: ProjectEditorClientProps) {
  const [isTranscribing, setIsTranscribing] = useState(false);

  const handleTranscription = useCallback(async (audioBlob: Blob) => {
    try {
      setIsTranscribing(true);

      const formData = new FormData();
      formData.append("audio", audioBlob);

      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data?.transcript) {
        window.alert("Transcript: " + data.transcript);
        // In the future, pass to Claude handler or update editor content
      }
    } catch (err) {
      console.error("Transcription failed", err);
      window.alert("Transcription failed. Please try again.");
    } finally {
      setIsTranscribing(false);
    }
  }, []);

  return (
    <div className="flex flex-1 overflow-hidden">
      {isTranscribing ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="animate-pulse text-xl font-semibold">
              Transcribing...
            </div>
            <div className="text-muted-foreground text-sm">
              Please wait while we generate the transcript
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-auto p-6">
            <Editor projectId={projectId} content={initialContent} />
          </div>

          <div className="flex flex-col w-72 border-l border-muted bg-background p-4">
            <AudioRecorder onGenerate={handleTranscription} />
          </div>
        </>
      )}
    </div>
  );
}
