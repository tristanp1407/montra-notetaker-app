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

    // Build a prompt that instructs Claude to output a complete TipTap JSON document.
    const promptLines = [
      "You are tasked with reformatting and rewriting user-provided content. Your goal is to create clear, effective, and well-structured output that preserves the ideas, message, and tone of the user's input.",
      "",
      "Follow these instructions exactly:",
      "",
      "A. Here is the user's input (a transcribed voice memo):",
      "    <user_input>",
      "    {{USER_INPUT}}",
      "    </user_input>",
      "",
      "B. Here is a list of allowed HTML tags:",
      "    <html_library>",
      "    - <p> (paragraph)",
      "    - <h1>, <h2>, <h3> (headings)",
      "    - <ul>, <ol> (lists)",
      "    - <strong> (bold)",
      "    - <em> (emphasis)",
      "    </html_library>",
      "",
      "C. Rewrite and reformat the content as needed to improve clarity and flow while preserving the tone.",
      "",
      "D. IMPORTANT: Output your response as a valid JSON object representing a TipTap document.",
      "   For example, a valid TipTap document is:",
      '     { "type": "doc", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Your text here." }] }] }',
      "",
      "Now, please process the following transcript:",
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
