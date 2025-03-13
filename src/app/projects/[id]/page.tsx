import { notFound } from "next/navigation";
import { createClient } from "@utils/supabase/server";
import TipTapRenderer from "@components/rich-text/renderer";

export default async function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const { data: project, error } = await supabase
    .from("projects")
    .select("id, title, content, updated_at")
    .eq("id", params.id)
    .single();

  if (error) {
    console.error("[ProjectDetailPage] DB error:", error);
    return notFound();
  }

  if (!project) {
    console.warn(`[ProjectDetailPage] Project not found for id=${params.id}`);
    return notFound();
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{project.title}</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Last updated: {new Date(project.updated_at).toLocaleString()}
      </p>
      <TipTapRenderer content={project.content} />
    </div>
  );
}
