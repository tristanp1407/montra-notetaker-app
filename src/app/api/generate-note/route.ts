import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { transcript, dictionary = "" } = await req.json();

    if (!transcript) {
      return new Response(JSON.stringify({ error: "Missing transcript." }), {
        status: 400,
      });
    }

    const prompt = `
        You are tasked with reformatting and rewriting user-provided content. Your goal is to create a clear, effective, and well-structured output that retains the ideas, message and style of the user's input.

        Follow these instructions very carefully and precisely:

        A. Here is the user's input. This could be transcribed voice memos, text files, or other forms of written content.
            
            <user_input>
            ${transcript}
            </user_input>
            
        B. Additionally, refer to the following dictionary of words for automatic correction:
            
            <dictionary>
            ${dictionary}
            </dictionary>
            
        C. Here is a list of available HTML Tags that can be used:
            
            <html_library>
            - <p> (Used for paragraphs and sections)
            - <h1>, <h2>, <h3> (Used for headings)
            - <ul>, <ol> (<ul> for bullet list, <ol> for ordered list)
            - <strong> (Used to make text appear as bold)
            - <em> (Used to lay emphasis)
            </html_library>

        2. Rewrite and reformat the content as necessary, keeping the following guidelines in mind:
          a. Refer to the html_library above for available HTML tags and their uses, the format should be determined by the content itself.
          b. If the content is best presented as plain text, format it accordingly.
          c. Condense or expand sections as needed to improve clarity and flow.
          d. Do not begin the content with an <h1> heading.

        3. While reformatting, ensure that you maintain the user's original tone. The goal is to enhance the presentation of the content, not to alter its voice or message.

        4. Use your judgment to determine the most effective structure for the content. This may involve:
          a. Creating logical sections with appropriate headings
          b. Breaking long paragraphs into more digestible chunks
          c. Using emphasis to highlight key points

        5. If the content includes any technical terms, jargon, or complex ideas, consider adding brief explanations or definitions where necessary to improve understanding.

        6. After reformatting, review the entire document to ensure consistency in structure and style.

        7. Do not include any explanation, commentary, or introductory phrases in your response. Provide only the requested content.

        Remember, the key is adaptability. Let the content guide your formatting decisions, always aiming for maximum clarity and effectiveness while preserving the essence of the user's original input.
`.trim();

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const stream = await anthropic.messages.stream({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 4096,
      temperature: 0.7,
      system: "Respond only with valid HTML content.",
      messages: [{ role: "user", content: [{ type: "text", text: prompt }] }],
    });

    const responseStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const msg of stream) {
            if (
              msg.type === "content_block_delta" &&
              msg.delta.type === "text_delta"
            ) {
              const chunk = msg.delta.text;
              controller.enqueue(new TextEncoder().encode(chunk));
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(responseStream, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (err) {
    console.error("[/api/generate-note] Error:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
