"use client";

import React, { useCallback, useRef, useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import WaveformViewer from "./waveform-viewer";
import { Mic, Pause, Play, StopCircle, RotateCcw, Loader } from "lucide-react";
import WaveformLoader from "@components/project-editor/waveform-loader";

interface AudioRecorderProps {
  handleTranscription: (file: File) => Promise<void>;
}

export default function AudioRecorder({
  handleTranscription,
}: AudioRecorderProps) {
  const [reset, setReset] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const waveformRef = useRef<{ playPause: () => void }>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    status,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    mediaBlobUrl,
  } = useReactMediaRecorder({
    audio: true,
    blobPropertyBag: { type: "audio/webm" },
  });

  const handlePlayPause = () => {
    if (waveformRef.current) {
      waveformRef.current.playPause();
      setIsPlaying((prev) => !prev);
    }
  };

  const handleGenerate = async () => {
    if (!mediaBlobUrl) return;

    try {
      const res = await fetch(mediaBlobUrl);
      const blob = await res.blob();

      const file = new File([blob], "recording.webm", {
        type: blob.type || "audio/webm",
      });

      handleTranscription(file).then(() => {
        console.log("🚀🚀🚀🚀🚀");
        setIsLoading(false);
      });
    } catch (err) {
      console.error("❌ Error during audio generation flow:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestart = useCallback(() => {
    if (mediaBlobUrl) URL.revokeObjectURL(mediaBlobUrl);
    setReset(true);
    setIsPlaying(false);
    setTimeout(() => {
      setReset(false);
      startRecording();
    }, 0);
  }, [mediaBlobUrl, startRecording]);

  if (reset) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="relative w-[250px] h-20 bg-gray-100 border rounded overflow-hidden">
        {mediaBlobUrl ? (
          <WaveformViewer audioUrl={mediaBlobUrl} ref={waveformRef} />
        ) : status !== "recording" ? (
          <div className="flex items-center justify-center h-full w-full">
            <div className="w-full border-t-2 border-dotted border-blue-500" />
          </div>
        ) : null}

        {status === "recording" && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <WaveformLoader />
          </div>
        )}

        {status === "paused" && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full" />
              <span className="text-yellow-500 font-semibold text-xl">
                Paused
              </span>
            </div>
          </div>
        )}

        {mediaBlobUrl && status !== "recording" && status !== "paused" && (
          <button
            onClick={handleRestart}
            className="absolute top-1 right-1 px-2 py-1 text-xs border rounded bg-white hover:bg-gray-100 z-10 flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Restart
          </button>
        )}
      </div>

      {status === "recording" && (
        <div className="flex gap-2">
          <button
            onClick={pauseRecording}
            className="flex-1 px-4 py-2 bg-primary text-white rounded flex items-center justify-center gap-2"
          >
            <Pause className="w-4 h-4" />
            Pause
          </button>
          <button
            onClick={stopRecording}
            className="flex-1 px-4 py-2 bg-secondary text-foreground rounded flex items-center justify-center gap-2"
          >
            <StopCircle className="w-4 h-4" />
            Stop
          </button>
        </div>
      )}

      {status === "paused" && (
        <div className="flex gap-2">
          <button
            onClick={resumeRecording}
            className="flex-1 px-4 py-2 bg-primary text-white rounded flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4" />
            Resume
          </button>
          <button
            onClick={stopRecording}
            className="flex-1 px-4 py-2 bg-secondary text-foreground rounded flex items-center justify-center gap-2"
          >
            <StopCircle className="w-4 h-4" />
            Stop
          </button>
        </div>
      )}

      {status === "idle" && !mediaBlobUrl && (
        <button
          onClick={startRecording}
          className="w-full px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 text-sm flex items-center justify-center gap-2"
        >
          <Mic className="h-4 w-4" />
          Start Recording
        </button>
      )}

      {mediaBlobUrl && status === "stopped" && (
        <div className="flex flex-col gap-2">
          <button
            onClick={handlePlayPause}
            className="w-full px-4 py-2 bg-primary text-white rounded flex items-center justify-center gap-2"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Play
              </>
            )}
          </button>
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-secondary text-foreground rounded flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
