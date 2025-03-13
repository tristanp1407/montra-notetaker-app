"use client";

import { useState, useCallback, useEffect } from "react";
import debounce from "lodash.debounce";
import { updateProjectTitle } from "@actions/project/updateProjectTitle";

interface TitleEditorProps {
  projectId: string;
  initialTitle: string;
}

export default function TitleEditor({
  projectId,
  initialTitle,
}: TitleEditorProps) {
  const [title, setTitle] = useState(initialTitle);

  const debouncedSave = useCallback(
    debounce(async (newTitle: string) => {
      await updateProjectTitle(projectId, newTitle);
    }, 1000),
    [projectId]
  );

  useEffect(() => {
    debouncedSave(title);
    return () => debouncedSave.cancel();
  }, [title, debouncedSave]);

  return (
    <input
      type="text"
      name="title"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      placeholder="Project title"
      className="bg-transparent outline-none"
    />
  );
}
