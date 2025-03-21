export interface PanelProps {
  isLoading: boolean;
  transcript: string | null;
  handleTranscription: (file: File) => void;
  fileUrl?: string | null;
}
