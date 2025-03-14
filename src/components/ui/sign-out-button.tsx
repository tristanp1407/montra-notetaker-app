"use client";

import { signOut } from "@actions/signout";
import { MessageSquare } from "lucide-react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut()}
      className="flex items-center gap-2 text-muted-foreground hover:underline"
    >
      <MessageSquare className="w-4 h-4" />
      Sign out
    </button>
  );
}
