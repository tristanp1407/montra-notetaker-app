import { NextResponse } from "next/server";
import { createClient } from "@deepgram/sdk";

export async function POST(req: Request) {
  const formData = await req.formData();
  const audioBlob = formData.get("audio") as Blob;
  const buffer = Buffer.from(await audioBlob.arrayBuffer());

  const deepgram = createClient(process.env.DEEPGRAM_API_KEY!);
  const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
    buffer,
    {
      model: "nova-3",
      smart_format: true,
    }
  );

  if (error) return NextResponse.json({ error }, { status: 500 });

  const transcript =
    result?.results?.channels?.[0]?.alternatives?.[0]?.transcript || "";

  return NextResponse.json({ transcript });
}
