"use client";

import { useState, type FormEvent } from "react";
import { areaPills } from "@/data/site";
import { AssetImage } from "@/components/ui/AssetImage";
import { HeroCallbackCard } from "@/components/common/HeroCallbackCard";
import { findPostcode } from "@/data/servicePostcodes";

type ModalState = "available" | "notAvailable" | null;

export function Hero() {
  const [query, setQuery] = useState<string>("");
  const [modal, setModal] = useState<ModalState>(null);
  const [matchedCode, setMatchedCode] = useState<string>("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleaned = query.trim();
    if (!cleaned) return;

    const match = findPostcode(cleaned);

    if (match) {
      setMatchedCode(match);
      setModal("available");
    } else {
      setModal("notAvailable");
    }
  }

  function closeModal() {
    setModal(null);
  }

  return (
    <section className="hero">
      <div className="container hero__inner">
        <div className="hero__content">
          <h1>Expert Care. Delivered at Home.</h1>
          <p>
            CQC-registered domiciliary care across Essex - personal care, complex care, dementia support and 24-hour homecare.
            Nationally, we deliver specialist clinical trial home nursing for CROs, sponsors, and NHS research teams.
          </p>

          <form
            className="availability-card"
            aria-label="Check service availability"
            onSubmit={handleSubmit}
          >
            <h2>CHECK SERVICE AVAILABILITY NEAR YOU</h2>
            <p>
              Rumax Limited is expanding. Enter your postcode to see if we&apos;re in your area.
            </p>

            <div className="postcode-row">
              <label className="sr-only" htmlFor="postcode">
                Postcode
              </label>
              <input
                id="postcode"
                type="text"
                placeholder="Search by postcode or name of town"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
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

      {/* AVAILABLE MODAL */}
      {modal === "available" && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Available in your postcode!</h3>
            <p className="text-muted">{matchedCode}</p>
            <div className="modal-actions">
              <button type="button" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NOT AVAILABLE MODAL */}
      {modal === "notAvailable" && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Not Available</h3>
            <p>Sorry, we do not service this area yet.</p>
            <div className="modal-actions">
              <button type="button" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}