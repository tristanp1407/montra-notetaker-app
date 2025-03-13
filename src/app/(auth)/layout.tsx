import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@utils/supabase/server";

interface AuthLayoutProps {
  children: ReactNode;
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/projects");
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      {children}
    </div>
  );
}
