"use client";

import React, { useState } from "react";
import Link from "next/link";
import { format, isToday, isYesterday } from "date-fns";
import { ArrowUp, ArrowDown } from "lucide-react";

import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { NewProjectButton } from "@components/ui/new-project-button";

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
    if (sortColumn === column) {
      setSortDesc((prev) => !prev);
    } else {
      setSortColumn(column);
      setSortDesc(true);
    }
  };

  const sortedProjects = [...initialProjects].sort((a, b) => {
    const valA = new Date(a[sortColumn]).getTime();
    const valB = new Date(b[sortColumn]).getTime();
    if (valA < valB) return sortDesc ? 1 : -1;
    if (valA > valB) return sortDesc ? -1 : 1;
    return 0;
  });

  const groups: Record<string, Project[]> = {};
  const groupOrder: string[] = [];
  sortedProjects.forEach((project) => {
    const date = new Date(project.updated_at);
    const label = isToday(date)
      ? "Today"
      : isYesterday(date)
      ? "Yesterday"
      : format(date, "MMMM d, yyyy");

    if (!groups[label]) {
      groups[label] = [];
      groupOrder.push(label);
    }
    groups[label].push(project);
  });

  const sortLabels = {
    created_at: "Created Date",
    updated_at: "Latest Edited",
  };

  return (
    <div>
      <div className="flex justify-between items-center p-4 pl-2">
        <Badge variant="outline" className="text-xs">
          Sorted by: {sortLabels[sortColumn]}
        </Badge>
        <NewProjectButton />
      </div>

      <table className="min-w-full border-collapse">
        <thead>
          <tr className="border-y border-gray-200 text-sm text-muted-foreground">
            <th className="p-2 text-left font-normal">Project Name</th>
            <th className="p-2 text-left">
              <button
                onClick={() => toggleSort("created_at")}
                className="flex items-center gap-1 group"
              >
                <span
                  className={
                    sortColumn === "created_at"
                      ? "font-semibold text-foreground"
                      : ""
                  }
                >
                  Created At
                </span>
                {sortColumn === "created_at" ? (
                  sortDesc ? (
                    <ArrowDown className="h-4 w-4 text-foreground" />
                  ) : (
                    <ArrowUp className="h-4 w-4 text-foreground" />
                  )
                ) : (
                  <ArrowUp className="h-4 w-4 opacity-30 group-hover:opacity-60" />
                )}
              </button>
            </th>
            <th className="p-2 text-left">
              <button
                onClick={() => toggleSort("updated_at")}
                className="flex items-center gap-1 group"
              >
                <span
                  className={
                    sortColumn === "updated_at"
                      ? "font-semibold text-foreground"
                      : ""
                  }
                >
                  Updated At
                </span>
                {sortColumn === "updated_at" ? (
                  sortDesc ? (
                    <ArrowDown className="h-4 w-4 text-foreground" />
                  ) : (
                    <ArrowUp className="h-4 w-4 text-foreground" />
                  )
                ) : (
                  <ArrowUp className="h-4 w-4 opacity-30 group-hover:opacity-60" />
                )}
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {groupOrder.map((label) => (
            <React.Fragment key={label}>
              <tr>
                <td
                  colSpan={3}
                  className="bg-muted p-2 text-sm font-medium border-y border-gray-200"
                >
                  {label}
                </td>
              </tr>
              {groups[label].map((project) => (
                <tr
                  key={project.id}
                  className="hover:bg-muted/50 border-b border-gray-100"
                >
                  <td className="p-2">
                    <Link href={`/projects/${project.id}`}>
                      {project.title}
                    </Link>
                  </td>
                  <td className="p-2">
                    {format(new Date(project.created_at), "MMM d, yyyy")}
                  </td>
                  <td className="p-2">
                    {format(new Date(project.updated_at), "MMM d, yyyy")}
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
