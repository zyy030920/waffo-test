import { AgentWorkshop } from "@/components/agent-workshop";
import { readGlossary } from "@/lib/glossary-store";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const [{ q }, terms] = await Promise.all([searchParams, readGlossary()]);
  return <AgentWorkshop initialText={q ?? ""} initialTerms={terms} />;
}
