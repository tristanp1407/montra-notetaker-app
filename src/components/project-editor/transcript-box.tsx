"use client";

import { Layers2 } from "lucide-react";
import React, { useState } from "react";

interface TranscriptBoxProps {
  transcript: string;
}

export default function TranscriptBox({ transcript }: TranscriptBoxProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="mt-4">
      <h4 className="font-semibold text-sm mb-1">Transcript</h4>
      <div className="border rounded p-2 text-sm bg-muted text-muted-foreground max-h-[200px] min-h-[100px] overflow-y-auto whitespace-pre-line">
        {transcript}
      </div>
      <button
        onClick={handleCopy}
        className="mt-2 w-full px-3 py-2 text-sm bg-secondary text-foreground rounded hover:bg-secondary/90 flex items-center justify-center"
      >
        <Layers2 className="w-4 h-4 mr-2" />
        {copied ? "Copied!" : "Copy text"}
      </button>
    </div>
  );
}
