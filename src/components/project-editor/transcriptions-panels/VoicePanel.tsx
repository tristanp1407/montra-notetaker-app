import AudioRecorder from "@components/audio/audio-recorder";
import { PanelProps } from "@customTypes/panelProps";

export default function VoicePanel({
  isLoading,
  handleTranscription,
}: PanelProps) {
  return (
    <AudioRecorder
      isLoading={isLoading}
      handleTranscription={handleTranscription}
    />
  );
}
