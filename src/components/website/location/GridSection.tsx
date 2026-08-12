// components/website/investigator/GridSection.tsx
import React from "react";

interface GridItem {
  icon: string;
  title: string;
  description: string;
}

interface GridSectionProps {
  title?: string;
  description?: string;
  items?: GridItem[];
  bgClass?: string;
  buttonText?: string;
  buttonLink?: string;
}

const GridSection: React.FC<GridSectionProps> = ({
  title = "Our Mobile Research Nurse Capabilities",
  description = "",
  items = [],
  bgClass = "",
  buttonText = "Discuss your care options with our Brentwood team",
  buttonLink = "#",
}) => {
  const defaultItems = [
    {
      icon: "/images/logo1.png",
      title: "Patient Screening & Recruitment Support",
      description:
        "Our nurses assist with community-based pre-screening, medical record review, and home-based eligibility assessments. This helps expand your recruitment pool and accelerate enrolment without adding burden to your site staff.",
    }
  ];

  const gridItems = items.length > 0 ? items : defaultItems;

  return (
    <section className={`page-main-custom page-section grid-service ${bgClass}`}>
      <div className="container">
        <div className="page-section__heading">
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <div className="info-grid info-grid--four">
          {gridItems.map((item, index) => (
            <article className="info-card" key={index}>
              <div className="bottom-grid-area">
                <div className="info-card__icon info-card__icon--blue">
                  <img src={item.icon} alt="" />
                </div>
                <div className="h3-bottom">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            </article>
          ))}

          {buttonText && (
            <div className="grid-service__button">
              <a href={buttonLink}>
                {buttonText}
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default GridSection;