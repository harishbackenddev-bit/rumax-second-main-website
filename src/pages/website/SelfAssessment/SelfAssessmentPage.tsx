// src/pages/SelfAssessmentPage.tsx

import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SelfAssessmentPage from '@/components/website/self-assesment/CareHero';
import CareReadinessTool from '@/components/website/self-assesment/CareReadinessTool';

const SelfAssessmentMainPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const showForm = searchParams.get('form') === 'true';

  const handleStartAssessment = () => {
    navigate('/self-assessment?form=true');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHero = () => {
    navigate('/self-assessment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="self-assessment-page">
      {!showForm && (
        <div className="view hero-view">
          <SelfAssessmentPage onButtonClick={handleStartAssessment} />
        </div>
      )}

      {showForm && (
        <div className="view form-view">
          <div className="form-container">

            <CareReadinessTool />
          </div>
        </div>
      )}
    </div>
  );
};

export default SelfAssessmentMainPage;