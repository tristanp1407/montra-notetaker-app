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
      "You are tasked with modifying an existing draft to maintain its formatting and structure while incorporating new elements. Your goal is to create an updated version that preserves the original style and tone.",
      "",
      "Follow these instructions very carefully and precisely:",
      "",
      "1. Review the following inputs:",
      "",
      "A. Read and understand the existing draft:",
      "<existing_draft>",
      JSON.stringify(existingDraft, null, 2),
      "</existing_draft>",
      "",
      "B. Review the user's input, which will be a transcribed voice memo.",
      "<user_input>",
      transcript,
      "</user_input>",
      "",
      "C. Refer to the following dictionary of words for automatic correction:",
      "<dictionary>",
      dictionary,
      "</dictionary>",
      "",
      "D. Here is a list of available TipTap JSON Nodes and Marks that can be used:",
      "<tiptap_library>",
      "Nodes:",
      "- doc (root document)",
      "- paragraph (for paragraphs and sections)",
      "- heading (levels 1–3)",
      "- bulletList, orderedList, listItem",
      "- blockquote",
      "- text (inline content)",
      "",
      "Marks:",
      "- bold (to emphasize text)",
      "- italic (to lay emphasis)",
      "- strike",
      "</tiptap_library>",
      "",
      "2. Analyze both the existing draft and the new user input. Identify the key components, structure, and formatting of the existing draft. Note any specific instructions, nodes, or marks used.",
      "",
      "3. Incorporate the new information from the user input into the existing draft. Ensure that you maintain the overall structure, tone, and formatting of the existing draft. Add or modify content only where necessary, preserving the existing draft as much as possible.",
      "",
      "4. Pay special attention to any TipTap nodes and marks used in the existing draft. Replicate these in your updated version, ensuring consistency throughout the document. In case you need to modify the format, then refer to the tiptap_library above for a list of available nodes and marks and their uses.",
      "",
      "5. If the user input suggests any new sections or elements that don't fit within the existing structure, carefully consider how to integrate them while maintaining the original format. If necessary, create new sections that mirror the style of the existing ones.",
      "",
      "6. Preserve any instructions about output formatting, such as using specific nodes or marks for responses or following particular structures for answers.",
      "",
      "7. Maintain any existing variables (those in curly braces with dollar signs) from the original draft. Only add new variables if absolutely necessary and clearly indicated by the user input.",
      "",
      "8. If the original draft includes examples or specific formatting instructions, ensure these are kept intact unless explicitly modified by the user input.",
      "",
      "9. Present your final updated draft as your complete response. Include all elements from the original draft, modified as necessary to incorporate the user input, while maintaining the overall structure and formatting.",
      "",
      "10. Highlight any changes or new text that you have added to the existing draft using the TipTap 'highlight' mark.",
      "",
      "11. VERY IMPORTANT: Your output MUST be a valid TipTap JSON document.",
      "",
      "Your response must strictly follow this format:",
      '{ "type": "doc", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Your updated text here." }] }] }',
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
