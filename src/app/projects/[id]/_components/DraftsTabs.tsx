"use client";

import { useState } from "react";
import DoubleChevronLeft from "@icons/DoubleChevronLeft";
import PlusIcon from "@icons/Plus";

interface DraftTabsProps {
  draftIds: string[];
  selectedDraftId: string | null;
  isLoading: boolean;
  onSelectDraft: (draftId: string) => Promise<void>;
  onNewDraft: () => Promise<void>;
}

export default function DraftTabs({
  draftIds,
  selectedDraftId,
  isLoading,
  onSelectDraft,
  onNewDraft,
}: DraftTabsProps) {
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapse = () => setCollapsed((prev) => !prev);

  return (
    <div className="h-full border-r border-muted bg-gray-50 flex flex-col items-center">
      {/* Header toggle */}
      <div
        onClick={toggleCollapse}
        className="w-full h-10 border-b border-gray-200 flex items-center justify-center cursor-pointer"
      >
        <DoubleChevronLeft
          className={`transition-transform duration-200 w-5 h-5 ${
            collapsed ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Skeletons during loading */}
      {isLoading && draftIds.length === 0 ? (
        <>
          {[...Array(3)].map((_, idx) => (
            <div
              key={`skeleton-${idx}`}
              className={`flex flex-col justify-between items-center gap-1 ${
                collapsed ? "mt-2 mx-2 p-0.5" : "mt-3 mx-3 p-1"
              } w-[48px] h-[64px] bg-white animate-pulse rounded border border-[#F5F5F5] shadow-sm`}
            >
              {!collapsed && (
                <div className="flex flex-col gap-1 mt-2">
                  <div className="w-[28px] h-[3px] bg-muted/40 rounded-full" />
                  <div className="w-[32px] h-[3px] bg-muted/40 rounded-full" />
                  <div className="w-[36px] h-[3px] bg-muted/40 rounded-full" />
                </div>
              )}
              <div className="w-[36px] h-[28px] bg-muted/40 rounded-[3px] mt-2" />
            </div>
          ))}
        </>
      ) : (
        <>
          {draftIds.map((draftId, index) => {
            const versionLabel = `v${index + 1}`;
            const isActive = selectedDraftId === draftId;

            return (
              <div
                key={draftId}
                onClick={() => onSelectDraft(draftId)}
                className={`flex flex-col justify-between items-center gap-1 ${
                  collapsed
                    ? "mt-2 mx-2 p-0.5"
                    : "mt-3 mx-3 p-1  w-[48px] h-[64px]"
                } bg-white rounded border shadow-[0px_2px_4px_rgba(0,0,0,0.06),0px_1px_0px_rgba(0,0,0,0.06)] cursor-pointer transition ${
                  isActive
                    ? "border-2 border-primary"
                    : "border-2 border-[#F5F5F5]"
                }`}
              >
                {!collapsed && (
                  <div className="relative w-[36px] h-[25px] m-auto">
                    <div className="absolute left-0 right-[20px] top-[4px] h-[3px] bg-[#EFEFEF] rounded-full" />
                    <div className="absolute left-0 right-[16px] top-[11px] h-[3px] bg-[#EFEFEF] rounded-full" />
                    <div className="absolute left-0 right-[12px] top-[18px] h-[3px] bg-[#EFEFEF] rounded-full" />
                  </div>
                )}

                <div
                  className={`flex justify-center items-center py-1 px-2 ml-0 mr-auto rounded-[3px] ${
                    isActive
                      ? "border-2 border-primary bg-blue-100"
                      : "bg-[#F5F5F5]"
                  }`}
                >
                  <span className="font-inconsolata font-medium text-[14px] leading-[100%] tracking-[-0.02em] text-[#707070]">
                    {versionLabel}
                  </span>
                </div>
              </div>
            );
          })}

          {/* New Draft Button */}
          <div
            onClick={onNewDraft}
            title="Add New Draft"
            className={`flex justify-center items-center w-[32px] h-[28] ${
              collapsed ? "mt-2" : "mt-3"
            } p-[2px] gap-[2px] bg-white border border-[#F5F5F5] shadow-[0_2px_4px_rgba(0,0,0,0.06),_0_1px_0px_rgba(0,0,0,0.06)] rounded-[4px] cursor-pointer transition hover:translate-y-[-1px] hover:shadow-md`}
          >
            <PlusIcon className="w-4 h-4 text-gray-700" />
          </div>
        </>
      )}
    </div>
  );
}
