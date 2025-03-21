import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@utils/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { draftId, path, type, originalName } = body;

    if (!draftId || !path || !type || !originalName) {
      return NextResponse.json(
        { error: "Missing fields in request body" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { error } = await supabase.from("draft_files").insert({
      draft_id: draftId,
      storage_path: path,
      type,
      original_name: originalName,
      status: "pending",
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Server error", detail: (err as Error)?.message },
      { status: 500 }
    );
  }
}
