export const SOURCE_ACCEPT =
  ".txt,.docx,.pdf,text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export async function readSourceFile(file: File) {
  const name = file.name.toLowerCase();
  if (name.endsWith(".txt") || file.type === "text/plain") {
    const text = (await file.text()).trim();
    if (!text) throw new Error("EMPTY");
    return text;
  }

  const form = new FormData();
  form.append("file", file);
  const response = await fetch("/api/source/extract", { method: "POST", body: form });
  const payload = (await response.json()) as { text?: string; error?: string };
  if (!response.ok || !payload.text?.trim()) {
    throw new Error(payload.error || "EMPTY");
  }
  return payload.text;
}
