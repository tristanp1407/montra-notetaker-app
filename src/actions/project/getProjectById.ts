import { createClient } from "@utils/supabase/server";

export async function getProjectById(projectId: string) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("projects")
      .select(
        `
        id,
        title,
        updated_at,
        drafts (
          id,
          created_at
        )
      `
      )
      .eq("id", projectId)
      .single();

    if (error || !data) {
      console.error("[getProjectById] Fetch error:", {
        projectId,
        error,
      });

      return {
        error: "Failed to fetch project",
        detail: error?.message,
        status: 404,
      };
    }

    // Ensure drafts are sorted by created_at ASC
    const draftIds = (data.drafts || [])
      .sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      )
      .map((draft: { id: string }) => draft.id);

    return {
      data: {
        id: data.id,
        title: data.title,
        updated_at: data.updated_at,
        draftIds,
      },
      status: 200,
    };
  } catch (err) {
    console.error("[getProjectById] Unhandled exception:", err);
    return {
      error: "Unexpected server error",
      detail: err instanceof Error ? err.message : String(err),
      status: 500,
    };
  }
}
