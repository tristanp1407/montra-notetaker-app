import { ChevronLeft, ScrollText, User } from "lucide-react";
import Link from "next/link";
import TitleEditorWrapper from "@components/project-editor/project-editor-wrapper";
import ProjectEditorClient from "./ProjectEditorClient";
import TitleEditor from "@components/project-editor/title-editor";

export default async function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="h-screen w-full flex flex-col">
      <div className="flex items-center justify-between border-b px-5 py-3 rounded-t">
        <Link
          href="/projects"
          className="text-sm font-medium hover:underline border rounded-sm flex items-center gap-1 py-1 pl-2 pr-3"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Link>

        <div className="flex-1 flex justify-center items-center gap-2">
          <ScrollText className="w-4 h-4" />
          <TitleEditor projectId={params.id} />
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

      <ProjectEditorClient projectId={params.id} />
    </div>
  );
}
