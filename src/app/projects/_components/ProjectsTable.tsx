"use client";

import { useState } from "react";
import Link from "next/link";
import { format, isToday, isYesterday } from "date-fns";
import {
  CalendarArrowDown,
  CalendarArrowUp,
  ChevronsUpDown,
  ScrollText,
  MoreHorizontal,
  Trash2,
} from "lucide-react";

import { NewProjectButton } from "@components/ui/new-project-button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";

export interface Project {
  id: string;
  user_id: string;
  title: string;
  content: any;
  created_at: string;
  updated_at: string;
}

interface ProjectsTableProps {
  initialProjects: Project[];
}

export default function ProjectsTable({ initialProjects }: ProjectsTableProps) {
  const [sortColumn, setSortColumn] = useState<"created_at" | "updated_at">(
    "updated_at"
  );
  const [sortDesc, setSortDesc] = useState(true);

  const toggleSort = (column: typeof sortColumn) => {
    setSortColumn(column);
    setSortDesc((prev) => (sortColumn === column ? !prev : true));
  };

  const sortedProjects = [...initialProjects].sort((a, b) => {
    const aTime = new Date(a[sortColumn]).getTime();
    const bTime = new Date(b[sortColumn]).getTime();
    return sortDesc ? bTime - aTime : aTime - bTime;
  });

  const groups = sortedProjects.reduce<Record<string, Project[]>>(
    (acc, project) => {
      const date = new Date(project.updated_at);
      const label = isToday(date)
        ? "Today"
        : isYesterday(date)
        ? "Yesterday"
        : format(date, "MMMM d, yyyy");
      acc[label] = acc[label] || [];
      acc[label].push(project);
      return acc;
    },
    {}
  );

  const groupOrder = Object.keys(groups);

  const sortLabels = {
    created_at: "Created Date",
    updated_at: "Latest Edited",
  };

  const SortHeader = ({
    column,
    label,
  }: {
    column: typeof sortColumn;
    label: string;
  }) => {
    const isActive = sortColumn === column;
    return (
      <button
        onClick={() => toggleSort(column)}
        className={`flex items-center gap-1 text-sm ${
          isActive ? "text-foreground" : "text-muted-foreground"
        } font-normal`}
      >
        {label}
        <ChevronsUpDown className="w-3 h-3" />
      </button>
    );
  };

  return (
    <div>
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

      <table className="min-w-full border-collapse">
        <thead>
          <tr className="border-y border-gray-200 text-sm text-muted-foreground">
            <th className="px-3 py-2 text-left font-normal">Project Name</th>
            <th className="px-3 py-2 text-right font-normal">
              <SortHeader column="created_at" label="Created At" />
            </th>
            <th className="px-3 py-2 text-right font-normal">
              <SortHeader column="updated_at" label="Updated At" />
            </th>
            <th className="px-3 py-2 text-right font-normal">Actions</th>
          </tr>
        </thead>
        <tbody>
          {groupOrder.map((label) => (
            <>
              <tr key={`group-${label}`}>
                <td
                  colSpan={4}
                  className="bg-muted px-3 py-2 text-sm font-medium text-gray-700 border-y border-gray-200"
                >
                  {label}
                </td>
              </tr>
              {groups[label].map((project) => (
                <tr
                  key={project.id}
                  className="hover:bg-muted/50 border-b border-gray-100"
                >
                  <td className="px-3 py-3">
                    <Link
                      href={`/projects/${project.id}`}
                      className="flex items-center gap-2"
                    >
                      <div className="w-8 h-8 rounded-md border border-gray-200 flex items-center justify-center">
                        <ScrollText className="w-4 h-4 text-muted-foreground" />
                      </div>
                      {project.title}
                    </Link>
                  </td>
                  <td className="px-3 py-2 text-right text-muted-foreground">
                    {format(new Date(project.created_at), "MMM d, yyyy")}
                  </td>
                  <td className="px-3 py-2 text-right text-muted-foreground">
                    {format(new Date(project.updated_at), "MMM d, yyyy")}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="p-1 rounded hover:bg-muted">
                          <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent align="end" className="w-32 p-0">
                        <button
                          onClick={() => window.alert("Delete project")}
                          className="w-full px-3 py-2 flex items-center gap-2 hover:bg-muted text-sm text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </PopoverContent>
                    </Popover>
                  </td>
                </tr>
              ))}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
