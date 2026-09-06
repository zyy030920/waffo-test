import { NextResponse } from "next/server";

import { createTerm, readGlossary } from "@/lib/glossary-store";

export async function GET() {
  const terms = await readGlossary();
  return NextResponse.json({ terms });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      term?: string;
      translation?: string;
      domain?: string;
      note?: string;
    };
    const term = await createTerm({
      term: body.term ?? "",
      translation: body.translation ?? "",
      domain: body.domain ?? "通用",
      note: body.note,
    });
    return NextResponse.json({ term }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "无法保存术语" },
      { status: 400 },
    );
  }
}
