"use client";

import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import WaveSurfer from "wavesurfer.js";

export type WaveformViewerHandle = {
  playPause: () => void;
};

const WaveformViewer = forwardRef<WaveformViewerHandle, { audioUrl: string }>(
  ({ audioUrl }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const waveSurferRef = useRef<WaveSurfer | null>(null);

    useEffect(() => {
      if (!containerRef.current || !audioUrl) return;

      waveSurferRef.current = WaveSurfer.create({
        container: containerRef.current,
        waveColor: "rgb(32, 96, 253)",
        progressColor: "rgb(16, 39, 95)",
        barWidth: 2,
        barGap: 1,
        barRadius: 2,
        height: 80,
        url: audioUrl,
      });

      return () => {
        waveSurferRef.current?.destroy();
      };
    }, [audioUrl]);

    useImperativeHandle(ref, () => ({
      playPause: () => {
        waveSurferRef.current?.playPause();
      },
    }));

    return (
      <div
        className="w-full h-full bg-gray-100 rounded overflow-hidden border"
        ref={containerRef}
      />
    );
  }
);

WaveformViewer.displayName = "WaveformViewer";

export default WaveformViewer;
