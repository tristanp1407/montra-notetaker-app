import { NextRequest } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { transcript, existingDraft, dictionary = "" } = await req.json();

    if (!transcript || !existingDraft) {
      console.error(
        "[/api/merge-draft] Missing transcript or existingDraft in request body."
      );
      return new Response(JSON.stringify({ error: "Missing input fields." }), {
        status: 400,
      });
    }

    const promptLines = [
      "You are tasked with updating and extending an existing draft document by incorporating new content from a user voice memo.",
      "",
      "⚠️ IMPORTANT: Do NOT simply append the new content to the end of the draft. Instead, analyze the structure and flow of the existing document, and merge the new content thoughtfully — inserting or integrating it where appropriate.",
      "",
      "The goal is to enhance and evolve the document, not to rewrite it entirely. Revise existing sections only when necessary for coherence or clarity. Preserve all existing structure, formatting, and tone.",
      "",
      "Your output must always be a TipTap JSON document that reflects the original draft, seamlessly integrated with the new content.",
      "",
      "Follow these instructions carefully:",
      "",
      "1. Review the following inputs:",
      "",
      "A. The existing draft document (this should remain mostly intact):",
      "<existing_draft>",
      JSON.stringify(existingDraft, null, 2),
      "</existing_draft>",
      "",
      "B. The user's new input (a transcribed voice memo to be added):",
      "<user_input>",
      transcript,
      "</user_input>",
      "",
      "C. A dictionary of terms for corrections (optional):",
      "<dictionary>",
      dictionary,
      "</dictionary>",
      "",
      "2. Analyze the existing draft’s content, formatting, and tone.",
      "3. Incorporate relevant parts of the user input where appropriate. Merge and blend new content naturally within the existing structure.",
      "4. Only revise existing text if it clearly improves clarity, structure, or flow.",
      "5. Add new sections, sentences, or enhancements in context — not just appended.",
      "6. Highlight any newly inserted or modified text using the <mark> HTML tag inside TipTap-compatible content.",
      "",
      "7. VERY IMPORTANT: Your output MUST be a valid TipTap JSON document.",
      "   Use only the following TipTap nodes and marks:",
      "     - doc (root document)",
      "     - paragraph, heading (levels 1–3)",
      "     - bulletList, orderedList, listItem",
      "     - text (inline content)",
      "     - blockquote",
      "",
      "   Marks:",
      "     - bold, italic, strike",
      "",
      "8. Your response must be a TipTap JSON object like this format:",
      '   { "type": "doc", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Your updated text here." }] }] }',
      "",
      "DO NOT return markdown, HTML, commentary, or explanations — only the valid TipTap JSON object.",
    ];
    const prompt = promptLines.join("\n");

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "content-type": "application/json",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-7-sonnet-20250219",
        stream: false,
        max_tokens: 4096,
        temperature: 0.7,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      console.error("[/api/merge-draft] Claude API error", {
        status: response.status,
        statusText: response.statusText,
        responseBody: await response.text(),
      });
      return new Response(JSON.stringify({ error: "Claude API failure" }), {
        status: response.status,
      });
    }

    const result = await response.json();

    // Try to extract the JSON string from Claude's result.
    let tiptapStr = "";
    if (
      result.message &&
      Array.isArray(result.message.content) &&
      result.message.content.length > 0 &&
      result.message.content[0].text
    ) {
      tiptapStr = result.message.content[0].text;
    } else if (
      result.content &&
      Array.isArray(result.content) &&
      result.content.length > 0 &&
      result.content[0].text
    ) {
      tiptapStr = result.content[0].text;
    } else if (result.text) {
      tiptapStr = result.text;
    } else {
      console.error("[/api/merge-draft] Invalid response structure:", result);
      return new Response(
        JSON.stringify({ error: "Invalid Claude response structure." }),
        { status: 500 }
      );
    }

    // Remove code block markers if present
    tiptapStr = tiptapStr.replace(/^```json\s*/i, "").replace(/\s*```$/i, "");

    const tiptapDoc = JSON.parse(tiptapStr);

    return new Response(JSON.stringify(tiptapDoc), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[/api/merge-draft] Top-level error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
