export async function transcribeAudio(audioBlob: Blob): Promise<string | null> {
  try {
    const formData = new FormData();
    formData.append("audio", audioBlob);

    const response = await fetch("/api/transcribe", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (data?.transcript) {
      return data.transcript;
    }

    return null;
  } catch (err) {
    console.error("[transcribeAudio] Transcription failed:", err);
    return null;
  }
}
