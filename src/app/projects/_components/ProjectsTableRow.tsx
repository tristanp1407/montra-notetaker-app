import { format } from "date-fns";
import Link from "next/link";
import { ScrollText, MoreHorizontal, Trash2 } from "lucide-react";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@components/ui/popover";
import { Project } from "@customTypes/project";

interface Props {
  project: Project;
  onDelete: (id: string) => void;
  showActions?: boolean; // Optional, in case you want to control it
}

export default function ProjectsTableRow({
  project,
  onDelete,
  showActions = true,
}: Props) {
  return (
    <tr className="hover:bg-muted/50 border-b">
      <td className="px-3 py-3 w-[40%]">
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

      <td className="px-3 py-2 text-right w-[20%] text-muted-foreground">
        {format(new Date(project.created_at), "MMM d, yyyy")}
      </td>

      <td className="px-3 py-2 text-right w-[20%] text-muted-foreground">
        {format(new Date(project.updated_at), "MMM d, yyyy")}
      </td>

      <td className="px-3 py-2 text-right w-[20%]">
        {showActions ? (
          <Popover>
            <PopoverTrigger asChild>
              <button className="p-1 rounded hover:bg-muted mr-6 cursor-pointer">
                <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-32 p-0">
              <button
                onClick={() => onDelete(project.id)}
                className="w-full px-3 py-2 flex items-center gap-2 hover:bg-muted text-sm text-destructive"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </PopoverContent>
          </Popover>
        ) : (
          <div className="w-6 h-4" /> // Empty placeholder keeps layout fixed
        )}
      </td>
    </tr>
  );
}
