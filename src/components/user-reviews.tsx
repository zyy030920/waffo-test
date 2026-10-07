"use client";

import { useLocale } from "@/lib/locale";

const AVATARS = [
  "/reviews/review-01.jpg",
  "/reviews/review-02.jpg",
  "/reviews/review-03.jpg",
  "/reviews/review-04.jpg",
  "/reviews/review-05.jpg",
] as const;

export function UserReviews() {
  const { t } = useLocale();

  return (
    <section className="home-section" id="reviews">
      <h2 className="home-section__title">{t.reviewsTitle}</h2>
      <div className="review-rail" tabIndex={0}>
        {t.reviews.map((item, index) => (
          <article key={`${item.first}-${item.last}`} className="review-card">
            <div className="review-card__who">
              <img src={AVATARS[index]} alt="" width={64} height={64} />
              <p>
                <span>{item.first}</span> {item.last}
              </p>
            </div>
            <p className="review-card__quote">{item.quote}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
