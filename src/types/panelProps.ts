export interface PanelProps {
  isLoading: boolean;
  transcript: string | null;
  handleTranscription: (newTranscript: string) => void;
  selectedDraftId: string | null;
}
