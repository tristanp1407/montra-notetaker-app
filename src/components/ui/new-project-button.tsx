"use client";

import { useRouter } from "next/navigation";

import { Button } from "@components/ui/button";
import Plus from "@icons/Plus";

export function NewProjectButton() {
  const router = useRouter();

  const handleCreate = () => {
    const id = crypto.randomUUID(); // Requires client
    router.push(`/projects/${id}`);
  };

  return (
    <Button size="sm" onClick={handleCreate}>
      <Plus />
      New Project
    </Button>
  );
}
