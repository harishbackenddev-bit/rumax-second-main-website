import React from "react";
import { useSearchParams } from "react-router-dom";
import { CareCta } from "@/components/common/CareCta";
import { InnerHero, PageShell, SplitSection } from "@/components/pages/InnerPages";
import { FeebackGrid } from "@/components/pages/InnerPages";
import { feedbackValues } from "@/data/pages";
import { asset, locationCards } from "@/data/site";
import ReferralBookingForm from '@/components/website/referral/ReferralBookingForm';
import { Locations } from '@/components/website/home/Locations';


const cookieTypes: Array<[string, string]> = [];

cookieTypes.push([
  "Rapid Acknowledgement",
  "We guarantee an acknowledgement of all referrals within one working day"
]);

cookieTypes.push([
  "Swift Action",
  "We will arrange an initial, comprehensive care assessment within 48 hours wherever possible"
]);

// Define the referral steps here or import from a separate file
const referralSteps = [
  {
    id: "1",
    label: "Referrer Info",
    title: "Referrer Information (About You)",
    description: "Please provide your contact details so we can get back to you.",
    fields: [
      ["First Name *", "Enter first name"],
      ["Last Name *", "Enter last name"],
      ["Phone Number *", "Enter Phone Number"],
      ["Email Address *", "Enter email address"],
      ["Job Title / Role *", "Select"],
      ["Organization / Trust / Local Authority *", "Enter Organization/Trust/Local Authority Name"]
    ]
  },
  {
    id: "2",
    label: "Client Details",
    title: "Client / Patient Details (About Them)",
    description: "Please provide the client's personal information.",
    fields: [
      ["Client Full Name *", "Enter client full name"],
      ["Date of Birth *", "Select"],
      ["Current Location *", "Select"],
      ["Estimated Discharge Date (if in hospital)", "Select"],
      ["Additional information or questions (optional)", "Specify here...", "wide"]
    ]
  },
  {
    id: "3",
    label: "Care Needs",
    title: "Care Requirements (The Need)",
    description: "Please provide details about the care required.",
    fields: [
      ["Primary Reason for Referral *", "Select"],
      ["Urgency Level *", "Radio"],
      ["Brief Summary of Needs *", "e.g., Mobility issues, medication administration, behavioral support", "wide"]
    ]
  },
  {
    id: "4",
    label: "Documents",
    title: "Supporting Documentation (Secure Upload)",
    description: "Upload any relevant documents to support the referral.",
    fields: [
      ["Upload Care Plans / Discharge Summaries / Risk Assessments *", "upload"]
    ]
  },
  {
    id: "5",
    label: "Consent",
    title: "Consent & Submission",
    description: "Please confirm your consent before submitting the referral.",
    fields: [
      ["I confirm that the client or their legal representative has consented to this referral being made to RUMAX LIMITED. *", "checkbox"],
      ["I agree to the secure processing of this data in accordance with the Data Protection Act / GDPR. *", "checkbox"]
    ]
  }
];

const ReferralPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const step = searchParams.get("step");
  
  // Find the current step based on URL parameter, default to first step
  const currentStep = referralSteps.find((item) => item.id === step) ?? referralSteps[0];

  return (
    <PageShell>
      <div className="about-page">
        <InnerHero
          eyebrow=""
          title="Make A Referral"
          description="Fast & secure patient referrals to RUMAX LIMITED. We guarantee a 1-day response and 48-hour assessments."
          backgroundImage="rumax-team-hero.png"
        />

        <SplitSection
          title="Fast & Secure Patient Referrals"
          image="referral-story-banner.png"
          imageAlt="Rumax care team standing beside Rumax banner"
          reverse
          body={[
            "At RUMAX LIMITED, we understand that transitioning a patient or client into a new care environment requires speed, accuracy, and deep compassion. We have streamlined our referral process to ensure that your clients receive the timely, high-quality care and support they need.",
            "Whether you are seeking urgent post-hospital support or a long-term care placement, our dedicated intake team is ready to partner with you.",
          ]}
        />

        <FeebackGrid title="Who Can Make a Referral?" items={feedbackValues} />

        <section className="cookie-types-band">
          <div className="cookie-types-band__inner">
            <h2>Our Commitment to You and <br />Your Clients</h2>
            <div className="cookie-type-grid">
              {cookieTypes.map(([title, body], index) => (
                <article className="cookie-type-card" key={title}>
                  <span className={`cookie-type-card__icon cookie-type-card__icon---${index + 1}`} aria-hidden="true" />
                  <span className="cookie-type-card__number">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Pass the required props */}
        <ReferralBookingForm 
          steps={referralSteps} 
        />

      <Locations />

        <CareCta />
      </div>
    </PageShell>
  );
};

export default ReferralPage;