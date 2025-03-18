import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

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

    const prompt = `
        You are tasked with modifying an existing draft to maintain its formatting and structure while incorporating new elements. Your goal is to create an updated version that preserves the original style and tone.

        Follow these instructions very carefully and precisely:

        1. Review the following inputs:

        A. Read and understand the existing draft:

            <existing_draft>
            ${existingDraft}
            </existing_draft>

        B. Review the user's input:

            <user_input>
            ${transcript}
            </user_input>

        C. Refer to the following dictionary of words for automatic correction:

            <dictionary>
            ${dictionary}
            </dictionary>
            
        D. Here is a list of available HTML Tags that can be used:
            
            <html_library>
            - <p> (Used for paragraphs and sections)
            - <h1>, <h2>, <h3> (Used for headings)
            - <ul>, <ol> (<ul> for bullet list, <ol> for ordered list)
            - <strong> (Used to make text appear as bold)
            - <em> (Used to lay emphasis)
            </html_library>

        2. Analyze both the existing draft and the new user input. Identify the key components, structure, and formatting of the existing draft. Note any specific instructions, tags, or formatting elements used.

        3. Incorporate the new information from the user input into the existing draft. Ensure that you maintain the overall structure, tone, and formatting of the existing draft. Add or modify content only where necessary, preserving the existing draft as much as possible.

        4. Pay special attention to any HTML tags used in the existing draft. Replicate these in your updated version, ensuring consistency throughout the document. In case you need to modify the format, then refer to the html_library above for a list of available tags and their uses.

        5. If the user input suggests any new sections or elements that don't fit within the existing structure, carefully consider how to integrate them while maintaining the original format. If necessary, create new sections that mirror the style of the existing ones.

        6. Preserve any instructions about output formatting, such as using specific tags for responses or following particular structures for answers.

        7. Maintain any existing variables (those in curly braces with dollar signs) from the original draft. Only add new variables if absolutely necessary and clearly indicated by the user input.

        8. If the original draft includes examples or specific formatting instructions, ensure these are kept intact unless explicitly modified by the user input.

        9. Present your final updated draft as your complete response. Include all elements from the original draft, modified as necessary to incorporate the user input, while maintaining the overall structure and formatting.

        10. Highlight any changes or new text that you have added to the existing draft with the <mark> HTML tag. 

        11. DO NOT include any explanation, commentary, or introductory phrases. Provide only the requested content.

        Remember, your primary goal is to integrate the new information while preserving the structure, tone, and formatting of the existing draft. Make only necessary changes and additions, ensuring the updated version remains true to the original template.
    `.trim();

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const stream = await anthropic.messages.stream({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 4096,
      temperature: 0.7,
      system:
        "Respond only with the updated draft in HTML format, following the instructions exactly.",
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
  } catch (error) {
    console.error("[/api/merge-draft] Top-level error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
