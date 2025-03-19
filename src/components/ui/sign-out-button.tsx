"use client";

import { signOut } from "@actions/signout";
import BubbleSpark from "@icons/BubbleSpark";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut()}
      className="flex w-full items-center gap-2 text-gray-600 text-sm rounded-[6px] hover:bg-gray-100 transition-colors px-2 py-1 cursor-pointer"
    >
      <BubbleSpark className="w-4 h-4 text-gray-600" />
      Sign Out
    </button>
  );
}
