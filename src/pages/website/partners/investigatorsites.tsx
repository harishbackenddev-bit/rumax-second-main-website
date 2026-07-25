// pages/InvestigatorTrialSupport.tsx
import React from "react";

import CroHero from "@/components/website/partners/CroHero";
import LogoSection from "@/components/website/services/clinical/LogoSection";
import ServiceOfferingBlock from "@/components/website/partners/ServiceOfferingBlock_second";
import OnboardingProcess from "@/components/website/partners/OnboardingProcess";
import FAQSection from '@/components/website/partners/FAQSection';
import GridSection from "@/components/website/partners/GridSection";


// Import images
// (Update paths as needed)
import ecaImg from "/images/eca.png";
import cqcLogoImg from "/images/cqc-logo.png";
import nhsImg from "/images/nhs.png";
import icoImg from "/images/ico.png";
import isoImg from "/images/iso.png";
import cyberEssentialImg from "/images/cyber-essential.png";



const myFaqs = [
  {
    id: 'faq-1',
    question: 'What is your response time?',
    answer: 'We typically respond within 24 hours.'
  },
  {
    id: 'faq-2',
    question: 'Do you offer 24/7 support?',
    answer: 'Yes, we provide round-the-clock support.'
  }
];

function Investigatorsites() {
  // Logo data
  const logos = [
    { src: ecaImg, alt: "ECA" },
    { src: cqcLogoImg, alt: "CQC" },
    { src: nhsImg, alt: "NHS" },
    { src: icoImg, alt: "ICO" },
    { src: isoImg, alt: "ISO" },
    { src: cyberEssentialImg, alt: "Cyber Essential" },
  ];

  const clinicalCapabilities = [
  {
    icon: "/images/logo26.png",
    description:
      "A named study management and operational point of contact for every engagement, supported by our Country Study Manager function.",
  },
  {
    icon: "/images/logo27.png",
    description:
      "Activity delivered under the sponsor/CRO protocol, the site delegation log, and Rumax SOPs — with clear lines of medical and clinical oversight.",
  },
  {
    icon: "/images/logo28.png",

    description:
      "Quality and performance reporting against agreed KPIs (visit completion, visit-window adherence, deviation rates, and timelines).",
  },
  {
    icon: "/images/logo29.png",
    description:
      "Deviation, incident, and CAPA management handled within our ISO 9001:2015 QMS and reported in line with GCP and your pharmacovigilance requirements.",
  },
  {
    icon: "/images/logo30.png",
    description:
      "Audit and inspection readiness as standard, including documented training records, competency evidence, and a maintained QMS index.",
  },
  {
    icon: "/images/logo31.png",
    description:
      "Our long-standing relationships with major CROs reflect this approach — Rumax has supported research delivery partners since 2013.",
  },
];

  return (
    <div className="investigator-trial-page">
      <CroHero />

      <LogoSection logos={logos} />
      <ServiceOfferingBlock />
<GridSection
  title="An extension of your study team, not a transactional supplier."
  description="We position ourselves as an extension of your study team, not a transactional supplier. Our partnership model is built on delegated oversight, 
transparent quality reporting, and a relationship that scales from a single site to a national programme."
  items={clinicalCapabilities}
/>


      <OnboardingProcess />
      <FAQSection
        title="Frequently Asked Questions"
        faqs={myFaqs}
        defaultOpenIndex={0}
      />
    </div>
  );
}

export default Investigatorsites;