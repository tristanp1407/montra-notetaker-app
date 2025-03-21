"use server";

import { createDraft } from "@actions/draft/createDraft";
import { createClient } from "@utils/supabase/server";

export async function createProject(projectId: string) {
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error(
        "[createProject] Auth error:",
        userError || "No user found"
      );
      return { error: "Unauthenticated", status: 401 };
    }

    // Step 1: Insert project using provided projectId
    const { data: projectData, error: projectError } = await supabase
      .from("projects")
      .insert({
        id: projectId,
        title: "Untitled Project",
        user_id: user.id,
      })
      .select("id, title, updated_at")
      .single();

    if (projectError || !projectData) {
      return {
        error: "Failed to create project",
        detail: projectError?.message,
        status: 500,
      };
    }

    // Step 2: Create initial draft using extracted function
    const draftRes = await createDraft(projectData.id, undefined, {});

    if (draftRes.error || !draftRes.data?.id) {
      return {
        error: draftRes.error || "Failed to create initial draft",
        detail: draftRes.detail,
        status: draftRes.status || 500,
      };
    }

    return {
      data: {
        id: projectData.id,
        title: projectData.title,
        updated_at: projectData.updated_at,
        draftIds: [draftRes.data.id],
      },
      status: 200,
    };
  } catch (err) {
    console.error("[createProject] Unhandled exception:", err);
    return {
      error: "Unexpected server error",
      detail: err instanceof Error ? err.message : String(err),
      status: 500,
    };
  }
}
