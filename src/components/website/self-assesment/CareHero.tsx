// src/components/website/self-assesment/CareHero.tsx

import React from 'react';

interface CareHeroProps {
  onButtonClick?: () => void;
  className?: string;
}

const CareHero: React.FC<CareHeroProps> = ({ onButtonClick, className = '' }) => {
  return (
    <section className={`care-hero ${className}`}>
      <div className="care-hero__decor">
        <svg className="care-hero__decor-left" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M20 260C60 320 180 320 240 260C300 200 300 80 240 20"
            stroke="#ffffff"
            strokeWidth="26"
            strokeLinecap="round"
            opacity="0.5"
          />
        </svg>
        <svg className="care-hero__decor-right" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="70" stroke="#ffffff" strokeWidth="18" opacity="0.4" />
        </svg>
      </div>

      <div className="care-hero__inner">
        {/* Text column */}
        <div className="care-hero__text-col">
          <h2 className="care-hero__heading">
            <span className="care-hero__heading-line1">
              Is It Time for Home Care?
              <svg className="care-hero__scribble" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M4 16c3-2 5-6 5-10M9 6c2 3 5 8 5 12M14 18c2-1 4-4 5-7"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="care-hero__heading-line2">A Quick Readiness Assessment</span>
          </h2>

          <p className="care-hero__text">
            Figuring out if a loved one needs help at home can be overwhelming. This quick
            assessment focuses on everyday safety, well-being, and Activities of Daily Living (ADLs) to
            help you understand their current needs.
          </p>

          <div className="care-hero__cta-wrap">
            {/* <span className="care-hero__badge">R</span> */}
            <button 
              type="button" 
              className="care-hero__button" 
              onClick={onButtonClick}
              aria-label="Start the home care readiness assessment"
            >
              Is It Time For Care?
            </button>
          </div>
        </div>

        {/* Image column */}
        <div className="care-hero__image-wrap">
          <img
            className="care-hero__image"
            src="/images/Background.jpg"
            alt="Caregiver assisting an elderly man with a meal"
          />
        </div>
      </div>
    </section>
  );
};

export default CareHero;