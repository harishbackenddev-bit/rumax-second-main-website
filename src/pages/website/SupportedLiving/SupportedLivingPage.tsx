
import { CareProcessSection } from "@/components/common/CareProcessSection";
import { CareCta } from "@/components/common/CareCta";
import { QualityGovernanceStrip } from "@/components/common/QualityGovernanceStrip";
import { ReasonsGrid } from "@/components/common/ReasonsGrid";
import { FaqSection, InnerHero, PageShell } from "@/components/pages/InnerPages";


const supportedLivingFeatures = [
  {
    iconAsset: "dom-care-reason-plans.svg",
    title: "Person-Centred Support",
    description: "Your goals, preferences, and aspirations are at the heart of everything we do. We support you to live the life you choose."
  },
  {
    iconAsset: "dom-care-reason-compassion.svg",
    title: "Health & Wellbeing",
    description: "Assistance with managing health appointments, medication, and maintaining physical and mental wellbeing."
  },
  {
    iconAsset: "dom-care-reason-trained.svg",
    title: "Skill Development",
    description: "We help you develop practical life skills including budgeting, cooking, cleaning, and managing your tenancy."
  },
  {
    iconAsset: "dom-care-reason-cqc.svg",
    title: "Safety & Safeguarding",
    description: "Ensuring you are safe and protected, with risk assessments and safeguarding procedures in place."
  },
  {
    iconAsset: "dom-care-reason-flexible.svg",
    title: "Community Integration",
    description: "Support to access community activities, education, employment, and build meaningful social connections."
  },
  {
    iconAsset: "dom-care-reason-availability.svg",
    title: "Quality of Life",
    description: "Supporting you to enjoy hobbies, interests, relationships, and activities that bring you happiness and fulfillment."
  }
];

const supportedLivingAbout = [
  "Supported Living is about enabling individuals to live as independently as possible in their own home or shared accommodation, with the right level of support tailored to their unique needs. Unlike traditional residential care, Supported Living puts you in control - you choose where you live, who supports you, and how you spend your time.",
  "Our Supported Living service is designed for adults with learning disabilities, autism, mental health needs, or physical disabilities who require ongoing support to manage daily life. We work in partnership with you, your family, and healthcare professionals to create a support plan that promotes independence, personal development, and quality of life."
];

const supportedLivingBullets = [
  "Daily living skills and personal routines",
  "Community access and meaningful activities",
  "Medication support",
  "Budgeting and financial skills support",
  "Collaboration with families, social workers, and support networks"
];

const supportedLivingReasons = [
  {
    iconAsset: "dom-care-reason-cqc.svg",
    title: "CQC Registration",
    description: "Fully regulated and compliant with all Care Quality Commission standards."
  },
  {
    iconAsset: "dom-care-reason-trained.svg",
    title: "Trained Professionals",
    description: "All carers are DBS checked, fully trained, and experienced in person-centred support."
  },
  {
    iconAsset: "dom-care-reason-compassion.svg",
    title: "Compassionate Care",
    description: "We treat every individual with kindness, dignity, and respect they deserve."
  },
  {
    iconAsset: "dom-care-reason-flexible.svg",
    title: "Flexible Support",
    description: "From a few hours a week to ongoing support, we adapt to your needs and schedule."
  },
  {
    iconAsset: "dom-care-reason-plans.svg",
    title: "Personalised Plans",
    description: "No two people are the same. Your support plan is uniquely yours and regularly reviewed."
  },
  {
    iconAsset: "dom-care-reason-availability.svg",
    title: "24/7 Availability",
    description: "Our office team is always available to support you, your family, and our care team."
  }
];

const supportedLivingFaqs = [
  "What qualifications, training, and experience do your mobile research nurses have?",
  "2. How do you ensure full ICH GCP E6 (R3) compliance and protocol adherence during home visits?",
  "3. What is your process for scheduling and coordinating home visits with the investigator site?",
  "4. How do you manage patient safety, emergency situations, and adverse events during home visits?",
  "5. How is clinical data collected, documented, and integrated with the investigator site and EDC system?",
  "6. What geographic areas and countries do you cover, and how do you handle rural or remote patients?",
  "7. What are the typical costs and pricing models for your mobile nursing services?"
];

export default function SupportedLivingPage() {
  return (
    <PageShell>
      <InnerHero
        actions={[
          { href: "/care-calculator", label: "Calculate Your Care Costs" },
          { href: "/careers", label: "Work For Us", variant: "secondary" }
        ]}
        className="inner-hero--supported-living"
        title="Supported Living"
        description="Empowering adults with learning disabilities, autism, mental health needs, or physical disabilities to live independently in their own home or supported accommodation."
        backgroundImage="supported-living-hero.png"
        showCallback
        showScrollCue
      />
      <QualityGovernanceStrip />
      <CareProcessSection
        title="What Is Supported Living?"
        body={supportedLivingAbout}
        bullets={supportedLivingBullets}
        image="supported-living-about.png"
        imageAlt="Rumax supported living care worker with client"
        variant="about"
      />
      <ReasonsGrid title="Key Features of Our Service" items={supportedLivingFeatures} />
      <ReasonsGrid title="Why Choose Rumax for Personal Care" items={supportedLivingReasons} />
      <FaqSection items={supportedLivingFaqs} />
      <CareCta title="Enquire About Our Services" />
    </PageShell>
  );
}
