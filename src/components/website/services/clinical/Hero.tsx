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
  title = "Clinical Trials Homecare Services",
  description = "Professional mobile nursing services for clinical trials and research studies across the UK",
  imageSrc = "/images/service-img.png",
}) => {
  return (
    <section className="hero service--main">
      <div className="container">
        <div className="inner-service">
          <div className="hero-content">
            <h1>{title}</h1>
            <p>{description}</p>
          </div>

          <div className="card">
            <div className="head-card-top">
              <h3>Request a Callback</h3>
            
            
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
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="workEmail">
                  Phone Number <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="workEmail"
                  name="workEmail"
                  placeholder="Enter Phone Number"
                  required
                />
              </div>
              <button type="submit" className="trial-btn">
                Request a Callback
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;