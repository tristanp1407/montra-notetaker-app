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

    // Combine original instructions with your Tiptap JSON requirement.
    // We'll store them in a single prompt string but STILL instruct for JSON.

    const promptLines = [
      "You are tasked with reformatting and rewriting user-provided content. Your goal is to create a clear, effective, and well-structured output that retains the ideas, message, and style of the user's input.",
      "",
      "Follow these instructions very carefully and precisely:",
      "", // The user input portion:
      "A. Here is the user's input which will be a transcribed voice memo:",
      "    <user_input>",
      `    {{USER_INPUT}}`,
      "    </user_input>",
      "", // The HTML library portion
      "B. Here is a list of available HTML Tags that can be used:",
      "", // We'll keep it as is, but note we still want Tiptap JSON
      "    <html_library>",
      "    - <p> (Used for paragraphs and sections)",
      "    - <h1>, <h2>, <h3> (Used for headings)",
      "    - <ul>, <ol> (<ul> for bullet list, <ol> for ordered list)",
      "    - <strong> (Used to make text appear as bold)",
      "    - <em> (Used to lay emphasis)",
      "    </html_library>",
      "",
      "2. Rewrite and reformat the content as necessary, keeping the following guidelines in mind:",
      "   a. Refer to the html_library above for available HTML tags.",
      "   b. If the content is best presented as plain text, format accordingly.",
      "   c. Condense or expand sections as needed to improve clarity and flow.",
      "   d. Do not begin the content with an <h1> heading.",
      "",
      "3. Maintain the user's original tone.",
      "",
      // Now we instruct to produce Tiptap JSON, not HTML code
      "However, you must output Tiptap-compatible JSON only.",
      "Output only valid JSON. Do not wrap your response in triple backticks or code fences.",
      "Do not add extraneous formatting. Return a single valid JSON object in your response with the shape of a TipTap doc.",
      "Below is an example Tiptap doc, but adapt it as needed:",
      // Provide Tiptap doc sample
      `{
        \"type\": \"doc\",
        \"content\": [
          {
            \"type\": \"heading\",
            \"attrs\": { \"level\": 1 },
            \"content\": [{ \"type\": \"text\", \"text\": \"Example Heading\" }]
          },
          {
            \"type\": \"paragraph\",
            \"content\": [{ \"type\": \"text\", \"text\": \"Example paragraph text.\" }]
          }
        ]
      }`,
      "",
      "Do not include triple backticks. Only valid JSON.",
      "",
      "Here is the user transcript to incorporate:",
      transcript,
    ];

    const prompt = promptLines.join("\n");
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const response = await fetch(
            "https://api.anthropic.com/v1/messages",
            {
              method: "POST",
              headers: {
                "x-api-key": process.env.ANTHROPIC_API_KEY || "",
                "content-type": "application/json",
                "anthropic-version": "2023-06-01",
              },
              body: JSON.stringify({
                model: "claude-3-7-sonnet-20250219",
                stream: true,
                max_tokens: 4096,
                temperature: 0.7,
                messages: [{ role: "user", content: prompt }],
              }),
            }
          );

          if (!response.ok || !response.body) {
            console.error(
              "[/api/generate-note] Failed to connect to Claude API.",
              {
                status: response.status,
                statusText: response.statusText,
              }
            );

            controller.enqueue(
              encoder.encode(
                JSON.stringify({
                  token: "Error: Failed to connect to Claude API.",
                }) + "\n"
              )
            );
            controller.close();
            return;
          }

          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let buffer = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              const trimmed = line.trim();
              if (trimmed.startsWith("data: ")) {
                const data = trimmed.replace("data: ", "");
                if (data === "[DONE]") {
                  controller.close();
                  return;
                }

                try {
                  const json = JSON.parse(data);
                  const token = json.delta?.text;
                  if (token) {
                    // Stream out each chunk as { "token": "...some JSON partial..." }
                    const payload = JSON.stringify({ token }) + "\n";
                    controller.enqueue(encoder.encode(payload));
                  }
                } catch (err) {
                  console.error(
                    "[/api/generate-note] Stream parse error:",
                    err
                  );
                }
              }
            }
          }

          controller.close();
        } catch (err) {
          console.error("[/api/generate-note] Internal stream error:", err);
          controller.enqueue(
            encoder.encode(
              JSON.stringify({ token: "Error: Stream processing failure." }) +
                "\n"
            )
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("[/api/generate-note] Top-level handler error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
