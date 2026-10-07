"use client";

import { LegalArticle } from "@/components/legal-article";
import { useLocale } from "@/lib/locale";

export default function PrivacyPage() {
  const { t } = useLocale();
  return <LegalArticle title={t.privacyTitle} lead={t.privacyLead} body={t.privacyBody} />;
}
