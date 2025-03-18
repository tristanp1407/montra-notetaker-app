"use client";

import { useEffect, useState } from "react";

import { getProjectsClient } from "@lib/data/projectsClient";
import { deleteProject } from "@actions/project/deleteProject";
import { groupProjectsByDate } from "@utils/groupProjectByDate";
import { Project } from "@customTypes/project";

export default function useProjectsTable(initialProjects: Project[]) {
  const [projects, setProjects] = useState(initialProjects);
  const [loading, setLoading] = useState(true);
  const [sortColumn, setSortColumn] = useState<"created_at" | "updated_at">(
    "updated_at"
  );
  const [sortDesc, setSortDesc] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const latest = await getProjectsClient();
        if (latest) setProjects(latest);
      } catch (err) {
        console.error("[ProjectsTable] Failed to fetch", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const toggleSort = (column: typeof sortColumn) => {
    setSortColumn(column);
    setSortDesc((prev) => (sortColumn === column ? !prev : true));
  };

  const handleDelete = async (id: string) => {
    await deleteProject(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const sorted = [...projects].sort((a, b) => {
    const aTime = new Date(a[sortColumn]).getTime();
    const bTime = new Date(b[sortColumn]).getTime();
    return sortDesc ? bTime - aTime : aTime - bTime;
  });

  const { groups, groupOrder } = groupProjectsByDate(sorted);

  return {
    groups,
    groupOrder,
    sortColumn,
    sortDesc,
    toggleSort,
    handleDelete,
    loading,
  };
}
