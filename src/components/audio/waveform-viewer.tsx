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
        waveColor: "rgb(200, 0, 200)",
        progressColor: "rgb(100, 0, 100)",
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

    return <div className="w-full h-full" ref={containerRef} />;
  }
);

WaveformViewer.displayName = "WaveformViewer";

export default WaveformViewer;
