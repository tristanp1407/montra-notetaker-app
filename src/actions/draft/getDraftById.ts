"use server";

import { createClient } from "@utils/supabase/server";

export async function getDraftById(draftId: string) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("drafts")
      .select("*")
      .eq("id", draftId)
      .single();

    if (error || !data) {
      console.error("[getDraftById] Supabase error:", error);
      return {
        error: error?.message || "Draft not found",
        status: 404,
      };
    }

    return { data, status: 200 };
  } catch (err) {
    console.error("[getDraftById] Unexpected server error:", err);
    return {
      error: "Unexpected server error",
      detail: err instanceof Error ? err.message : String(err),
      status: 500,
    };
  }
}
