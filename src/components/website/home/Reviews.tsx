"use client";

import { useEffect, useRef } from "react";

export function Reviews() {
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load the Homecare.co.uk widget script
    const script = document.createElement("script");
    script.async = true;
    script.className = "tg-review-carousel-widget";
    script.type = "text/javascript";
    script.src =
      "https://api.homecare.co.uk/assets/js/review_widget_carousel.js?displaydiv=tgrcw_ecfeb21e&displayid=65432233179&displaycount=50&displaylogo=true&displayscore=true&displaybackground=true&displayratingreview=true&displaylink=true&displayminoverallrating=0&linksnofollow=false&displayfontsize=large";
    
    // Add the script to the widget container
    if (widgetRef.current) {
      widgetRef.current.appendChild(script);
    }

    // Cleanup on unmount
    return () => {
      if (widgetRef.current) {
        const scriptElement = widgetRef.current.querySelector(
          ".tg-review-carousel-widget"
        );
        if (scriptElement) {
          widgetRef.current.removeChild(scriptElement);
        }
      }
    };
  }, []);

  return (
    <section className="reviews">
      <div className="container reviews__inner">
        <aside className="review-brand">
          {/* Optional: Keep your brand info or remove if you want only the widget */}
          <h2>Client Reviews</h2>
          <p>See what our clients say about us</p>
        </aside>

        <div className="review-widget-container">
          <div
            className="tg-review-carousel-widget-container"
            id="tgrcw_ecfeb21e"
            ref={widgetRef}
            style={{ width: "100%", borderStyle: "none" }}
          />
        </div>
      </div>
    </section>
  );
}
