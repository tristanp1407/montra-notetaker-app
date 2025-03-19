"use client";

import { Project } from "@customTypes/project";
import { NewProjectButton } from "@components/ui/new-project-button";
import Filter from "@icons/Filter";

import useProjectsTable from "./useProjectsTable";
import ProjectsTableHeader from "./ProjectsTableHeader";
import ProjectsTableGroup from "./ProjectsTableGroup";
import ProjectRowSkeleton from "./ProjectRowSkeleton";

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
        <button
          onClick={() =>
            toggleSort(
              sortColumn === "created_at" ? "updated_at" : "created_at"
            )
          }
          className="flex items-center gap-2 bg-gray-50 text-gray-500 text-[14px] px-2 py-0.5 rounded-[6px] border border-gray-100 cursor-pointer"
        >
          <Filter className="w-[16px] h-[16px]" />
          <span>
            Sorted by{" "}
            <strong className="text-gray-800 font-normal">
              {sortLabels[sortColumn]}
            </strong>
          </span>
        </button>
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
