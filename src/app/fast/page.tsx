import { TranslatorWorkspace } from "@/components/translator-workspace";

export default async function FastPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  return <TranslatorWorkspace initialText={q ?? ""} />;
}
