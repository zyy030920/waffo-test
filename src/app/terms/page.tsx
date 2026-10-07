"use client";

import { LegalArticle } from "@/components/legal-article";
import { useLocale } from "@/lib/locale";

export default function TermsPage() {
  const { t } = useLocale();
  return <LegalArticle title={t.termsTitle} lead={t.termsLead} body={t.termsBody} />;
}
