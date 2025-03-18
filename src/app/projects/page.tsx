export const dynamic = "force-dynamic";

import { createClient } from "@utils/supabase/server";
import { Header } from "@components/layout/Header";
import { Sidebar } from "@components/layout/Sidebar";
import ProjectsTable from "./_components/ProjectsTable";
import { redirect } from "next/navigation";

export default async function ProjectsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/sign-in");

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 overflow-auto">
          <ProjectsTable initialProjects={[]} />
        </main>
      </div>
    </div>
  );
}
