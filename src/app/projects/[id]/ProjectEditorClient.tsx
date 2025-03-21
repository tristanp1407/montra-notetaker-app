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
import { updateDraft } from "@actions/draft/updateDraft";

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
    setSelectedDraftId(draftId);
    try {
      // Fetch draft data
      const data = await getDraftByIdClient(draftId);
      // Update editor content
      editorRef.current?.replaceContent(data?.content ?? "<h1></h1>");
      // Update transcript
      setTranscript(data?.transcript ?? null);
    } catch (err) {
      console.error("[ProjectEditorClient] loadDraft error:", err);
      setContent("<h1></h1>");
    }
  };

  const handleTranscription = async (audioBlob: Blob) => {
    setActivePanel("INFO");
    setIsLoading(true);
    try {
      // Get audio from file
      const result = await transcribeAudio(audioBlob);
      if (!result) throw new Error("Transcription failed");

      const hasContent = editorRef.current?.hasContent?.() || false;

      let buffer = "";

      if (hasContent) {
        // Create a new draft then update it with the transcript
        handleNewDraft().then((draftId) => {
          if (draftId) {
            updateDraft(draftId, {
              transcript: result,
            });
          }
          setTranscript(result); // Needed to override empty transcript set when handling new draft
        });

        await mergeDraft(
          result,
          editorRef.current?.getHTML(),
          (chunk) => {
            setIsLoading(false);
            buffer += chunk;
            editorRef.current?.replaceContent(buffer);
          },
          () => {},
          "" // empty dictionary
        );
      } else {
        setTranscript(result);
        updateDraft(selectedDraftId as string, {
          transcript: result,
        });
        await generateNote(
          result,
          (chunk) => {
            setIsLoading(false);
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

  const handleNewDraft = async (): Promise<string | undefined> => {
    const currentContent = editorRef.current?.getHTML() || "<h1></h1>";

    try {
      const draftData = await createDraftClient(projectId, {
        content: currentContent,
      });
      await loadDraft(draftData.id);
      setDraftIds((prev) => [...prev, draftData.id]);
      editorRef.current?.replaceContent(currentContent);
      setSelectedDraftId(draftData.id);
      return draftData.id;
    } catch (err) {
      console.error("[ProjectEditorClient] handleNewDraft error:", err);
      return undefined;
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
