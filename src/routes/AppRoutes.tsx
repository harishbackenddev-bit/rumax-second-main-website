// src/routes/AppRoutes.tsx
import { Routes, Route } from "react-router-dom";

// Layouts
import WebsiteLayout from "@/layouts/WebsiteLayout";
import AuthLayout from "@/layouts/AuthLayout";

// Website Pages
import Home from "@/pages/website/Home";
import AboutUs from "@/pages/website/AboutUs/AboutUs";
import Careers from "@/pages/website/Careers/Careers";
import CareerDetail from "@/pages/website/Careers/Details";
import ApplyJob from "@/pages/website/Careers/ApplyJob";
import ContactUs from "@/pages/website/ContactUs/ContactPage";
import DomiciliaryCare from "@/pages/website/DomiciliaryCare/DomiciliaryCarePage";
import SupportedLiving from "@/pages/website/SupportedLiving/SupportedLivingPage";
import TrainingServices from "@/pages/website/TrainingServices/TrainingServicePage";
import PricingAndFunding from "@/pages/website/PricingAndFunding/PricingAndFundingPage";

// Legal Pages
import PrivacyPolicy from "@/pages/website/PrivacyPolicy/PrivacyPolicyPage";
// import TermsAndConditions from "@/pages/website/TermsAndConditions";
import CookiePolicy from "@/pages/website/CookiePolicy/CookiePolicyPage";
import GDPR from "@/pages/website/GDPR/GdprPrivacyPage";
// import SiteNotice from "@/pages/website/SiteNotice";

// Resource Pages
// import FAQ from "@/pages/website/FAQ";
// import Blog from "@/pages/website/Blog";
// import News from "@/pages/website/News";
import SelfAssessment from "@/pages/website/SelfAssessment/SelfAssessmentPage";
import CareCalculator from "@/pages/website/CareCalculator/CareCalculatorPage";
import ComplaintsFeedback from "@/pages/website/ComplaintsFeedback/FeedbackPage";
import Referral from "@/pages/website/Referral/ReferralPage";

// Location Pages (You can create a dynamic route or individual pages)
import Locations from "@/pages/website/Locations/LocationsPage";
import LocationDetails from "@/pages/website/Locations/LocationDetails";

const AppRoutes = () => {
  return (
    <Routes>
      {/* WEBSITE - Public */}
      <Route path="/" element={<WebsiteLayout />}>
        {/* Main Pages */}
        <Route index element={<Home />} />
        <Route path="about-us" element={<AboutUs />} />
        <Route path="careers" element={<Careers />} />
          <Route path="careers/:id" element={<CareerDetail />} />
           <Route path="/apply/:jobId" element={<ApplyJob />} />
        <Route path="contact-us" element={<ContactUs />} />
        {/* <Route path="services" element={<Services />} /> */}
        <Route path="pricing-and-funding" element={<PricingAndFunding />} />
        
        {/* Service Pages */}
        <Route path="domiciliary-and-personal-care" element={<DomiciliaryCare />} />
        <Route path="supported-living" element={<SupportedLiving />} />
        <Route path="training-service" element={<TrainingServices />} />
        
        {/* Legal Pages */}
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        {/* <Route path="terms-and-conditions" element={<TermsAndConditions />} /> */}
        <Route path="cookie-policy" element={<CookiePolicy />} />
        <Route path="gdpr-and-privacy" element={<GDPR />} />
        {/* <Route path="site-notice" element={<SiteNotice />} /> */}
        
        {/* Resource Pages */}
        {/* <Route path="faq" element={<FAQ />} />
        <Route path="blog" element={<Blog />} />
        <Route path="news" element={<News />} /> */}
        <Route path="self-assessment" element={<SelfAssessment />} />
        <Route path="care-calculator" element={<CareCalculator />} />
        <Route path="complaints-concerns-feedback" element={<ComplaintsFeedback />} />
        <Route path="referral" element={<Referral />} />
        
        {/* Locations */}
        <Route path="locations" element={<Locations />} />
        
        {/* Dynamic Location Pages (Optional) */}
        <Route path="locations/:city" element={<LocationDetails />} />
      </Route>

      {/* AUTH - Public */}
      <Route path="/auth" element={<AuthLayout />}>
        {/* Add auth routes here */}
      </Route>

      {/* 404 - Not Found */}
      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;