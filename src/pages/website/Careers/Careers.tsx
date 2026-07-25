import { CareCta } from "@/components/common/CareCta";
import { InfoGrid, InnerHero, JobGrid, PageShell, ProcessTimeline } from "@/components/pages/InnerPages";
import { careerSupport, jobs, recruitmentSteps } from "@/data/pages";

export default function CareersPage() {
  return (
    <PageShell>
      <div className="careers-page">
        <InnerHero
          className="inner-hero--careers"
          title="Careers At Rumax"
          description="Join a team where your work makes a real difference. Whether you're passionate about compassionate care or advancing medical research, we have opportunities for you."
          backgroundImage="rumax-team-hero.png"
          showScrollCue
        />
        <ProcessTimeline title="Our Recruitment Process" items={recruitmentSteps} />
        <JobGrid jobs={jobs} />
        <CareersCareSection />
        <InfoGrid title="What we support" items={careerSupport} />
        <CareCta />
      </div>
    </PageShell>
  );
}

const careersCareBullets = [
  "Personalised care plans",
  "Experienced healthcare professionals",
  "Flexible and reliable support",
  "Focus on dignity and independence",
  "Carer respite and family liaison",
  "End of life dementia care"
];

function CareersCareSection() {
  return (
    <section className="page-section careers-care">
      <div className="container careers-care__inner">
        <div className="careers-care__copy">
          <h2>Care That Feels Personal, Every Day</h2>
          <p>
            At Rumax, we believe care is more than just support - it&apos;s about understanding individual needs, building
            trust, and delivering services that truly make a difference.
          </p>
          <p>
            Our team combines compassion with clinical expertise to ensure every person receives the right level of care, in
            the right environment, at the right time.
          </p>
          <ul>
            {careersCareBullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="careers-care__media">
          <img src="/assets/figma-exported/rumax-careers-team.png" alt="Rumax care team" />
        </div>
      </div>
    </section>
  );
}
