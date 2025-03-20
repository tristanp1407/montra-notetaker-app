"use server";

import { createClient } from "@utils/supabase/server";

export async function updateDraft(
  draftId: string,
  updates: Partial<{
    content: string;
    file_url: string;
    file_type: string;
    transcript: string;
  }>
) {
  const supabase = await createClient();

  try {
    if (Object.keys(updates).length === 0) {
      return { error: "No fields provided to update", status: 400 };
    }

    const { data, error } = await supabase
      .from("drafts")
      .update(updates)
      .eq("id", draftId)
      .select()
      .single();

    if (error || !data) {
      console.error("[updateDraft] Supabase error:", error);
      return {
        error: error?.message || "Failed to update draft",
        status: 500,
      };
    }

    return { data, status: 200 };
  } catch (err) {
    console.error("[updateDraft] Unexpected error:", err);
    return {
      error: "Unexpected server error",
      detail: err instanceof Error ? err.message : String(err),
      status: 500,
    };
  }
}
