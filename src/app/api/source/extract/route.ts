import { NextResponse } from "next/server";

import { extractUploadedText } from "@/lib/extract-text";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "请先选择文件" }, { status: 400 });
    }
    const text = await extractUploadedText(file);
    if (!text) {
      return NextResponse.json({ error: "文件是空的" }, { status: 400 });
    }
    return NextResponse.json({ text });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "无法读取文件" },
      { status: 400 },
    );
  }
}
