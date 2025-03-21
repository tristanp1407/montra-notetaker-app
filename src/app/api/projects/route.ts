import { NextResponse } from "next/server";
import { createProject } from "@actions/project/createProject";
import { getProjectById } from "@actions/project/getProjectById";

export async function POST(req: Request) {
  try {
    const { projectId } = await req.json();
    const result = await createProject(projectId);

    return NextResponse.json(result);
  } catch (err) {
    console.error("[API /projects] Failed:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing project ID" },
        { status: 400 }
      );
    }

    const result = await getProjectById(id);

    if (!result.data) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("[API /projects] GET Failed:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
