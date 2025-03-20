"use client";

import TextIcon from "@icons/Text";
import CloudUploadIcon from "@icons/CloudUpload";
import MicrophoneIcon from "@icons/Microphone";
import CircleInfoIcon from "@icons/CircleInfo";
import SideBarInfoIcon from "@icons/SideBarInfo";
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
  return (
    <div className="flex flex-col w-12 border-l border-muted bg-gray-50 items-center py-4 space-y-3">
      {isPanelOpen ? (
        [
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
        ].map(({ type, label }) => (
          <button
            key={type}
            className={`text-xl p-1 rounded hover:bg-gray-200 cursor-pointer transition ${
              activePanel === type ? "bg-gray-200 font-bold" : ""
            }`}
            onClick={() => setActivePanel(type as PanelType)}
            title={type.toLowerCase()}
          >
            {label}
          </button>
        ))
      ) : (
        <button
          className="text-xl p-1 rounded hover:bg-gray-200 cursor-pointer"
          onClick={onOpenPanel}
          title="Open Panel"
        >
          <SideBarInfoIcon className="w-6 h-6 text-gray-600" />
        </button>
      )}
    </div>
  );
}
