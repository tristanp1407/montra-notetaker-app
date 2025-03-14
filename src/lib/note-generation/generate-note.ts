export async function streamGenerateNote(
  input: string,
  onJsonReady: (doc: any) => void
) {
  try {
    const res = await fetch("/api/generate-note", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript: input }),
    });

    if (!res.ok || !res.body) return;

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let rawJsonString = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        try {
          const parsed = JSON.parse(line);
          if (parsed.token) {
            rawJsonString += parsed.token;
          }
        } catch (err) {
          console.warn("Stream parse error:", err);
        }
      }
    }

    try {
      const fullJson = JSON.parse(rawJsonString);
      onJsonReady(fullJson);
    } catch (err) {
      console.error("Failed to parse full TipTap JSON:", rawJsonString, err);
    }
  } catch (err) {
    console.error("streamGenerateNote failed:", err);
  }
}
