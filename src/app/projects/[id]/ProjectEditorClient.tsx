"use client";

import { useEffect, useState, useRef } from "react";
import Editor, { EditorHandle } from "@components/rich-text/editor";
import { transcribeAudio } from "@lib/transcription/transcribe-audio";
import { generateNote } from "@lib/note-generation/generate-note";
import { mergeDraft } from "@lib/note-generation/merge-draft";
import {
  createProjectClient,
  getProjectByIdClient,
} from "@lib/data/projectsClient";
import { createDraftClient, getDraftByIdClient } from "@lib/data/draftsClient";
import TextPanel from "@components/project-editor/transcriptions-panels/TextPanel";
import FileUploadPanel from "@components/project-editor/transcriptions-panels/FileUplaodPanel";
import LastTranscriptionPanel from "@components/project-editor/transcriptions-panels/LastTranscriptionPanel";
import VoicePanel from "@components/project-editor/transcriptions-panels/VoicePanel";
import DraftTabs from "./_components/DraftsTabs";
import SidePanel from "./_components/SidePanel";
import IconNavBar from "./_components/EditorNavBar";

export type PanelType = "TEXT" | "UPLOAD" | "MIC" | "INFO";

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
  const [activePanel, setActivePanel] = useState<PanelType>("MIC");
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [draftIds, setDraftIds] = useState<string[]>([]);
  const [selectedDraftId, setSelectedDraftId] = useState<string | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const initProjectAndDraft = async () => {
      setIsLoading(true);
      try {
        let project = await getProjectByIdClient(projectId);
        if (!project?.data) {
          project = await createProjectClient(projectId);
        }
        const draftIdList = project.data?.draftIds || [];
        setDraftIds(draftIdList);

        if (draftIdList.length > 0) {
          await loadDraft(draftIdList[0]);
        } else {
          setContent("<h1></h1>");
          setSelectedDraftId(null);
        }
      } catch (err) {
        console.error("[ProjectEditorClient] initProjectAndDraft error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initProjectAndDraft();
  }, [projectId]);

  const loadDraft = async (draftId: string) => {
    setIsLoading(true);
    setSelectedDraftId(draftId);
    try {
      const data = await getDraftByIdClient(draftId);
      setContent(data?.content || "<h1></h1>");
    } catch (err) {
      console.error("[ProjectEditorClient] loadDraft error:", err);
      setContent("<h1></h1>");
    } finally {
      setIsLoading(false);
    }
  };

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
          editorRef.current?.getHTML(),
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
      console.error("[ProjectEditorClient] Transcription error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderPanelContent = () => {
    const sharedProps = {
      isLoading,
      transcript,
      onGenerate: handleTranscription,
    };

    switch (activePanel) {
      case "TEXT":
        return <TextPanel {...sharedProps} />;
      case "UPLOAD":
        return <FileUploadPanel {...sharedProps} />;
      case "INFO":
        return <LastTranscriptionPanel {...sharedProps} />;
      case "MIC":
      default:
        return <VoicePanel {...sharedProps} />;
    }
  };

  const handleNewDraft = async () => {
    setIsLoading(true);
    try {
      const data = await createDraftClient(projectId);
      setDraftIds((prev) => [...prev, data.id]);
      setContent(null);
      setSelectedDraftId(null);
      await loadDraft(data.id);
    } catch (err) {
      console.error("[ProjectEditorClient] handleNewDraft error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full overflow-hidden">
      <DraftTabs
        draftIds={draftIds}
        selectedDraftId={selectedDraftId}
        onSelectDraft={loadDraft}
        onNewDraft={handleNewDraft}
        isLoading={isLoading}
      />
      <div className="flex-1 overflow-auto">
        <Editor
          ref={editorRef}
          projectId={projectId}
          content={content}
          isLoading={isLoading}
          draftId={selectedDraftId}
        />
      </div>
      <SidePanel
        isPanelOpen={isPanelOpen}
        renderContent={renderPanelContent}
        onClose={() => setIsPanelOpen(false)}
      />
      <IconNavBar
        isPanelOpen={isPanelOpen}
        activePanel={activePanel}
        setActivePanel={setActivePanel}
        onOpenPanel={() => setIsPanelOpen(true)}
      />
    </div>
  );
}
