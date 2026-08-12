"use client";

import { areaPills } from "@/data/site";
import { AssetImage } from "@/components/ui/AssetImage";
import { HeroCallbackCard } from "@/components/common/HeroCallbackCard";

export function Hero() {
  return (
    <section className="hero">
      {/* <div className="scroll-cue" aria-hidden="true">
        <span>Scroll down</span>
        <AssetImage name="rumax-scroll-arrow.svg" aria-hidden="true" />
      </div> */}
      <div className="container hero__inner">
        <div className="hero__content">
          <h1>Expert Care. Delivered at Home.</h1>
          <p>
            CQC-registered domiciliary care across Essex - personal care, complex care, dementia support and 24-hour homecare.
            Nationally, we deliver specialist clinical trial home nursing for CROs, sponsors, and NHS research teams.
          </p>

          <form className="availability-card" aria-label="Check service availability" onSubmit={(event) => event.preventDefault()}>
            <h2>CHECK SERVICE AVAILABILITY NEAR YOU</h2>
            <p>Rumax Limited is expanding. Enter your postcode to see if we&apos;re in your area.</p>
            <div className="postcode-row">
              <label className="sr-only" htmlFor="postcode">
                Postcode
              </label>
              <input id="postcode" type="text" placeholder="E.g., SW1A 1AA" />
              <button type="submit">
                <AssetImage name="rumax-hero-check.svg" aria-hidden="true" />
                Check
              </button>
            </div>
            <div className="area-pills" aria-label="Popular service areas">
              {areaPills.map((area) => (
                <a href="#" key={area}>
                  {area}
                </a>
              ))}
            </div>
          </form>
        </div>

        <HeroCallbackCard />
      </div>
    </section>
  );
}
