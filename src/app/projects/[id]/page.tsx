import { ChevronLeft, ScrollText, User } from "lucide-react";

import TitleEditor from "@components/project-editor/title-editor";
import BackButton from "@components/ui/back-button";

import ProjectEditorClient from "./ProjectEditorClient";

export default async function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const projectId = (await params)?.id;

  return (
    <div className="h-screen w-full flex flex-col">
      <div className="flex items-center justify-between border-b px-5 py-3 rounded-t">
        <BackButton />

        <div className="flex-1 flex justify-center items-center gap-2">
          <ScrollText className="w-4 h-4" />
          <TitleEditor projectId={projectId} />
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-teal-400 text-primary-foreground rounded-lg w-8 h-8 flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <button className="text-sm px-3 py-1 border rounded bg-primary text-white hover:bg-primary-dark transition">
            Share
          </button>
        </div>
      </div>

      <ProjectEditorClient projectId={projectId} />
    </div>
  );
}
