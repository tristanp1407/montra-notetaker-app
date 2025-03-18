"use server";

import { createClient } from "@utils/supabase/server";

export async function updateProjectContent(
  projectId: string,
  contentHtml: any
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("projects")
    .update({ content: contentHtml })
    .eq("id", projectId);

  if (error) {
    console.error("[updateProjectContent] DB error:", error);
    return { error: error.message };
  }

  return { success: true };
}
