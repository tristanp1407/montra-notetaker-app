"use client";

import React, { useCallback, useRef, useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import WaveformViewer from "./waveform-viewer";

interface AudioRecorderProps {
  onGenerate: (audioBlob: Blob) => void;
}

export default function AudioRecorder({ onGenerate }: AudioRecorderProps) {
  const [reset, setReset] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const waveformRef = useRef<{ playPause: () => void }>(null);

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

  const handleGenerate = () => {
    if (mediaBlobUrl) {
      fetch(mediaBlobUrl)
        .then((res) => res.blob())
        .then((blob) => onGenerate(blob));
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
        ) : (
          <div className="w-full h-full" />
        )}

        {status === "recording" && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse" />
              <span className="text-red-500 font-semibold text-xl">
                Recording
              </span>
            </div>
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
            className="absolute top-1 right-1 px-2 py-1 text-xs border rounded bg-white hover:bg-gray-100 z-10"
          >
            Restart
          </button>
        )}
      </div>

      {status === "recording" && (
        <div className="flex gap-2">
          <button
            onClick={pauseRecording}
            className="flex-1 px-4 py-2 bg-primary text-white rounded"
          >
            Pause
          </button>
          <button
            onClick={stopRecording}
            className="flex-1 px-4 py-2 bg-secondary text-foreground rounded"
          >
            Stop
          </button>
        </div>
      )}

      {status === "paused" && (
        <div className="flex gap-2">
          <button
            onClick={resumeRecording}
            className="flex-1 px-4 py-2 bg-primary text-white rounded"
          >
            Resume
          </button>
          <button
            onClick={stopRecording}
            className="flex-1 px-4 py-2 bg-secondary text-foreground rounded"
          >
            Stop
          </button>
        </div>
      )}

      {status === "idle" && !mediaBlobUrl && (
        <button
          onClick={startRecording}
          className="w-full px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 text-sm"
        >
          Record
        </button>
      )}

      {mediaBlobUrl && status === "stopped" && (
        <div className="flex flex-col gap-2">
          <button
            onClick={handlePlayPause}
            className="w-full px-4 py-2 bg-primary text-white rounded"
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button
            onClick={handleGenerate}
            className="w-full px-4 py-2 bg-secondary text-foreground rounded"
          >
            Generate
          </button>
        </div>
      )}
    </div>
  );
}
