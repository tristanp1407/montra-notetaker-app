export interface PanelProps {
  isLoading: boolean;
  transcript: string | null;
  handleTranscription: (file: File) => Promise<void>;
  fileUrl?: string | null;
}
