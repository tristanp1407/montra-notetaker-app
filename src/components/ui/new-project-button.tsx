"use client";

import { useRouter } from "next/navigation";

import { Button } from "@components/ui/button";

export function NewProjectButton() {
  const router = useRouter();

  const handleCreate = () => {
    const id = crypto.randomUUID(); // Requires client
    router.push(`/projects/${id}`);
  };

  return (
    <Button size="sm" onClick={handleCreate}>
      + New Project
    </Button>
  );
}
