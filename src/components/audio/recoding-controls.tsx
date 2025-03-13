"use client";

interface RecordingControlsProps {
  isRecording: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

export default function RecordingControls({
  isRecording,
  isPaused,
  onStart,
  onPause,
  onResume,
  onStop,
}: RecordingControlsProps) {
  return (
    <div className="flex justify-center gap-4">
      {!isRecording && (
        <button
          onClick={onStart}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          ⏺ Record
        </button>
      )}
      {isRecording && !isPaused && (
        <>
          <button
            onClick={onPause}
            className="px-4 py-2 bg-yellow-500 text-white rounded"
          >
            ⏸ Pause
          </button>
          <button
            onClick={onStop}
            className="px-4 py-2 bg-gray-700 text-white rounded"
          >
            ⏹ Stop
          </button>
        </>
      )}
      {isRecording && isPaused && (
        <>
          <button
            onClick={onResume}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            ▶ Resume
          </button>
          <button
            onClick={onStop}
            className="px-4 py-2 bg-gray-700 text-white rounded"
          >
            ⏹ Stop
          </button>
        </>
      )}
    </div>
  );
}
