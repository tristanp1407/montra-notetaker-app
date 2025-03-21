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
import { uploadToStorage } from "@lib/data/uploadToStorageClient";

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
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const initProjectAndDraft = async () => {
      setIsLoading(true);
      try {
        let project = await getProjectByIdClient(projectId);

        // If project doesn't exist, create a new one
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
      setFileUrl(data?.file_url ?? null);
    } catch (err) {
      console.error("[ProjectEditorClient] loadDraft error:", err);
      setContent("<h1></h1>");
    }
  };

  const handleFileUpload = async (file: File, draftId: string) => {
    const { url, error } = await uploadToStorage({
      file,
      draftId,
    });
    if (error) {
      throw new Error("File upload failed");
    }
    return url;
  };

  const handleTranscription = async (file: File) => {
    setActivePanel("INFO");
    setIsLoading(true);

    try {
      // Transcribe file
      const transcription = await transcribeAudio(file);

      if (!transcription) {
        setIsLoading(false);
        throw new Error("Transcription failed");
      }

      const hasContent = editorRef.current?.hasContent?.() || false;

      let buffer = "";

      if (hasContent) {
        try {
          const draftId = await handleNewDraft();
          if (draftId) {
            const url = await handleFileUpload(file, draftId);
            setFileUrl(url);
            await updateDraft(draftId, {
              transcript: transcription,
              file_url: url as string,
            });
          }
          setTranscript(transcription); // Needed to override empty transcript set when handling new draft
        } catch (err) {
          console.error(
            "[ProjectEditorClient] Error handling new draft or uploading file:",
            err
          );
        }

        await mergeDraft(
          transcription,
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
        if (!selectedDraftId) {
          throw new Error("No draft selected");
        }
        setTranscript(transcription);
        const url = await handleFileUpload(file, selectedDraftId);
        setFileUrl(url);
        await updateDraft(selectedDraftId, {
          transcript: transcription,
          file_url: url as string,
        });

        await generateNote(
          transcription,
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
      alert("We couldn't transcribe your audio. Please try again.");
    }
  };

  const renderPanelContent = () => {
    const sharedProps = {
      isLoading,
      transcript,
      handleTranscription,
    };

    switch (activePanel) {
      case "TEXT":
        return <TextPanel {...sharedProps} />;
      case "UPLOAD":
        return <FileUploadPanel {...sharedProps} />;
      case "INFO":
        return <LastTranscriptionPanel {...sharedProps} fileUrl={fileUrl} />;
      case "MIC":
        return <VoicePanel {...sharedProps} />;
      default:
        return <TextPanel {...sharedProps} />;
    }
  };

  const handleNewDraft = async (
    newDraftId?: string
  ): Promise<string | undefined> => {
    const currentContent = editorRef.current?.getHTML() || "<h1></h1>";

    try {
      const draftData = await createDraftClient(
        projectId,
        { content: currentContent },
        newDraftId
      );
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
        onNewDraft={() => handleNewDraft()}
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
        showInfoPanel={Boolean(transcript)}
      />
    </div>
  );
}
