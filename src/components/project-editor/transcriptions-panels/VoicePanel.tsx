import AudioRecorder from "@components/audio/audio-recorder";
import { PanelProps } from "@customTypes/panelProps";

export default function VoicePanel({ isLoading, onGenerate }: PanelProps) {
  return <AudioRecorder isLoading={isLoading} onGenerate={onGenerate} />;
}
