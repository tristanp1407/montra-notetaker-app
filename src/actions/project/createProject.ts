"use server";

import { createClient } from "@utils/supabase/server";

export async function createProject(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    console.error("[createProject] User auth error:", userError);
    return { error: "Unauthenticated" };
  }

  const { data, error } = await supabase
    .from("projects")
    .insert({
      id,
      title: "Untitled Project",
      content: "<h1></h1>",
      user_id: user.id,
    })
    .select()
    .single();

  if (error || !data) {
    console.error("[createProject] Insert error:", error);
    return { error: error?.message || "Insert failed" };
  }

  return { data };
}
