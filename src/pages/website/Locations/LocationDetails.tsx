import React from "react";
import { useParams } from "react-router-dom";
import { Reviews } from '@/components/website/home/Reviews';
import { CareCta } from "@/components/common/CareCta";
import {
  InnerHero,
  PageShell,
  SplitSection,
  InfoGrid
} from "@/components/pages/InnerPages";

import { locationValues } from "@/data/pages";
import GridSection from "@/components/website/location/GridSection";
import { locationData } from "@/data/locations";
import { Locations } from '@/components/website/home/Locations';

const LocationDetails: React.FC = () => {
  const { city } = useParams<{ city: string }>();

  const locationName = city
    ? city
      .split("-")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(" ")
    : "Location";

  const location = city
    ? locationData[city.toLowerCase()]
    : undefined;

  const title =
    location?.title ||
    `Exceptional Home Care in ${locationName}`;

  const description =
    location?.description ||
    `Trusted Home Care in ${locationName}, Rated 9.8/10.`;

const imageMap: Record<string, string> = {
  Brentwood: "brentwood.png",
  Rochford: "rochford.png",
  Basildon: "basildon.png",
  Leigh: "leigh.png",
  Wickford: "wickford.png",
  Rayleigh: "rayleigh.png",
};

const image =
  imageMap[locationName] || location?.image || "leigh.png";

  const splitTitle =
    location?.splitTitle ||
    `Quality Home Care in ${locationName}`;

  const splitImage =
    location?.splitImage ||
    "referral-story-banner.png";

  const splitImageAlt =
    location?.splitImageAlt ||
    `RUMAX care team providing home care in ${locationName}`;

  const splitBody =
    location?.splitBody || [
      `At RUMAX LIMITED, we provide trusted and compassionate home care services in ${locationName}.`,
      `Our dedicated care team provides personalised support designed around the individual needs of every client.`,
    ];


  // Items for "How It Works" section
  const howItWorksItems = [
    {
      icon: "/images/num1.png",
      title: "Care Inquiry",
      description: "Contact us to discuss the type of support you are looking for.",
    },
    {
      icon: "/images/num2.png",
      title: "Detailed Evaluation",
      description: "We conduct an in-depth review of medical, physical, and emotional needs.",
    },
    {
      icon: "/images/num3.png",
      title: "Transparent Planning",
      description: "We provide clear guidance on our care packages and what to expect from our daily or live-in services.",
    },
    {
      icon: "/images/num4.png",
      title: "Commencing Care",
      description: "Your dedicated care team is introduced, and your personalized support begins.",
    }
  ];

  return (
    <PageShell>
      <div className="about-page">
        <InnerHero
          eyebrow=""
          title={title}
          description={description}
          backgroundImage={image}
        />

        <SplitSection
          title={splitTitle}
          image={splitImage}
          imageAlt={splitImageAlt}
          reverse
          body={splitBody}
        />

<div className="lain-main">
        <InfoGrid
          title={`Supporting the ${locationName} Community`}
          items={locationValues}
        />
        </div>
        <Reviews />

        <GridSection
          title="Our Onboarding Process"
          items={howItWorksItems}
          bgClass="grid2 grid3"
        />

        <Locations />
        <CareCta />
      </div>
    </PageShell>
  );
};

export default LocationDetails;