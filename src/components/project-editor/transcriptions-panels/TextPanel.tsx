import { PanelProps } from "@customTypes/panelProps";

export default function TextPanel({ isLoading }: PanelProps) {
  return (
    <div className="text-sm text-muted-foreground">
      ✍️ Text Panel (coming soon) {isLoading && "(Loading...)"}
    </div>
  );
}
