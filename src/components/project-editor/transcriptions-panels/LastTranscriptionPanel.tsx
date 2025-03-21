import { useRef } from "react";

import WaveformViewer from "@components/audio/waveform-viewer";
import TranscriptBox from "@components/project-editor/transcript-box";
import { PanelProps } from "@customTypes/panelProps";
import { Button } from "@components/ui/button";

const audioPlayer = (url: string, ref: any) => (
  <>
    <WaveformViewer audioUrl={url} ref={ref} />
    <Button className="w-full" onClick={() => ref.current.playPause()}>
      Play
    </Button>
  </>
);

export default function LastTranscriptionPanel({
  transcript,
  fileUrl,
}: PanelProps) {
  const waveformRef = useRef<{ playPause: () => void }>(null);
  if (!transcript) return null;
  return (
    <div className="flex flex-col gap-5">
      {fileUrl && audioPlayer(fileUrl, waveformRef)}
      <TranscriptBox transcript={transcript} />
    </div>
  );
}
