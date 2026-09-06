import { NextResponse } from "next/server";

import { deleteTerm, updateTerm } from "@/lib/glossary-store";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as {
      term?: string;
      translation?: string;
      domain?: string;
      note?: string;
    };
    const term = await updateTerm(id, body);
    return NextResponse.json({ term });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "无法更新术语" },
      { status: 400 },
    );
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    await deleteTerm(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "无法删除术语" },
      { status: 400 },
    );
  }
}
