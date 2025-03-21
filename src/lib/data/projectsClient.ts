"use client";

export const createProjectClient = async (projectId: string) => {
  try {
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId }),
    });

    if (!res.ok) {
      console.error(`Failed to create project: ${res.statusText}`);
      throw new Error("Failed to create project");
    }

    const json = await res.json();
    if (json.error) {
      console.error(`Error from server: ${json.error}`);
      throw new Error(json.error);
    }

    return json;
  } catch (error) {
    console.error(`Error in createProjectClient: ${(error as Error).message}`);
    throw error;
  }
};

export const getProjectByIdClient = async (id: string) => {
  try {
    const res = await fetch(`/api/projects?id=${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (res.status === 404) return null; // Not found

    if (!res.ok) {
      console.error(`Failed to fetch project: ${res.statusText}`);
      throw new Error("Failed to fetch project");
    }

    const json = await res.json();

    if (json.error) {
      console.error(`Error from server: ${json.error}`);
      throw new Error(json.error);
    }

    return json;
  } catch (error) {
    console.error(`Error in getProjectByIdClient: ${(error as Error).message}`);
    throw error;
  }
};

export const getProjectsClient = async () => {
  try {
    const res = await fetch("/api/projects/all", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      console.error(`Failed to fetch projects: ${res.statusText}`);
      throw new Error("Failed to fetch projects");
    }

    const json = await res.json();

    if (json.error) {
      console.error(`Error from server: ${json.error}`);
      throw new Error(json.error);
    }

    return json.data;
  } catch (error) {
    console.error(`Error in getProjectsClient: ${(error as Error).message}`);
    throw error;
  }
};
