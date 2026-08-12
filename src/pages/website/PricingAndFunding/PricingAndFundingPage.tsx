import React from "react";
import { CareCta } from "@/components/common/CareCta";
import {
  InnerHero,
  PageShell,
} from "@/components/pages/InnerPages";
import { Compliance } from '@/components/website/home/Compliance';
import DomiciliaryAssessment from '@/components/website/pricing/DomiciliaryAssessment';
import FundingPathway from "@/components/website/pricing/FundingPathway";

const cookieTypes = [
  {
    title: "Private Pay (Self-Funding)",
    body:
      "For families managing the cost of care independently, we guarantee absolute transparency.",
    features: [
      [
        "Simple, Transparent Pricing:",
        "You pay a clear hourly rate based strictly on the level of care required.",
      ],
      [
        "No Hidden Fees:",
        "We do not charge unnecessary out-of-pocket fees, or hidden onboarding costs. What you see on your care plan is exactly what you will be invoiced for.",
      ],
      [
        "Flexible Adjustments:",
        "As your loved one or a family member changes, your care package can easily be scaled up or down, putting their needs in control of your budget.",
      ],
    ],
  },
  {
    title: "Local Authority Direct Payments & Care Packages",
    body:
      "If you are eligible for local council support, we work closely with your local authority to seamlessly integrate your funding.",
    features: [
      [
        "Direct Payments:",
        "Instead of the council choosing a provider for you, they provide you with a budget. This empowers you to choose us directly, giving you complete control over who crosses your threshold and how care is delivered.",
      ],
      [
        "Council-Commissioned Care:",
        "If your local authority manages the care package directly, we coordinate with them to ensure our high standards of non-clinical, empathetic support are met within their provided budget.",
      ],
    ],
  },
  {
    title: "NHS Continuing Healthcare (CHC) Funding",
    body:
      "For individuals with significant, ongoing healthcare needs, the NHS may cover the full cost of domiciliary care.",
    features: [
      [
        "Fully Funded:",
        "Unlike local authority funding, NHS CHC is not means-tested. If you qualify, the NHS covers the entirety of the assessed care needs.",
      ],
      [
        "Collaborative Care:",
        "We work alongside NHS assessors and clinical teams to deliver complex care at home, ensuring safety and comfort without making the home feel like a hospital ward.",
      ],
    ],
  },
  {
    title: "Personal Health Budgets",
    body:
      "An amount of money provided by the NHS to support your identified healthcare and wellbeing needs.",
    features: [
      [
        "Maximum Flexibility:",
        "PHBs are designed to give individuals more choice and control over how their health needs are met.",
      ],
      [
        "Tailored Support:",
        "You can use this budget to build a bespoke care plan with us that perfectly aligns with your lifestyle, routines, and personal preferences.",
      ],
    ],
  },
];

const trainingIntro =
  "Navigating the financial side of home care can feel overwhelming. We believe that every family deserves complete clarity, without the stress of confusing jargon or hidden costs. Finding the right care for your loved one should be your primary focus, and our goal is to make the funding process as straightforward and supportive as possible.";

const PricingAndFundingPage: React.FC = () => {
  return (
    <PageShell>
       <div className="about-page">
      <InnerHero
        actions={[
          { href: "#", label: "Care Estimator" },
          {
            href: "#contact",
            label: "Book a Care Consultation",
            variant: "secondary",
          },
        ]}
        className="inner-hero--supported-living inner-hero--training"
        title="Funding & Costs"
        description={trainingIntro}
        backgroundImage="rumax-team-hero.png"
        showScrollCue
      />

      <section className="cookie-types-band">
        <div className="cookie-types-band__inner">
          <h2>
            Our Commitment to You and <br />
            Your Clients
          </h2>

          <div className="cookie-type-grid">
            {cookieTypes.map((item, index) => (
              <article className="cookie-type-card" key={item.title}>
                <span
                  className={`cookie-type-card__icon cookie-type-card__icon----${index + 1
                    }`}
                  aria-hidden="true"
                />

                <span className="cookie-type-card__number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div>
                  <h3>{item.title}</h3>

                  <p>{item.body}</p>

                  <div className="cookie-type-card__features">
                    {item.features.map(([featureTitle, featureBody]) => (
                      <div
                        className="cookie-type-card__feature"
                        key={featureTitle}
                      >
                        <span
                          className="cookie-type-card__check"
                          aria-hidden="true"
                        />

                        <div className="cookie-type-card__feature-content">
                          <h4>{featureTitle}</h4>
                          <p>{featureBody}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <a href="#" className="cookie-type-card__learn-more">
                    Learn More
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Compliance />
  <DomiciliaryAssessment />
  <FundingPathway />
      <CareCta />
      </div>
    </PageShell>
  );
};

export default PricingAndFundingPage;