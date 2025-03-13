"use client";

import { signOut } from "@actions/signout";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut()}
      className="text-muted-foreground hover:underline"
    >
      Sign out
    </button>
  );
}
