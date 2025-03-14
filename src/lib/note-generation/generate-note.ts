export async function generateNote(
  input: string,
  onPartialJson: (doc: any) => void,
  onFinalJson?: (doc: any) => void
) {
  try {
    const res = await fetch("/api/generate-note", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript: input }),
    });
    if (!res.ok) return;
    const tiptapDoc = await res.json();
    // Call both callbacks with the complete document.
    onPartialJson(tiptapDoc);
    onFinalJson?.(tiptapDoc);
  } catch (err) {
    console.error("generateNote failed:", err);
  }
}
