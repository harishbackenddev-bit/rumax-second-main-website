import React from "react";
type Location = {
  name: string;
};

const locations: Location[] = [
  { name: "Rayleigh",link:"/locations/rayleigh" },
  { name: "Wickford",link:"/locations/wickford" },
  { name: "Basildon",link:"/locations/basildon" },
  { name: "Brentwood",link:"/locations/brentwood" },
  { name: "Leigh on Sea",link:"/locations/leigh-on-sea" },
  { name: "Southend",link:"/locations" },
  { name: "Thundersley",link:"/locations" },
  { name: "Benfleet",link:"/locations" },
  { name: "Hadleigh",link:"/locations" },
  { name: "Hullbridge",link:"/locations" },
  { name: "Pitsea",link:"/locations" },
  { name: "Laindon",link:"/locations" },
  { name: "Hockley",link:"/locations" },
  { name: "Billericay",link:"/locations" },
  { name: "Chelmsford",link:"/locations" },
  { name: "Maldon",link:"/locations" },
  { name: "Rawreth",link:"/locations" },
  { name: "Eastwood",link:"/locations" },
  { name: "Southend on Sea",link:"/locations" },
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
              href={location.link}
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
              <span> <img
                  src="/images/icon.png"
                  alt=""
                /></span>
              Check
            </button>
          </form>
        </div>

      </div>
    </section>
  );
}
