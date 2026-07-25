// src/routes/AppRoutes.tsx
import { Routes, Route } from "react-router-dom";

// Layouts
import WebsiteLayout from "@/layouts/WebsiteLayout";
import AuthLayout from "@/layouts/AuthLayout";

// Website Pages
import Home from "@/pages/website/Home";
import Investigator from "@/pages/website/services/Investigator";
import Careers from "@/pages/website/Careers/Careers";
import ContactUs from "@/pages/website/ContactUs/ContactPage";
import PrivacyPolicy from "@/pages/website/PrivacyPolicy/PrivacyPolicyPage";
import CookiePolicy from "@/pages/website/CookiePolicy/CookiePolicyPage";
import GDPR from "@/pages/website/GDPR/GdprPrivacyPage";
import Clinical from "@/pages/website/services/Clinical";
import Globalvendors from "@/pages/website/partners/globalvendors";
import CroSponsors from "@/pages/website/partners/crossponsors";
import AboutUs from "@/pages/website/AboutUs/AboutUs";
import Investigatorsites from "@/pages/website/partners/investigatorsites";

const AppRoutes = () => {
  return (
    <Routes>
      {/* WEBSITE - Public */}
      <Route path="/" element={<WebsiteLayout />}>
        {/* Main Pages */}
        <Route index element={<Home />} />
        <Route path="about-us" element={<AboutUs />} />
        <Route path="/investigator-trial-location-support-service" element={<Investigator />} />
         <Route path="/clinical-trials-homecare-services" element={<Clinical />} />
        <Route path="careers" element={<Careers />} />
        <Route path="contact-us" element={<ContactUs />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="cookie-policy" element={<CookiePolicy />} />
        <Route path="gdpr-and-privacy" element={<GDPR />} />
        <Route path="partners/global-vendors" element={<Globalvendors />} />
        <Route path="partners/cros-sponsors" element={<CroSponsors />} />
         <Route path="partners/investigator-sites" element={<Investigatorsites />} />
         <Route path="partners" element={<Globalvendors />} />
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