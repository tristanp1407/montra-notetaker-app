export interface PanelProps {
  isLoading: boolean;
  transcript: string | null;
  onGenerate: (audio: Blob) => void;
}
