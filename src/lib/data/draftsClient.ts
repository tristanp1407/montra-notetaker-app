import { Draft } from "@customTypes/drafts";

export const getDraftByIdClient = async (draftId: string) => {
  try {
    const res = await fetch(`/api/drafts?id=${draftId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (res.status === 404) return null; // Draft not found

    if (!res.ok) {
      console.error(`Failed to fetch draft: ${res.statusText}`);
      throw new Error("Failed to fetch draft");
    }

    const json = await res.json();

    if (json.error) {
      console.error(`Error from server: ${json.error}`);
      throw new Error(json.error);
    }

    return json.data;
  } catch (error) {
    console.error(`Error in getDraftByIdClient: ${(error as Error).message}`);
    throw error;
  }
};

export const createDraftClient = async (
  projectId: string,
  data: Partial<Draft>
) => {
  try {
    const res = await fetch(`/api/drafts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, data }),
    });

    if (!res.ok) {
      console.error(`Failed to create draft: ${res.statusText}`);
      throw new Error("Failed to create draft");
    }

    const json = await res.json();

    if (json.error) {
      console.error(`Error from server: ${json.error}`);
      throw new Error(json.error);
    }

    return json.data;
  } catch (error) {
    console.error(`Error in createDraftClient: ${(error as Error).message}`);
    throw error;
  }
};
