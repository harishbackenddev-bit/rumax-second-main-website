import type { Metadata } from "next";
import { PageIcon, PageShell } from "@/components/pages/InnerPages";
import { researchNurseRequirements, researchNurseResponsibilities } from "@/data/pages";
import { asset } from "@/data/site";

export const metadata: Metadata = {
  title: "Research Nurse | Rumax Careers",
  description: "Research Nurse role details at Rumax."
};

const positionDetails = [
  ["Contract Type", "Full-time", "briefcase", "purple"],
  ["Experience", "5+ years", "clock", "blue"],
  ["Location", "Essex", "location", "green"],
  ["Salary Range", "$85,000 - $110,000", "money", "yellow"],
  ["Deadline", "April 30, 2026", "calendar", "red"]
];

const jobMeta = [
  ["Essex", "location"],
  ["Full-time", "briefcase"],
  ["5+ years", "clock"]
];

type ResearchNursePageProps = {
  searchParams?: Promise<{ apply?: string }>;
};

export default async function ResearchNursePage({ searchParams }: ResearchNursePageProps) {
  const params = await searchParams;
  const showApplyModal = params?.apply === "1";

  return (
    <PageShell>
      <section className="job-hero">
        <div className="job-hero__scroll" aria-hidden="true">
          <span>Scroll down</span>
          <img src={asset("rumax-scroll-arrow.svg")} alt="" />
        </div>
        <div className="container job-hero__inner">
          <div>
            <h1>
              Research Nurse <span>Active</span>
            </h1>
            <p>Posted on March 15, 2026</p>
            <div className="job-meta">
              {jobMeta.map(([label, icon]) => (
                <span key={label}>
                  <PageIcon name={icon} />
                  {label}
                </span>
              ))}
            </div>
          </div>
          <a className="job-hero__button" href="/careers/research-nurse?apply=1">Apply Now</a>
        </div>
      </section>
      <section className="page-section job-detail">
        <div className="container job-detail__grid">
          <div className="job-detail__main">
            <article className="job-summary">
              <h2>Job Description</h2>
              <p>
                We are seeking an experienced and highly skilled Research Nurse to join our dynamic healthcare team. The
                ideal candidate will play a critical role in delivering high-quality patient care, supervising nursing
                staff, and ensuring adherence to clinical standards and healthcare regulations. This position requires
                strong clinical expertise, leadership capabilities, and a patient-first mindset.
              </p>
            </article>
            <JobListPanel title="Key Responsibilities" items={researchNurseResponsibilities} />
            <JobListPanel title="Requirements & Qualifications" items={researchNurseRequirements} />
            <JobListPanel
              title="Preferred Skills"
              compact
              items={[
                "Experience in ICU, emergency care, or specialized departments (e.g., cardiology, oncology)",
                "Strong decision-making and problem-solving abilities",
                "Empathy and a patient-centric approach",
                "Ability to train and guide junior staff effectively"
              ]}
            />
          </div>
          <aside className="position-card">
            <h2>Position Details</h2>
            {positionDetails.map(([label, value, icon, tone]) => (
              <div className="position-card__row" key={label}>
                <span className={`position-card__icon--${tone}`} aria-hidden="true">
                  <PageIcon name={icon} />
                </span>
                <div>
                  <small>{label}</small>
                  <b>{value}</b>
                </div>
              </div>
            ))}
            <a href="/careers/research-nurse?apply=1">Apply for this Position</a>
            <button type="button">Save Job</button>
          </aside>
        </div>
      </section>
      {showApplyModal ? <CreateAccountModal /> : null}
    </PageShell>
  );
}

function JobListPanel({ title, items, compact }: { title: string; items: string[]; compact?: boolean }) {
  return (
    <article className={`job-list-panel${compact ? " job-list-panel--compact" : ""}`}>
      <h2>{title}</h2>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}

function CreateAccountModal() {
  return (
    <div className="career-account-modal" role="dialog" aria-modal="true" aria-labelledby="career-account-title">
      <div className="career-account-modal__backdrop" aria-hidden="true" />
      <div className="career-account-modal__panel">
        <a className="career-account-modal__close" href="/careers/research-nurse" aria-label="Close">
          x
        </a>
        <h2 id="career-account-title">Create Account</h2>
        <button className="career-account-modal__google" type="button">
          <span>G</span>
          Continue With Google
        </button>
        <form className="career-account-form" aria-label="Create account">
          <label>
            Full Name
            <input type="text" placeholder="Enter Full Name" />
          </label>
          <label>
            Email Address
            <input type="email" placeholder="you@ru-max.co.uk" />
          </label>
          <label>
            Password
            <input type="password" placeholder="........" />
          </label>
          <label>
            Confirm Password
            <input type="password" placeholder="........" />
          </label>
          <button type="submit">Create Account</button>
        </form>
        <div className="career-account-modal__footer">
          <span className="career-account-modal__lock" aria-hidden="true" />
          <b>Secure Login</b>
          <p>
            Already have an account? <a href="/login">Login</a>
          </p>
          <small>Your data is securely protected and encrypted.</small>
          <a href="/">Back to Home</a>
        </div>
      </div>
    </div>
  );
}
