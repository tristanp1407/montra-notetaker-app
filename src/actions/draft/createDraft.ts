"use server";

import { createClient } from "@utils/supabase/server";

export async function createDraft(projectId: string) {
  console.log("[createDraft] Creating draft for project:", projectId);
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("drafts")
      .insert({
        project_id: projectId,
        content: "<h1></h1>",
        file_url: null,
        file_type: null,
        transcript: null,
      })
      .select("id")
      .single();

    if (error || !data) {
      console.error("[createDraft] Insert error:", error);
      return {
        error: "Failed to create draft",
        detail: error?.message,
        status: 500,
      };
    }

    return {
      data,
      status: 200,
    };
  } catch (err) {
    console.error("[createDraft] Unhandled exception:", err);
    return {
      error: "Unexpected server error",
      detail: err instanceof Error ? err.message : String(err),
      status: 500,
    };
  }
}
