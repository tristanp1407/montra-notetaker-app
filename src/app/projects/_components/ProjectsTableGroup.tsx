import { Project } from "@customTypes/project";

import ProjectsTableRow from "./ProjectsTableRow";

interface Props {
  label: string;
  projects: Project[];
  onDelete: (id: string) => void;
}

export default function ProjectsTableGroup({
  label,
  projects,
  onDelete,
}: Props) {
  return (
    <>
      <tr>
        <td
          colSpan={4}
          className="px-4 py-1.5 text-sm text-gray-600 bg-gray-50 border-y border-gray-100"
        >
          {label}
        </td>
      </tr>
      {projects.map((project) => (
        <ProjectsTableRow
          key={project.id}
          project={project}
          onDelete={onDelete}
        />
      ))}
    </>
  );
}
