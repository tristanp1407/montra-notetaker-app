import { ChevronsUpDown } from "lucide-react";

interface Props {
  column: "created_at" | "updated_at";
  label: string;
  active: boolean;
  alignment?: "left" | "right";
  onClick: () => void;
}

export default function SortHeader({
  column,
  label,
  active,
  alignment = "left",
  onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-1 text-sm font-normal ${
        active ? "text-foreground" : "text-muted-foreground"
      } ${alignment === "right" ? "justify-end" : ""}`}
    >
      {label}
      <ChevronsUpDown className="w-3 h-3" />
    </button>
  );
}
