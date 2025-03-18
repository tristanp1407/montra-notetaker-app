"use client";

import { useState, useEffect, useCallback } from "react";
import debounce from "lodash.debounce";
import { updateProjectTitle } from "@actions/project/updateProjectTitle";
import { getProjectByIdClient } from "@lib/data/projectsClient";

interface TitleEditorProps {
  projectId: string;
  initialTitle?: string;
}

export default function TitleEditor({
  projectId,
  initialTitle = "",
}: TitleEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [loading, setLoading] = useState(!initialTitle);

  const debouncedSave = useCallback(
    debounce(
      (newTitle: string) => updateProjectTitle(projectId, newTitle),
      1000
    ),
    [projectId]
  );

  useEffect(() => {
    if (!initialTitle) {
      getProjectByIdClient(projectId)
        .then((p) => setTitle(p?.title || ""))
        .catch((err) => console.error("[TitleEditor] Failed to fetch", err))
        .finally(() => setLoading(false));
    }
  }, [projectId, initialTitle]);

  useEffect(() => {
    if (!loading) debouncedSave(title);
    return () => debouncedSave.cancel();
  }, [title, debouncedSave, loading]);

  if (loading) {
    return <div className="h-5 w-32 bg-muted animate-pulse rounded-sm" />;
  }

  return (
    <input
      type="text"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      placeholder="Project title"
      className="bg-transparent outline-none"
    />
  );
}
