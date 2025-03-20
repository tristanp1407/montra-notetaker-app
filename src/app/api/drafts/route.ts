import { NextRequest } from "next/server";
import { getDraftById } from "@actions/draft/getDraftById";
import { updateDraft } from "@actions/draft/updateDraft";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const draftId = searchParams.get("id");

  if (!draftId) {
    return Response.json({ error: "Missing draftId" }, { status: 400 });
  }

  const result = await getDraftById(draftId);

  if (result.error) {
    return Response.json(
      { error: result.error, detail: result.detail },
      { status: result.status || 500 }
    );
  }

  return Response.json({ data: result.data }, { status: 200 });
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const draftId = body?.id;
    const updates = body?.updates;

    if (!draftId || typeof updates !== "object") {
      return Response.json(
        { error: "Missing draft ID or updates object" },
        { status: 400 }
      );
    }

    const result = await updateDraft(draftId, updates);

    if (result.error) {
      return Response.json(
        { error: result.error, detail: result.detail },
        { status: result.status || 500 }
      );
    }

    return Response.json({ data: result.data }, { status: 200 });
  } catch (err) {
    console.error("[PATCH /api/drafts] Unexpected error:", err);
    return Response.json(
      { error: "Unexpected server error", detail: (err as Error).message },
      { status: 500 }
    );
  }
}
