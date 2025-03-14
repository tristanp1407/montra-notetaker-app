"use client";

import { FormEvent, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { SignUpForm } from "@components/blocks/SignUpForm";
import { signup } from "../actions";

export default function SignUpPage() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await signup(formData);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Account created successfully!");
        router.push("/account");
      }
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignUpForm onSubmit={handleSubmit} isPending={isPending} />
    </div>
  );
}
