"use client";
import ChevronsUpDown from "@icons/ChevronsUpDown";

interface Props {
  sortColumn: "created_at" | "updated_at";
  sortDesc: boolean;
  toggleSort: (column: "created_at" | "updated_at") => void;
}

export default function ProjectsTableHeader({
  sortColumn,
  sortDesc,
  toggleSort,
}: Props) {
  const isCreatedActive = sortColumn === "created_at";
  const isUpdatedActive = sortColumn === "updated_at";

  return (
    <thead>
      <tr className="border-y border-gray-200 text-muted-foreground text-[10px] uppercase">
        <th className="px-4 py-2 text-left font-normal w-[40%]">
          Project Name
        </th>

        <th className="px-4 py-2 text-right font-normal w-[20%]">
          <button
            onClick={() => toggleSort("created_at")}
            className={`flex items-center gap-1 ml-auto cursor-pointer uppercase ${
              isCreatedActive ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            Creation Date
            <ChevronsUpDown className="w-3 h-3" />
          </button>
        </th>

        <th className="px-4 py-2 text-right font-normal w-[20%]">
          <button
            onClick={() => toggleSort("updated_at")}
            className={`flex items-center gap-1 ml-auto cursor-pointer uppercase ${
              isUpdatedActive ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            Last Edited
            <ChevronsUpDown className="w-3 h-3" />
          </button>
        </th>

        <th className="px-4 py-2 text-right font-normal w-[20%]" />
      </tr>
    </thead>
  );
}
