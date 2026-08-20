import React from "react";
import { CareCta } from "@/components/common/CareCta";
import { InnerHero, PageShell, SplitSection } from "@/components/pages/InnerPages";
import LocationsSection from "@/components/website/location/LocationsSection";


const LocationsPage: React.FC = () => {
  return (
    <PageShell>
      <div className="about-page">
        <InnerHero
          eyebrow=""
          title="Our Essex County Locations"
          description="Providing exceptional home care across Essex and surrounding areas "
          backgroundImage="rumax-team-hero.png"
        />

        <LocationsSection />
        <CareCta />
      </div>
    </PageShell>
  );
};

export default LocationsPage;