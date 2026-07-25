// components/website/investigator/Hero.tsx
import React from "react";

interface HeroProps {
  title?: string;
  description?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  imageSrc?: string;
}

const Hero: React.FC<HeroProps> = ({
  title = "Investigator Trial Location Support Service",
  description = "Seamlessly extend your clinical trial capabilities with Rumax's mobile research nurses and site support services — ensuring compliance, efficiency, and patient-centric care.",
  primaryButtonText = "Get Started",
  secondaryButtonText = "Work For Us",
  imageSrc = "/images/service-img.png",
}) => {
  return (
    <section className="hero service--main">
      <div className="container">
        <div className="inner-service">
          <div className="hero-content">
            <h1>{title}</h1>
            <p>{description}</p>
            <div className="hero-buttons">
              <a href="#" className="btn primary">
                {primaryButtonText}
              </a>
              <a href="#" className="btn secondary">
                {secondaryButtonText}
              </a>
            </div>
          </div>

          <div className="card">
            <div className="head-card-top">
              <h3>Get the Investigator Site Guide</h3>
              <img src={imageSrc} alt="" />
            </div>
            <form>
              <div className="field">
                <label htmlFor="fullName">
                  Full Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  placeholder="Dr. Sarah Thompson"
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="workEmail">
                  Work Email <span className="required">*</span>
                </label>
                <input
                  type="email"
                  id="workEmail"
                  name="workEmail"
                  placeholder="sarah.thompson@hospital.nhs.uk"
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="organisation">
                  Organisation <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="organisation"
                  name="organisation"
                  placeholder="University Hospital Trust"
                  required
                />
              </div>
              <button type="submit" className="trial-btn">
                Download Investigator Guide Book Now
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;