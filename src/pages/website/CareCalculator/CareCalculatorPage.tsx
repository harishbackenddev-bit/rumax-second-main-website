import React from "react";
import { InnerHero, PageShell} from "@/components/pages/InnerPages";
import CareCostCalculator from '@/components/website/carecalculator/CareCostCalculator';


const CareCalculatorPage: React.FC = () => {
  return (
    <PageShell>
      <div className="about-page">
        <InnerHero
          eyebrow=""
          title="Care Estimator"
          description="Understand your care options in under 60 seconds"
          backgroundImage="rumax-team-hero.png"
        />
        
          <CareCostCalculator />
        
      </div>
    </PageShell>
  );
};

export default CareCalculatorPage;