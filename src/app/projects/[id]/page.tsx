import { notFound } from "next/navigation";
import Link from "next/link";

import { getProjectById } from "@lib/data/projects";
import TitleEditorWrapper from "@components/project-editor/project-editor-wrapper";

import ProjectEditorClient from "./ProjectEditorClient";
import { ChevronLeft, ScrollText, User } from "lucide-react";

export default async function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: project, error } = await getProjectById(params.id);

  if (error || !project) {
    console.error("[ProjectDetailPage] Failed to fetch project", error);
    return notFound();
  }

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
          <TitleEditorWrapper
            projectId={project.id}
            initialTitle={project.title}
          />
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

      <ProjectEditorClient
        projectId={project.id}
        initialContent={project.content}
      />
    </div>
  );
}
