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
import TextPanel from "@components/project-editor/transcriptions-panels/TextPanel";
import FileUploadPanel from "@components/project-editor/transcriptions-panels/FileUplaodPanel";
import LastTranscriptionPanel from "@components/project-editor/transcriptions-panels/LastTranscriptionPanel";
import VoicePanel from "@components/project-editor/transcriptions-panels/VoicePanel";
import Cross from "@icons/Cross";
import Plus from "@icons/Plus";
import { createDraftClient, getDraftByIdClient } from "@lib/data/draftsClient";
import TextIcon from "@icons/Text";
import CloudUpload from "@icons/CloudUpload";
import Microphone from "@icons/Microphone";
import CircleInfo from "@icons/CircleInfo";
import SideBarInfo from "@icons/SideBarInfo";

interface ProjectEditorClientProps {
  projectId: string;
}

const PANELS = {
  TEXT: "text",
  UPLOAD: "upload",
  MIC: "mic",
  INFO: "info",
} as const;
type PanelType = keyof typeof PANELS;

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
          console.log("[ProjectEditorClient] Project created:", project);
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
            setIsLoading(false);
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
  const handleNewDraft = async () => {
    setIsLoading(true);
    try {
      const data = await createDraftClient(projectId);
      setDraftIds((prev) => [...prev, data.id]);

      // Clear content *before* loading new draft
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
      {/* Draft Tabs Column */}
      <div className="h-full border-r border-muted bg-background flex flex-col">
        {draftIds.length === 0 ? (
          <div className="p-4 flex items-center justify-center">
            <div className="w-20 h-20 bg-muted animate-pulse rounded"></div>
          </div>
        ) : (
          draftIds.map((draftId, index) => (
            <div
              key={draftId}
              className={`p-4 flex items-center justify-center cursor-pointer hover:bg-accent rounded ${
                selectedDraftId === draftId ? "border-2 border-primary" : ""
              }`}
              onClick={() => loadDraft(draftId)}
            >
              <div className="w-20 h-20 flex items-center justify-center bg-muted rounded">
                {index + 1}
              </div>
            </div>
          ))
        )}
        <div className="p-4 flex items-center justify-center">
          <button
            className="flex items-center justify-center w-11 h-7 border rounded border-muted px-2 py-1 gap-0.5 hover:bg-accent transition text-gray-700"
            onClick={() => handleNewDraft()}
            title="Add New Draft"
          >
            <Plus className="text-gray-600 w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 overflow-auto">
        <Editor
          ref={editorRef}
          projectId={projectId}
          content={content}
          isLoading={isLoading}
          draftId={selectedDraftId}
        />
      </div>

      {/* Slide-in Panel */}
      <div
        className={`transition-all duration-300 overflow-hidden ${
          isPanelOpen ? "w-72" : "w-0"
        }`}
      >
        <div className="h-full border-l border-muted bg-background flex flex-col">
          <div className="h-10 border-b flex items-center justify-between px-4">
            <p className="text-sm font-medium whitespace-nowrap">New Draft</p>
            <button
              onClick={() => setIsPanelOpen(false)}
              className="text-sm hover:text-muted-foreground"
              title="Close Panel"
            >
              <Cross />
            </button>
          </div>
          <div className="p-4 overflow-auto">{renderPanelContent()}</div>
        </div>
      </div>

      {/* Right Icon Nav Bar */}
      <div className="flex flex-col w-12 border-l border-muted bg-gray-50 items-center py-4 space-y-3">
        {isPanelOpen ? (
          [
            {
              type: "TEXT",
              label: (
                <TextIcon className="w-6 h-6 text-gray-600 cursor-pointer" />
              ),
            },
            {
              type: "UPLOAD",
              label: (
                <CloudUpload className="w-6 h-6 text-gray-600 cursor-pointer" />
              ),
            },
            {
              type: "MIC",
              label: (
                <Microphone className="w-6 h-6 text-gray-600 cursor-pointer" />
              ),
            },
            {
              type: "INFO",
              label: (
                <CircleInfo className="w-6 h-6 text-gray-600 cursor-pointer" />
              ),
            },
          ].map(({ type, label }) => (
            <button
              key={type}
              className={`text-xl p-1 rounded hover:bg-accent transition ${
                activePanel === type ? "bg-muted font-bold" : ""
              }`}
              onClick={() => setActivePanel(type as PanelType)}
              title={type.toLowerCase()}
            >
              {label}
            </button>
          ))
        ) : (
          <button
            className="text-xl p-1 rounded hover:bg-accent"
            onClick={() => setIsPanelOpen(true)}
            title="Open Panel"
          >
            <SideBarInfo className="w-6 h-6 text-gray-600 cursor-pointer" />
          </button>
        )}
      </div>
    </div>
  );
}
