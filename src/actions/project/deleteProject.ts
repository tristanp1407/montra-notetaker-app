"use server";

import { createClient } from "@utils/supabase/server";

export async function deleteProject(projectId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId);

  if (error) {
    console.error("[deleteProject] Failed to delete project:", error);
    return { error: error.message };
  }

  return { success: true };
}
