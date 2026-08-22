import React from "react";
import locationIcon from "@/public/images/icon.png";
type Location = {
  name: string;
};

const locations: Location[] = [
  { name: "Rayleigh" },
  { name: "Wickford" },
  { name: "Basildon" },
  { name: "Brentwood" },
  { name: "Leigh on Sea" },
  { name: "Southend" },
  { name: "Thundersley" },
  { name: "Benfleet" },
  { name: "Hadleigh" },
  { name: "Hullbridge" },
  { name: "Pitsea" },
  { name: "Laindon" },
  { name: "Hockley" },
  { name: "Billericay" },
  { name: "Chelmsford" },
  { name: "Maldon" },
  { name: "Rawreth" },
  { name: "Eastwood" },
  { name: "Southend on Sea" },
];

export default function LocationsSection() {
  return (
    <section className="areas-we-serve-section">
      <div className="container">

        <div className="locations__title">
          <h2>Areas We Serve</h2>

          <p>
            Our dedicated care teams are proud to serve communities across
            Essex, bringing professional, compassionate support directly to
            your home.
          </p>
        </div>

        <div className="location-grid">
          {locations.map((location) => (
            <a
              key={location.name}
              href="/locations"
              className="location-card"
            >
              <span className="location-card__icon">
                <img
                  src="/assets/figma-exported/rumax-location-card-icon.svg"
                  alt=""
                />
              </span>

              <span className="location-card__content">
                <strong>{location.name}</strong>
                <small>
                  Professional home care services available
                </small>
              </span>
            </a>
          ))}
        </div>

        <div className="service-availability">
          <h3>CHECK SERVICE AVAILABILITY NEAR YOU</h3>

          <p>
            Rumax Limited is expanding. Enter your postcode to see if we're
            in your area.
          </p>

          <form className="service-availability__form">
            <input
              type="text"
              placeholder="E.g., SS1 1AA"
              aria-label="Postcode"
            />

            <button type="submit">
              <span><Image 
    src={locationIcon} 
    alt="" 
    width={40} 
    height={40}
  /></span>
              Check
            </button>
          </form>
        </div>

      </div>
    </section>
  );
}
