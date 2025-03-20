import TranscriptBox from "@components/project-editor/transcript-box";
import { PanelProps } from "@customTypes/panelProps";

export default function LastTranscriptionPanel({ transcript }: PanelProps) {
  if (!transcript) return null;
  return <TranscriptBox transcript={transcript} />;
}
