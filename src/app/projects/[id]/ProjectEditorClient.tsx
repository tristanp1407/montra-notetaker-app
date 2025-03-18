"use client";

import { useEffect, useState, useRef } from "react";

import Editor, { EditorHandle } from "@components/rich-text/editor";
import AudioRecorder from "@components/audio/audio-recorder";
import TranscriptBox from "@components/project-editor/transcript-box";
import { transcribeAudio } from "@lib/transcription/transcribe-audio";
import { generateNote } from "@lib/note-generation/generate-note";
import { mergeDraft } from "@lib/note-generation/merge-draft";
import {
  createProjectClient,
  getProjectByIdClient,
} from "@lib/data/projectsClient";

interface ProjectEditorClientProps {
  projectId: string;
}

export default function ProjectEditorClient({
  projectId,
}: ProjectEditorClientProps) {
  const editorRef = useRef<EditorHandle>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState<string | null>(null);

  console.log("⭐️ Content:", content);

  useEffect(() => {
    const fetchOrCreate = async () => {
      try {
        const project = await getProjectByIdClient(projectId);
        console.log("⭐️ Project from fetch:", project);

        if (project?.data) {
          setContent(project.data.content);
          return;
        }

        // If not found → create fallback
        const created = await createProjectClient(projectId);
        console.log("⭐️ Created project:", created);
        setContent(created.content);
      } catch (err) {
        console.error(
          "[ProjectEditorClient] Failed to load/create project:",
          err
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrCreate();
  }, [projectId]);

  const handleTranscription = async (audioBlob: Blob) => {
    setIsLoading(true);
    try {
      const result = await transcribeAudio(audioBlob);
      if (!result) throw new Error("Transcription failed");

      setTranscript(result);
      const hasContent = editorRef.current?.hasContent?.() || false;
      let buffer = "";

      if (hasContent) {
        await mergeDraft(
          result,
          editorRef.current?.getJSON(),
          (chunk) => {
            buffer += chunk;
            editorRef.current?.replaceContent(buffer);
          },
          () => {},
          ""
        );
      } else {
        await generateNote(
          result,
          (chunk) => {
            buffer += chunk;
            editorRef.current?.replaceContent(buffer);
          },
          () => {}
        );
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
        <Editor
          ref={editorRef}
          projectId={projectId}
          content={content}
          isLoading={isLoading}
        />
      </div>

      <div className="flex flex-col w-72 border-l border-muted bg-background">
        <div className="h-10 border-b-1 p-0 mb-5 flex items-center pl-4">
          <p>New Draft</p>
        </div>
        <div className="p-4">
          <AudioRecorder
            onGenerate={handleTranscription}
            isLoading={isLoading}
          />
          {transcript && <TranscriptBox transcript={transcript} />}
        </div>
      </div>
    </div>
  );
}
