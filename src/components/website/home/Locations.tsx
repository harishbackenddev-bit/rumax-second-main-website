import { locationCards } from "@/data/site";
import { AssetImage } from "@/components/ui/AssetImage";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { asset } from "@/data/site";
import { Link } from "react-router-dom";

export function Locations() {
  return (
    <section className="locations section">
      <SectionTitle
        className="locations__title"
        mark="rumax-locations-mark.svg"
        markClass="section-mark--locations"
        title="Care Services Across The UK"
      >
        <p>We provide home care and clinical services across multiple locations, bringing quality care to communities nationwide</p>
      </SectionTitle>

      <div className="container location-grid">
        {locationCards.map((location) => {
          const slug = location.toLowerCase().replace(/\s+/g, "-");

          return (
            <Link key={location} to={`/locations/${slug}`}>
              <img
                src={asset("rumax-location-card-icon.svg")}
                alt=""
              />
              {location}
            </Link>
          );
        })}
      </div>

      <a className="primary-btn locations__button" href="#">
        View All Locations
      </a>
    </section>
  );
}
