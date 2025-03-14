"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { createProject } from "@actions/project/createProject";
import { Button } from "@components/ui/button";

export function NewProjectButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleCreate = () => {
    startTransition(async () => {
      const result = await createProject();

      if (result?.id) {
        router.push(`/projects/${result.id}`);
      } else {
        // TODO: show toast or inline error
        console.error("Failed to create project");
      }
    });
  };

  return (
    <Button
      size="sm"
      onClick={handleCreate}
      disabled={isPending}
      className="cursor-pointer"
    >
      {isPending ? "Creating..." : "+ New Project"}
    </Button>
  );
}
