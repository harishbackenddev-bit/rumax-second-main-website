export type LocationData = {
  title: string;
  description: string;
  image: string;
  splitTitle: string;
  splitImage: string;
  splitImageAlt: string;
  splitBody: string[];
};

const createLocationData = (locationName: string): LocationData => ({
  title: `Exceptional Home Care in ${locationName}`,

  description: `Trusted Home Care in ${locationName}, Rated 9.8/10.`,

  image: "rumax-team-hero.png",

  splitTitle: `Welcome to ${locationName}`,

  splitImage: "referral-story-banner.png",

  splitImageAlt: `RUMAX care team providing home care in ${locationName}`,

  splitBody: [
    `Trusted Home Care in ${locationName}, Rated 9.8/10. Balancing work, family and caring for an aging parent in ${locationName}? You don't have to do it alone. RUMAX Limited provides compassionate, CQC-regulated domiciliary care tailored to your loved one's routine. Let us give you peace of mind.`,
  ],
});

export const locationData: Record<string, LocationData> = {
  rayleigh: createLocationData("Rayleigh"),

  wickford: createLocationData("Wickford"),

  basildon: createLocationData("Basildon"),

  brentwood: createLocationData("Brentwood"),

  "leigh-on-sea": createLocationData("Leigh on Sea"),

  southend: createLocationData("Southend"),

  thundersley: createLocationData("Thundersley"),

  benfleet: createLocationData("Benfleet"),

  hadleigh: createLocationData("Hadleigh"),

  hullbridge: createLocationData("Hullbridge"),

  pitsea: createLocationData("Pitsea"),

  laindon: createLocationData("Laindon"),

  hockley: createLocationData("Hockley"),

  billericay: createLocationData("Billericay"),

  chelmsford: createLocationData("Chelmsford"),

  maldon: createLocationData("Maldon"),

  rawreth: createLocationData("Rawreth"),

  eastwood: createLocationData("Eastwood"),

  "southend-on-sea": createLocationData("Southend on Sea"),
};