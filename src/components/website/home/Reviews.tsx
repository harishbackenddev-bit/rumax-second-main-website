"use client";

import { useEffect, useRef, useState } from "react";
import { reviews } from "@/data/site";
import { AssetImage } from "@/components/ui/AssetImage";

export function Reviews() {
  const [activeSlide, setActiveSlide] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const card = cardRef.current;
    if (!track || !card) {
      return;
    }

    const setOffset = () => {
      const styles = window.getComputedStyle(track);
      const gap = parseFloat(styles.columnGap || styles.gap || "0") || 0;
      track.style.transform = `translateX(-${activeSlide * (card.getBoundingClientRect().width + gap)}px)`;
    };

    setOffset();
    window.addEventListener("resize", setOffset);
    return () => window.removeEventListener("resize", setOffset);
  }, [activeSlide]);

  return (
    <section className="reviews">
      <div className="container reviews__inner">
        <aside className="review-brand">
          <AssetImage className="review-brand__logo" name="rumax-review-logo.png" alt="Rumax" />
          <AssetImage className="review-brand__rating" name="rumax-review-rating.svg" alt="4.8 out of 5" />
          <AssetImage className="review-brand__stars" name="rumax-review-brand-stars.svg" aria-hidden="true" />
          <span>Based on 1,258 reviews</span>
          <p>
            Powered by <AssetImage name="rumax-homecare-logo.png" alt="homecare.co.uk" />
          </p>
          <a className="primary-btn" href="#">
            Review Us
          </a>
          <div className="review-dots" aria-label="Review slides">
            {reviews.map((review, index) => (
              <button
                className={index === activeSlide ? "is-active" : undefined}
                type="button"
                aria-label={`Show ${review.name} review`}
                onClick={() => setActiveSlide(index)}
                key={review.name}
              />
            ))}
          </div>
        </aside>

        <div className="review-slider" aria-label="Client reviews">
          <div className="review-track" ref={trackRef}>
            {[...reviews, ...reviews].map((review, index) => (
              <article
                className="review-card"
                ref={index === 0 ? cardRef : undefined}
                aria-hidden={index >= reviews.length ? true : undefined}
                key={`${review.name}-${index}`}
              >
                <AssetImage className="avatar" name={review.avatar} aria-hidden="true" />
                <div>
                  <h3>{review.name}</h3>
                  <span>{review.date}</span>
                  <AssetImage className="review-stars" name="rumax-review-stars.svg" alt="5 stars" />
                  <p>{review.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
