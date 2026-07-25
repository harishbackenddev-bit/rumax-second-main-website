import React from "react";

const ServiceOfferingBlock = () => {
  const services = [
    "In-home and remote study-visit delivery by experienced research nurses, including visit windows aligned to protocol schedules.",
    "Investigational medicinal product (IMP) administration, including injectable and infusion support, within delegated authority and site oversight.",
    "Sample collection, processing, and onward handling coordinated with central and local laboratories.",
    "Vital signs, ECG, and protocol-specified clinical assessments, with source documentation completed to GCP standards.",
    "Support for complex and specialist protocols, including controlled-substance studies, with appropriate governance and chain-of-custody controls.",
    "National coverage with a single contracting and oversight point, reducing the sponsor's vendor-management burden.",
  ];

  return (
    <section className="ServiceOfferingBlock">
      {/* LEFT */}
      <div className="ServiceOfferingBlock-left">
        <span className="ServiceOfferingBlock-pill">
          Our Service Offering
        </span>

        <h1 className="ServiceOfferingBlock-title">
          Taking Protocol-Defined Activity Out Of The Site And Into The Home.
        </h1>

        <p className="ServiceOfferingBlock-description">
          Rumax provides GCP-compliant clinical-trials homecare nursing across
          England and Wales, enabling sponsors and CROs to take
          protocol-defined activity out of the site and into the participant's
          home. Our service is designed to improve recruitment, retention, and
          the participant experience without compromising data integrity or
          oversight.
        </p>


      </div>

      {/* RIGHT */}
      <div className="ServiceOfferingBlock-right">
        {services.map((service, index) => (
          <div className="ServiceOfferingBlock-card" key={index}>
            <span className="ServiceOfferingBlock-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>

            <p>{service}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServiceOfferingBlock;