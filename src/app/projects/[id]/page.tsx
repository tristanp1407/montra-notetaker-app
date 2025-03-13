import { notFound } from "next/navigation";
import Link from "next/link";

import { getProjectById } from "@lib/data/projects";
import TitleEditorWrapper from "@components/project-editor/project-editor-wrapper";

import ProjectEditorClient from "./ProjectEditorClient";

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
      <div className="flex items-center justify-between border-b px-4 py-2 rounded-t">
        <Link href="/projects" className="text-sm font-medium hover:underline">
          ← Back
        </Link>

        <div className="flex-1 flex justify-center">
          <TitleEditorWrapper
            projectId={project.id}
            initialTitle={project.title}
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-semibold text-muted-foreground">
            C
          </div>
          <button className="text-sm px-3 py-1 border rounded hover:bg-muted transition">
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
