import { PanelProps } from "@customTypes/panelProps";

export default function FileUploadPanel({ isLoading }: PanelProps) {
  return (
    <div className="text-sm text-muted-foreground">
      📎 File Upload Panel (coming soon) {isLoading && "(Loading...)"}
    </div>
  );
}
