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
          <FeebackGrid title="Our Promise to You" items={feedbackValues} />
        </div>

         <div className="feedback-main-cst">
         <FeebackGridsecond title="How to Raise a Concern or Complaint" items={feedbackValuessecond} />
         </div>
          <FeedbackSection />
        
        <CareCta />
      </div>
    </PageShell>
  );
};

export default FeedbackPage;