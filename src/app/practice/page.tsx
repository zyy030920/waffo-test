import { PracticeStudio } from "@/components/practice-studio";
import { readGlossary } from "@/lib/glossary-store";

export default async function PracticePage() {
  const terms = await readGlossary();
  return <PracticeStudio initialTerms={terms} />;
}
