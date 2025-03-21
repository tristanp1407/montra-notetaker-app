import AudioRecorder from "@components/audio/audio-recorder";
import { PanelProps } from "@customTypes/panelProps";

export default function VoicePanel({
  isLoading,
  handleTranscription,
  selectedDraftId,
}: PanelProps) {
  return (
    <AudioRecorder
      isLoading={isLoading}
      handleTranscription={handleTranscription}
      selectedDraftId={selectedDraftId}
    />
  );
}
