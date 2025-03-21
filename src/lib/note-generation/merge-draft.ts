export async function mergeDraft(
  // todo: Remove unused props
  input: string,
  existingDraft: any,
  onPartialHtml: (doc: any) => void,
  onFinalHtml?: (doc: any) => void,
  dictionary: string = ""
) {
  try {
    const res = await fetch("/api/merge-draft", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        transcript: input,
        existingDraft,
        dictionary,
      }),
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

    // Since the response is HTML, we do not attempt to parse it as JSON.
    onFinalHtml?.(fullContent);
  } catch (err) {
    console.error("mergeDraft failed:", err);
  }
}
