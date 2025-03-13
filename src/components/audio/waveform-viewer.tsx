"use client";

import React, { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";

interface WaveformViewerProps {
  audioUrl: string;
}

export default function WaveformViewer({ audioUrl }: WaveformViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    // Destroy any previous instance
    if (wavesurferRef.current) wavesurferRef.current.destroy();

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: "rgb(200, 0, 200)",
      progressColor: "rgb(100, 0, 100)",
      barWidth: 4,
      barGap: 1,
      barRadius: 2,
      height: 80,
      width: 250,
    });
    wavesurferRef.current = ws;
    ws.load(audioUrl);

    return () => {
      ws.destroy();
    };
  }, [audioUrl]);

  return (
    <div
      ref={containerRef}
      className="w-full h-20 bg-gray-100 border rounded overflow-hidden"
      style={{ minHeight: "80px" }}
    />
  );
}
