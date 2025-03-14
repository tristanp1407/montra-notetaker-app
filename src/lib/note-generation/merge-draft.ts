// lib/note-generation/merge-draft.ts
export async function mergeDraft(
  input: string,
  existingDraft: any,
  onPartialJson: (doc: any) => void,
  onFinalJson?: (doc: any) => void,
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
    if (!res.ok) return;
    const tiptapDoc = await res.json();

    console.log("mergeDraft result:", tiptapDoc);

    onPartialJson(tiptapDoc);
    onFinalJson?.(tiptapDoc);
  } catch (err) {
    console.error("mergeDraft failed:", err);
  }
}
