import { createClient } from "@utils/supabase/server";

export async function getProjectById(projectId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("id, title, content, updated_at")
    .eq("id", projectId)
    .single();

  return { data, error };
}
