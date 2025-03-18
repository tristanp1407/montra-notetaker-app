"use client";

import { Project } from "@customTypes/project";
import useProjectsTable from "./useProjectsTable";
import ProjectsTableHeader from "./ProjectsTableHeader";
import ProjectsTableGroup from "./ProjectsTableGroup";
import ProjectRowSkeleton from "./ProjectRowSkeleton";
import { NewProjectButton } from "@components/ui/new-project-button";
import { CalendarArrowDown, CalendarArrowUp } from "lucide-react";

interface ProjectsTableProps {
  initialProjects: Project[];
}

export default function ProjectsTable({ initialProjects }: ProjectsTableProps) {
  const {
    groups,
    groupOrder,
    sortColumn,
    sortDesc,
    toggleSort,
    handleDelete,
    loading,
  } = useProjectsTable(initialProjects);

  const sortLabels = {
    created_at: "Created Date",
    updated_at: "Latest Edited",
  };

  return (
    <div>
      {/* Toolbar above the table */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2 bg-gray-50 text-gray-700 text-xs px-3 py-1 rounded-sm border border-gray-200">
          {sortDesc ? (
            <CalendarArrowDown className="w-3.5 h-3.5" />
          ) : (
            <CalendarArrowUp className="w-3.5 h-3.5" />
          )}
          <span>
            Sorted by:{" "}
            <strong className="font-semibold">{sortLabels[sortColumn]}</strong>
          </span>
        </div>
        <NewProjectButton />
      </div>

      <table className="min-w-full border-collapse table-fixed">
        <ProjectsTableHeader
          sortColumn={sortColumn}
          sortDesc={sortDesc}
          toggleSort={toggleSort}
        />

        <tbody>
          {loading ? (
            <ProjectRowSkeleton count={3} />
          ) : (
            groupOrder.map((label: string) => (
              <ProjectsTableGroup
                key={label}
                label={label}
                projects={groups[label]}
                onDelete={handleDelete}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
