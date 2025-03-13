import { createClient } from "@utils/supabase/server";
import { Header } from "@components/layout/Header";
import { Sidebar } from "@components/layout/Sidebar";
import ProjectsTable from "./_components/ProjectsTable";

export default async function ProjectsPage() {
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("updated_at", { ascending: false });

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 overflow-auto ">
          {projects && <ProjectsTable initialProjects={projects} />}
        </main>
      </div>
    </div>
  );
}
