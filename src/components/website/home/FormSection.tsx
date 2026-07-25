// components/sections/FormSection.tsx
import React, { useState } from "react";

const asset = (path: string) => `/images/${path}`;

const FormSection = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    workEmail: "",
    organisation: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add your form submission logic here
  };

  const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#12086F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 12L11 14L15 10" stroke="#12086F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const listItems = [
    "How to integrate ICH-OCP E6 (R3) effectively",
    "Navigating the April 2026 MHRA Reforms",
    "NMC Compliance Requirements for Home Nursing",
    "Logistics for AI-Home IMP Administration",
    "Case Studies from UK Hybrid Trials",
  ];

  return (
    <section className="hvs-section hvs-main-section">
      <div className="container">
        <div className="inner-hvs-sec1">
          <div className="hvs-content">
            <h2>The 2026 Guide To Navigating UK Decentralised Clinical Trials</h2>
            <p className="hvs-subtext">
              Master recent MHRA regulatory updates and ensures your hybrid
              trials are compliant, patient-centric, and operationally sound
            </p>
            <ul className="hvs-list">
              {listItems.map((item, index) => (
                <li key={index}>
                  <CheckIcon />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="right-side-form">
            <div className="hvs-visual img">
              <img src={asset("book.png")} alt="Guide Book" />
            </div>
            <div className="card">
              <h3>Get the Investigator Site Guide</h3>
              <form onSubmit={handleSubmit}>
                <div className="field">
                  <label htmlFor="fullName">
                    Full Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    placeholder="Dr. Sarah Thompson"
                    value={formData.fullName}
                    onChange={handleChange}
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
                    value={formData.workEmail}
                    onChange={handleChange}
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
                    value={formData.organisation}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button type="submit" className="trial-btn">
                  Get My Free Guide
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FormSection;