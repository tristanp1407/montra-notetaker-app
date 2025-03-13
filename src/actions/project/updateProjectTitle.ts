"use server";

import { createClient } from "@utils/supabase/server";

export async function updateProjectTitle(projectId: string, newTitle: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("projects")
    .update({ title: newTitle })
    .eq("id", projectId);

  if (error) {
    console.error("[updateProjectTitle] DB error:", error);
    return { error: error.message };
  }
  return { success: true };
}
