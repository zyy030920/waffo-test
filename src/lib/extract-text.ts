import mammoth from "mammoth";
import { extractText } from "unpdf";

const MAX_BYTES = 15 * 1024 * 1024;

export async function extractUploadedText(file: File) {
  if (file.size > MAX_BYTES) {
    throw new Error("文件过大");
  }
  const name = file.name.toLowerCase();
  const bytes = new Uint8Array(await file.arrayBuffer());

  if (name.endsWith(".txt") || file.type === "text/plain") {
    return new TextDecoder().decode(bytes).trim();
  }

  if (name.endsWith(".docx") || file.type.includes("wordprocessingml")) {
    const result = await mammoth.extractRawText({ buffer: Buffer.from(bytes) });
    return result.value.trim();
  }

  if (name.endsWith(".pdf") || file.type === "application/pdf") {
    const { text } = await extractText(bytes, { mergePages: true });
    return String(text).trim();
  }

  throw new Error("仅支持 Word、PDF、TXT");
}
