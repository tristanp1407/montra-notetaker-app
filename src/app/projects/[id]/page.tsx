import { notFound } from "next/navigation";
import Link from "next/link";
import { getProjectById } from "@lib/data/projects";
import Editor from "@components/rich-text/editor";
import TitleEditorWrapper from "@components/project-editor/project-editor-wrapper";

export default async function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: project, error } = await getProjectById(params.id);

  if (error) {
    console.error("[ProjectDetailPage] DB error:", error);
    return notFound();
  }

  if (!project) {
    console.warn(`[ProjectDetailPage] Project not found for id=${params.id}`);
    return notFound();
  }

  return (
    <div className="h-screen w-full flex flex-col">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between border-b px-4 py-2 rounded-t">
        <Link href="/projects" className="text-sm font-medium hover:underline">
          ← Back
        </Link>
        {/* Editable title field */}
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

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto p-6">
          <Editor projectId={project.id} content={project.content} />
        </div>

        {/* Right Panel Section */}
        <div className="flex flex-col w-72 border-l border-muted bg-background">
          <div className="flex items-center justify-between border-b px-4 py-2 text-sm font-medium">
            <span>New Draft</span>
            <button className="text-muted-foreground hover:text-foreground">
              ✕
            </button>
          </div>
          <div className="p-4 text-sm text-muted-foreground">
            Click to start recording a voice memo
          </div>
          <div className="p-4 border-t mt-auto">
            <button className="w-full text-sm bg-primary text-white rounded px-3 py-2 hover:bg-primary/90">
              ⏺ Record Memo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
