"use client";

import { useState, useEffect, useCallback } from "react";
import debounce from "lodash.debounce";

import { updateProjectTitle } from "@actions/project/updateProjectTitle";
import { getProjectByIdClient } from "@lib/data/projectsClient";

interface TitleEditorProps {
  projectId: string;
}

export default function TitleEditor({ projectId }: TitleEditorProps) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);

  const saveTitle = useCallback(
    debounce((value: string) => updateProjectTitle(projectId, value), 500),
    [title]
  );

  useEffect(() => {
    getProjectByIdClient(projectId)
      .then((p) => {
        setTitle(p?.data.title || "Untitled Project");
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [projectId]);

  useEffect(() => {
    if (!loading) saveTitle(title);
    return () => saveTitle.cancel();
  }, [title, saveTitle, loading]);

  return loading ? (
    <div className="h-5 w-25 bg-muted animate-pulse rounded-sm" />
  ) : (
    <input
      type="text"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      className="bg-transparent outline-none"
      onFocus={(e) => e.target.select()}
    />
  );
}
