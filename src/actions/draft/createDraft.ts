"use server";

import { Draft } from "@customTypes/drafts";
import { createClient } from "@utils/supabase/server";

export async function createDraft(
  projectId: string,
  draftId: string | undefined,
  draftData: Partial<Draft>
) {
  console.log("🚀🚀 [createDraft.ts] draftId", draftId);
  console.log("[createDraft] Creating draft for project:", projectId);
  const supabase = await createClient();

  // Build the payload
  const payload = {
    id: draftId,
    project_id: projectId,
    content: draftData?.content || "<h1></h1>",
    file_url: draftData?.file_url || undefined,
    file_type: draftData?.file_type || undefined,
    transcript: draftData?.transcript || undefined,
  };

  if (draftId) {
    console.log(`[createDraft] Provided draftId: ${draftId}`);
    payload.id = draftId;
  } else {
    console.log("[createDraft] No draftId provided; generating a new one");
  }

  try {
    const { data, error } = await supabase
      .from("drafts")
      .insert(payload)
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

    console.log("[createDraft] Draft created with id:", data.id);
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
