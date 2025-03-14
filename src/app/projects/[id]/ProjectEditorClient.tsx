"use client";

import React, { useCallback, useState } from "react";

import Editor from "@components/rich-text/editor";
import AudioRecorder from "@components/audio/audio-recorder";
import TranscriptBox from "@components/project-editor/transcript-box";
import { transcribeAudio } from "@lib/transcription/transcribe-audio";

interface ProjectEditorClientProps {
  projectId: string;
  initialContent: any;
}

export default function ProjectEditorClient({
  projectId,
  initialContent,
}: ProjectEditorClientProps) {
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState<string | null>(null);

  const handleTranscription = useCallback(async (audioBlob: Blob) => {
    setIsTranscribing(true);
    const transcriptText = await transcribeAudio(audioBlob);

    if (transcriptText) {
      setTranscript(transcriptText);
    } else {
      window.alert("Transcription failed. Please try again.");
    }

    setIsTranscribing(false);
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
            {transcript && <TranscriptBox transcript={transcript} />}
          </div>
        </>
      )}
    </div>
  );
}
