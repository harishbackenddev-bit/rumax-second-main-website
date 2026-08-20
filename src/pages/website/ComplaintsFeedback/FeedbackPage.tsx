import React from "react";
import { CareCta } from "@/components/common/CareCta";
import { FeebackGrid, FeebackGridsecond, InfoGrid, InnerHero, PageShell, SplitSection } from "@/components/pages/InnerPages";
import {feedbackValues, feedbackValuessecond} from "@/data/pages";
import FeedbackSection from '@/components/website/feedback/feedback';


const FeedbackPage: React.FC = () => {
  return (
    <PageShell>
      <div className="about-page">
        <InnerHero
          eyebrow=""
          title="Complaints, Concerns & Feedback"
          description="Your health, safety, and comfort are our highest priorities. We actively encourage your feedback to help us continually improve our services."
          backgroundImage="rumax-team-hero.png"
        />
        
        <SplitSection
          title="Your Voice Matters"
          image="complaints.png"
          imageAlt="Rumax care team standing beside Rumax banner"
          reverse
          body={[
            "At RUMAX LIMITED, we are deeply committed to providing safe, high-quality care to every individual we support. We believe that open communication is the foundation of outstanding care, which is why we actively encourage feedback from our service users, their families, and advocates.",
            "Whether you have a suggestion for improvement, a minor concern, or a formal complaint, we want to hear from you. Your insights help us continually improve our services and ensure we are meeting the high standards you deserve."
          ]}
        />
        

        <div className="feedback-main-cst">
          <section className="page-section">
  <div className="container">
    <div className="page-section__heading">
      <h2>Our Promise to You</h2>
    </div>

    <div className="info-grid info-grid--four">
      <article className="info-card">
        <span className="info-card__icon info-card__icon--blue">
          <img src="/assets/figma-exported/feedback1.svg" alt="" />
        </span>
        <h3>We Will Listen</h3>
        <p>
          Your feedback will be treated with the utmost respect, confidentiality, and empathy
        </p>
      </article>

      <article className="info-card">
        <span className="info-card__icon info-card__icon--blue">
          <img src="/assets/figma-exported/feedback2.svg" alt="" />
        </span>
        <h3>We Will Act Promptly</h3>
        <p>
          We acknowledge all complaints swiftly and aim to resolve them as quickly as possible
        </p>
      </article>

      <article className="info-card">
        <span className="info-card__icon info-card__icon--blue">
          <img src="/assets/figma-exported/feedback3.svg" alt="" />
        </span>
        <h3>We Will Be Fair</h3>
        <p>
         Every concern is thoroughly and objectively investigated by our management team
        </p>
      </article>

      <article className="info-card">
        <span className="info-card__icon info-card__icon--blue">
          <img src="/assets/figma-exported/feedback4.svg" alt="" />
        </span>
        <h3>Care Never Compromised</h3>
        <p>
          Raising a concern will never negatively impact the level or quality of care you receive
        </p>
      </article>
    </div>
  </div>
</section>
        </div>

         
          <FeedbackSection />
        <div className="feedback-main-cst">
         <FeebackGridsecond title="How to Raise a Concern or Complaint" items={feedbackValuessecond} />
         </div>
        <CareCta />
      </div>
    </PageShell>
  );
};

export default FeedbackPage;