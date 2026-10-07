import { NextResponse } from "next/server";

import { importTerms } from "@/lib/glossary-store";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      terms?: { term?: string; translation?: string; domain?: string; note?: string }[];
    };
    if (!Array.isArray(body.terms) || !body.terms.length) {
      return NextResponse.json({ error: "没有可导入的术语" }, { status: 400 });
    }
    const result = await importTerms(body.terms);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "导入失败" },
      { status: 400 },
    );
  }
}
