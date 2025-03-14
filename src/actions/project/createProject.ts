"use server";

import { createClient } from "@utils/supabase/server";

export async function createProject() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("[createProject] Authentication error:", userError);
    return { error: "User not authenticated." };
  }

  const emptyDoc = {
    type: "doc",
    content: [
      {
        type: "paragraph",
      },
    ],
  };

  const { data, error } = await supabase
    .from("projects")
    .insert([
      {
        title: "Untitled Project",
        content: emptyDoc,
        user_id: user.id,
      },
    ])
    .select("id")
    .single();

  if (error) {
    console.error("[createProject] Failed to create project:", error);
    return { error: error.message };
  }

  return { id: data?.id };
}
