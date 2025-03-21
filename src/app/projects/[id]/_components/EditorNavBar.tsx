"use client";

import TextIcon from "@icons/Text";
import CloudUploadIcon from "@icons/CloudUpload";
import MicrophoneIcon from "@icons/Microphone";
import CircleInfoIcon from "@icons/CircleInfo";
import { PanelType } from "../ProjectEditorClient";
import { useEffect } from "react";

interface IconNavBarProps {
  isPanelOpen: boolean;
  activePanel: PanelType;
  setActivePanel: (panel: PanelType) => void;
  onOpenPanel: () => void;
  showInfoPanel: boolean;
}

export default function IconNavBar({
  isPanelOpen,
  activePanel,
  setActivePanel,
  onOpenPanel,
  showInfoPanel,
}: IconNavBarProps) {
  // Default to info panel, fall back on text
  useEffect(() => {
    // If the info panel is shown, set it as the active panel
    if (showInfoPanel) return setActivePanel("INFO");
    // Otherwise, set the text panel as the active panel
    setActivePanel("TEXT");
  }, [showInfoPanel]);

  const icons = [
    {
      type: "TEXT",
      label: <TextIcon className="w-6 h-6 text-gray-600" />,
    },
    {
      type: "UPLOAD",
      label: <CloudUploadIcon className="w-6 h-6 text-gray-600" />,
    },
    {
      type: "MIC",
      label: <MicrophoneIcon className="w-6 h-6 text-gray-600" />,
    },
    // Show the info panel icon only if the transcript exists
    ...(showInfoPanel
      ? [
          {
            type: "INFO",
            label: <CircleInfoIcon className="w-6 h-6 text-gray-600" />,
          },
        ]
      : []),
  ];

  return (
    <div className="flex flex-col w-12 border-l border-muted bg-gray-50 items-center py-4 space-y-3">
      {icons.map(({ type, label }) => (
        <button
          key={type}
          className={`text-xl p-1 rounded hover:bg-gray-200 cursor-pointer transition ${
            isPanelOpen && activePanel === type ? "bg-gray-200 font-bold" : ""
          }`}
          onClick={() => {
            setActivePanel(type as PanelType); // Set the active panel first
            if (!isPanelOpen) {
              onOpenPanel(); // Open the panel if it's not already open
            }
          }}
          title={type.toLowerCase()}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
