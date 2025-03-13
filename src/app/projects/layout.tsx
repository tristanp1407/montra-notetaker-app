import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { createClient } from "@utils/supabase/server";

export default async function ProjectsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/sign-in");
  }

  return <>{children}</>;
}
