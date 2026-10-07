"use client";

import { Mail } from "lucide-react";
import { toast } from "sonner";

import { QuietLink } from "@/components/quiet-link";
import { useLocale } from "@/lib/locale";

const EMAIL = "murphy0907@foxmail.com";

function WeChatMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path
        fill="currentColor"
        d="M9.5 4C5.9 4 3 6.5 3 9.6c0 1.8.9 3.4 2.4 4.5l-.6 2.2 2.4-1.3c.7.2 1.5.3 2.3.3.3 0 .5 0 .8 0A5.6 5.6 0 0 1 10 13.7c0-3.2 3.1-5.8 6.9-5.8.2 0 .5 0 .7 0C16.6 5.5 13.4 4 9.5 4m-2.3 3.1a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8m4.7 0a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8M17 8.8c-3.1 0-5.6 2.1-5.6 4.8 0 2.6 2.5 4.8 5.6 4.8.6 0 1.2-.1 1.8-.3l1.9 1-.5-1.8c1.1-.9 1.8-2.1 1.8-3.7 0-2.7-2.5-4.8-5.6-4.8m-1.8 3a.8.8 0 1 1 0 1.6.8.8 0 0 1 0-1.6m3.6 0a.8.8 0 1 1 0 1.6.8.8 0 0 1 0-1.6"
      />
    </svg>
  );
}

export function SiteFooter() {
  const { t } = useLocale();

  function copy(value: string, ok: string) {
    void navigator.clipboard.writeText(value).then(
      () => toast.success(ok),
      () => toast.error(value),
    );
  }

  return (
    <footer className="site-footer" suppressHydrationWarning>
      <div className="site-footer__grid" suppressHydrationWarning>
        <div className="site-footer__brand" suppressHydrationWarning>
          <QuietLink href="/" className="site-logo">
            {t.brand}
          </QuietLink>
          <p suppressHydrationWarning>{t.footerTagline}</p>
        </div>

        <div suppressHydrationWarning>
          <p className="site-footer__head" suppressHydrationWarning>
            {t.footerResources}
          </p>
          <QuietLink href="/blog">{t.footerBlog}</QuietLink>
          <QuietLink href="/guide">{t.footerHow}</QuietLink>
          <QuietLink href="/faq">{t.footerFaq}</QuietLink>
        </div>

        <div suppressHydrationWarning>
          <p className="site-footer__head" suppressHydrationWarning>
            {t.footerLegalCol}
          </p>
          <QuietLink href="/terms">{t.footerTerms}</QuietLink>
          <QuietLink href="/privacy">{t.footerPrivacy}</QuietLink>
        </div>

        <div suppressHydrationWarning>
          <p className="site-footer__head" suppressHydrationWarning>
            {t.footerContact}
          </p>
          <div className="site-footer__icons" suppressHydrationWarning>
            <button
              type="button"
              className="icon-flow site-footer__icon"
              aria-label={`${t.footerEmail} ${EMAIL}`}
              title={t.footerEmail}
              suppressHydrationWarning
              onClick={() => copy(EMAIL, t.emailCopied)}
            >
              <Mail className="size-5" />
            </button>
            <button
              type="button"
              className="icon-flow site-footer__icon"
              aria-label={`${t.footerWechat} ${t.wechatId}`}
              title={t.footerWechat}
              suppressHydrationWarning
              onClick={() => copy(t.wechatId, t.wechatCopied)}
            >
              <WeChatMark />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
