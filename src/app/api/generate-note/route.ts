import { NextRequest } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { transcript } = await req.json();
    if (!transcript) {
      console.error("[/api/generate-note] Missing transcript in request body.");
      return new Response(JSON.stringify({ error: "Missing transcript." }), {
        status: 400,
      });
    }

    const promptLines = [
      "You are tasked with reformatting and rewriting user-provided content. Your goal is to create a clear, effective, and well-structured output that retains the ideas, message, and style of the user's input.",
      "",
      "Follow these instructions very carefully and precisely:",
      "",
      "A. Here is the user's input (a transcribed voice memo):",
      "<user_input>",
      transcript,
      "</user_input>",
      "",
      "B. Here is a list of available TipTap JSON Nodes and Marks that can be used:",
      "<tiptap_library>",
      "Nodes:",
      "- doc (root document)",
      "- paragraph (for paragraphs and sections)",
      "- heading (levels 1–3)",
      "- bulletList, orderedList, listItem",
      "- blockquote",
      "- text (inline text)",
      "",
      "Marks:",
      "- bold (for strong emphasis)",
      "- italic (for emphasis)",
      "- strike",
      "</tiptap_library>",
      "",
      "B. Rewrite and reformat the content as needed to improve clarity and flow while preserving the tone and style of the original input.",
      "",
      "C. Output your response strictly as a valid TipTap JSON object.",
      "",
      "Example output format:",
      '{ "type": "doc", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Your reformatted text here." }] }] }',
      "",
      "Do NOT return markdown, HTML, explanations, or commentary — only the TipTap JSON object.",
      "",
      "Now, please process the above transcript:",
      transcript,
    ];

    const prompt = promptLines.join("\n");

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "content-type": "application/json",
        "anthropic-version": "2023-06-01",
      },
      // Call Claude in one go.
      body: JSON.stringify({
        model: "claude-3-7-sonnet-20250219",
        stream: false,
        max_tokens: 4096,
        temperature: 0.7,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      console.error("[/api/generate-note] Failed to connect to Claude API.", {
        status: response.status,
        statusText: response.statusText,
      });
      return new Response(
        JSON.stringify({ error: "Failed to connect to Claude API." }),
        { status: response.status }
      );
    }

    const result = await response.json();

    // Try to extract the JSON string from Claude's result.
    let tiptapStr = "";
    // Check if result.message exists; if not, check for a top-level content field.
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
      console.error("[/api/generate-note] Invalid response structure:", result);
      return new Response(
        JSON.stringify({ error: "Invalid response structure." }),
        { status: 500 }
      );
    }

    // Remove code block markers (```json ... ```)
    tiptapStr = tiptapStr.replace(/^```json\s*/i, "").replace(/\s*```$/i, "");

    // Parse the TipTap JSON document.
    const tiptapDoc = JSON.parse(tiptapStr);

    return new Response(JSON.stringify(tiptapDoc), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[/api/generate-note] Top-level error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
