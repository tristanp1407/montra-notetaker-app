"use client";

import { FormEvent, useTransition } from "react";
import { useRouter } from "next/navigation";
import { SignInForm } from "@components/blocks/SignInForm";
import { signin } from "../actions";

export default function SignInPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await signin(formData);
      if (result.error) {
        // toast.error(result.error);
      } else {
        // toast.success("Signed in successfully");
        router.push("/account");
      }
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignInForm onSubmit={handleSubmit} isPending={isPending} />
    </div>
  );
}
