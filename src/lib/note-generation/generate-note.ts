export async function generateNote(
  input: string,
  onPartialHtml: (chunk: string) => void,
  onFinalHtml?: (fullHtml: string) => void
) {
  try {
    const res = await fetch("/api/generate-note", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript: input }),
    });

    if (!res.ok || !res.body) return;

    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let fullContent = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      fullContent += chunk;
      onPartialHtml(chunk);
    }

    onFinalHtml?.(fullContent);
  } catch (err) {
    console.error("generateNote failed:", err);
  }
}
