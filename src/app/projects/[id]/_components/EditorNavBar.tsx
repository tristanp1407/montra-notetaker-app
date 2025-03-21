"use client";

import TextIcon from "@icons/Text";
import CloudUploadIcon from "@icons/CloudUpload";
import MicrophoneIcon from "@icons/Microphone";
import CircleInfoIcon from "@icons/CircleInfo";
import { PanelType } from "../ProjectEditorClient";

interface IconNavBarProps {
  isPanelOpen: boolean;
  activePanel: PanelType;
  setActivePanel: (panel: PanelType) => void;
  onOpenPanel: () => void;
}

export default function IconNavBar({
  isPanelOpen,
  activePanel,
  setActivePanel,
  onOpenPanel,
}: IconNavBarProps) {
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
    {
      type: "INFO",
      label: <CircleInfoIcon className="w-6 h-6 text-gray-600" />,
    },
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
