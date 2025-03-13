"use server";

import { createClient } from "@utils/supabase/server";

export async function createProject() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .insert([{ title: "Untitled Project" }])
    .select("id")
    .single();

  if (error) {
    console.error("[createProject] Failed to create project:", error);
    return { error: error.message };
  }

  return { id: data?.id };
}
