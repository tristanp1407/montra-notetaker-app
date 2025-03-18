"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/projects");
    }
  };

  return (
    <button
      onClick={handleBack}
      className="text-sm font-medium hover:underline border rounded-sm flex items-center gap-1 py-1 pl-2 pr-3 cursor-pointer"
    >
      <ChevronLeft className="w-4 h-4" />
      Back
    </button>
  );
}
