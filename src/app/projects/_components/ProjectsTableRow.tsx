import { format } from "date-fns";
import Link from "next/link";
import { Trash2 } from "lucide-react";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@components/ui/popover";
import { Project } from "@customTypes/project";
import BlankPage from "@icons/BlankPage";
import DotGrid from "@icons/DotGrid";

interface Props {
  project: Project;
  onDelete: (id: string) => void;
  showActions?: boolean;
}

export default function ProjectsTableRow({
  project,
  onDelete,
  showActions = true,
}: Props) {
  return (
    <tr className="h-16 text-sm">
      <td colSpan={4} className="p-0 border-b border-gray-100">
        <div className="m-[5px] h-[54px] flex items-center justify-between rounded-xl hover:bg-gray-100 transition-colors px-3 cursor-pointer">
          <Link
            href={`/projects/${project.id}`}
            className="flex items-center gap-2 w-[40%] h-full"
          >
            <div className="w-8 h-8 rounded-md border bg-white border-gray-100 flex items-center justify-center">
              <BlankPage className="w-[16px] h-[16px] text-gray-500" />
            </div>
            {project.title}
          </Link>

          <div className="text-right w-[20%] text-muted-foreground font-light pr-5">
            {format(new Date(project.created_at), "MMM d, yyyy")}
          </div>

          <div className="text-right w-[20%] text-muted-foreground font-light">
            {format(new Date(project.updated_at), "MMM d, yyyy")}
          </div>

          <div className="text-right w-[20%] flex justify-end items-center">
            {showActions ? (
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="p-1 rounded mr-2 cursor-pointer hover:bg-gray-200"
                  >
                    <DotGrid className="w-4 h-4" />
                  </button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-32 p-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(project.id);
                    }}
                    className="w-full px-3 py-2 flex items-center gap-2 hover:bg-muted text-sm text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </PopoverContent>
              </Popover>
            ) : (
              <div className="w-6 h-4" />
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}
