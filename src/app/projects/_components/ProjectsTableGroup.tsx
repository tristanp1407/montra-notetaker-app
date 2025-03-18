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
          className="bg-muted px-3 py-2 text-sm font-medium text-gray-700 border-y"
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
