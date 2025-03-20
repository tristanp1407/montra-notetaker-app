"use client";

import CrossIcon from "@icons/Cross";

interface SidePanelProps {
  isPanelOpen: boolean;
  renderContent: () => React.ReactNode;
  onClose: () => void;
}

export default function SidePanel({
  isPanelOpen,
  renderContent,
  onClose,
}: SidePanelProps) {
  return (
    <div
      className={`transition-all duration-300 overflow-hidden ${
        isPanelOpen ? "w-72" : "w-0"
      }`}
    >
      <div className="h-full border-l border-muted bg-background flex flex-col">
        <div className="h-10 border-b flex items-center justify-between px-4">
          <p className="text-sm font-medium whitespace-nowrap">New Draft</p>
          <button
            onClick={onClose}
            className="text-sm hover:bg-gray-200 p-1 rounded cursor-pointer"
            title="Close Panel"
          >
            <CrossIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 overflow-auto">{renderContent()}</div>
      </div>
    </div>
  );
}
