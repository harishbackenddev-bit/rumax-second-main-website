// src/components/website/gdpr/GDPRPage.tsx

import React from 'react';
import './../GDPR/GDPRPage.css';
import { InnerHero, PageShell, PolicyArticle } from "@/components/pages/InnerPages";

const cookieTypes: Array<[string, string]> = [];

cookieTypes.push([
  "Right to Access",
  "You have the right to access or rectify the information we hold about you. We will process your request within one month of receipt."
]);

cookieTypes.push([
  "Right to Object",
  "You have the right to withdraw your consent to the processing of your personal data at any time."
]);

cookieTypes.push([
  "Right to Data Portability",
  "You can request that your information be transmitted directly to another data controller."
]);

cookieTypes.push([
  "Right to Erasure",
  "You can request that your information is deleted or restrict/object to the processing of your information."
]);


interface RightsCardProps {
  number: string;
  icon: string;
  title: string;
  description: string;
  className: string;
}

const RightsCard: React.FC<RightsCardProps> = ({ number, icon, title, description, className }) => {
  return (
    <div className={`rights-card rights-card--${className}`}>
      <span className="rights-card__num">{number}</span>
      <div className="rights-card__icon">{icon}</div>
      <div>
        <p className="rights-card__title">{title}</p>
        <p className="rights-card__desc">{description}</p>
      </div>
    </div>
  );
};

const GDPRPage: React.FC = () => {
  return (
    <div className="gdpr-page">

      <InnerHero
        eyebrow=""
        title="Privacy & cookie policy"
        description="We are committed to protecting privacy and complying with UK GDPR and data protection legislation."
        backgroundImage="gdpr.png"
      />

      {/* Meta bar */}
      <div className="gdpr-page__meta">
        <span>Last Reviewed: 02/03/2023</span>
        <span>Last Amended: 02/03/2023</span>
      </div>

      {/* Main content */}
      <div className="gdpr-page__content">
        <div className="gdpr-page__box">
          <h2 className="gdpr-page__h2">Who We Are</h2>
          <p className="gdpr-page__p">
            We are RUMAX LIMITED, a company incorporated in England and Wales. Our registered address is:
          </p>
          <address className="gdpr-page__address">
            Cornwallis House, Unit 2, Howard Chase
            <br />
            Basildon, Essex, SS14 3BB
            <br />
            United Kingdom
            <br />
            <br />
            Phone: 03330115030
          </address>

          <hr className="gdpr-page__hr" />
          <p className="gdpr-page__meta-inline">Last Reviewed: 02/03/2023</p>
          <p className="gdpr-page__meta-inline">Last Amended: 02/03/2023</p>

          <p className="gdpr-page__p" style={{ marginTop: '18px' }}>
            We are committed to ensuring that your privacy is protected. We comply with the UK General Data
            Protection Regulation ("UK GDPR") and all national implementing laws, regulations and secondary
            legislation as amended or updated from time to time in the UK ("Data Protection Legislation").
            We are the data controller of data you pass to us pursuant to this policy.
          </p>
          <p className="gdpr-page__p">
            This Privacy Policy sets out how we collect personal information from you and how the personal
            information you provide will be processed by us. By visiting our website at www.rumax.co.uk,
            you are accepting and consenting to the practices described in this Privacy Policy. If you do
            not consent, please do not submit any personal data to us.
          </p>

          <h3 className="gdpr-page__h3">Information You Give RUMAX LIMITED</h3>
          <p className="gdpr-page__p">
            You may give us information about you by completing enquiry forms on the website or by requesting
            marketing information. The information you give us may include:
          </p>
          <ul className="gdpr-page__list">
            <li>Your name</li>
            <li>Email address</li>
            <li>Address/location</li>
            <li>Phone number</li>
          </ul>
          <p className="gdpr-page__p">
            We will retain this information while we are corresponding with you or providing services to you
            or to a service user you represent.
          </p>

          <h3 className="gdpr-page__h3">Information RUMAX LIMITED Collects About You</h3>
          <p className="gdpr-page__p">We may collect the following information when you visit our website:</p>
          <ul className="gdpr-page__list">
            <li>
              <strong>Technical information:</strong> IP address, login information, browser type and version,
              time zone setting, browser plug-in types and versions, operating system and platform
            </li>
            <li>
              <strong>Visit information:</strong> Full URLs, clickstream data, products viewed or searched for,
              page response times, website errors, length of visits, page interaction information, and methods
              used to browse away from the page
            </li>
          </ul>

          <h3 className="gdpr-page__h3">Cookies</h3>
          <p className="gdpr-page__p">
            The website uses cookies to distinguish you from other users of the website. For detailed
            information on the cookies we use and the purposes for which we use them, please see our{' '}
            <a href="/cookie-policy" className="gdpr-page__link">Cookie Policy</a>.
          </p>

          <h3 className="gdpr-page__h3">Use Made Of The Information</h3>
          <p className="gdpr-page__p">
            We may use the information we receive and/or collect about you to:
          </p>
          <ul className="gdpr-page__list">
            <li>Fulfil our obligations under any contract with you or a service user you represent</li>
            <li>Send you newsletters and marketing information if you have consented</li>
            <li>Notify you of products and services that may interest you</li>
            <li>Monitor website usage and provide statistics for improving our services</li>
          </ul>

          <h3 className="gdpr-page__h3">Legitimate Business Purposes</h3>
          <p className="gdpr-page__p">
            RUMAX LIMITED processes personal information for certain legitimate business purposes, which include:
          </p>
          <ul className="gdpr-page__list">
            <li>Enhancing, modifying, personalising or improving our services and communications</li>
            <li>Identifying and preventing fraud</li>
            <li>Enhancing the security of our network and information systems</li>
            <li>Understanding how people interact with our websites</li>
            <li>Administering the website and carrying out data analysis, troubleshooting and testing</li>
            <li>Determining the effectiveness of promotional campaigns and advertising</li>
          </ul>

          <h3 className="gdpr-page__h3">How Safe Is Your Information?</h3>
          <div className="gdpr-page__callout">
            <div className="gdpr-page__callout-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 14C0 6.26801 6.26801 0 14 0H34C41.732 0 48 6.26801 48 14V34C48 41.732 41.732 48 34 48H14C6.26801 48 0 41.732 0 34V14Z" fill="url(#paint0_linear_8375_887)" />
                <path d="M31 23H17C15.8954 23 15 23.8954 15 25V32C15 33.1046 15.8954 34 17 34H31C32.1046 34 33 33.1046 33 32V25C33 23.8954 32.1046 23 31 23Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M19 23V19C19 17.6739 19.5268 16.4021 20.4645 15.4645C21.4021 14.5268 22.6739 14 24 14C25.3261 14 26.5979 14.5268 27.5355 15.4645C28.4732 16.4021 29 17.6739 29 19V23" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <defs>
                  <linearGradient id="paint0_linear_8375_887" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#1B2280" />
                    <stop offset="0.0714286" stop-color="#222280" />
                    <stop offset="0.142857" stop-color="#282380" />
                    <stop offset="0.214286" stop-color="#2D2380" />
                    <stop offset="0.285714" stop-color="#322380" />
                    <stop offset="0.357143" stop-color="#372380" />
                    <stop offset="0.428571" stop-color="#3C2280" />
                    <stop offset="0.5" stop-color="#412280" />
                    <stop offset="0.571429" stop-color="#452180" />
                    <stop offset="0.642857" stop-color="#4A2180" />
                    <stop offset="0.714286" stop-color="#4E2080" />
                    <stop offset="0.785714" stop-color="#531F80" />
                    <stop offset="0.857143" stop-color="#571E80" />
                    <stop offset="0.928571" stop-color="#5C1D80" />
                    <stop offset="1" stop-color="#601B80" />
                  </linearGradient>
                </defs>
              </svg>

            </div>
            <div>
              <p>
                Protecting your security and privacy is important to us and we make every effort to secure your
                information and maintain your confidentiality in accordance with Data Protection Legislation.
              </p>
              <p>
                The website is protected by various levels of security technology, which are designed to protect
                your information from any unauthorised or unlawful access, processing, accidental loss,
                destruction and damage.
              </p>
              <p>
                Where we have given you (or where you have chosen) a password which enables you to access certain
                parts of the website, you are responsible for keeping this password confidential. We ask you not
                to share a password with anyone.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Your Rights section */}
      <section className="cookie-types-band">
        <div className="cookie-types-band__inner">
          <h2>Your Rights in Respect of Your Data</h2>
          <div className="cookie-type-grid">
            {cookieTypes.map(([title, body], index) => (
              <article className="cookie-type-card" key={title}>
                <span className={`cookie-type-card__icon cookie-type-card__icon--${index + 1}`} aria-hidden="true" />
                <span className="cookie-type-card__number">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>


        <div className="gdpr-page__marketing">
          <h3>Marketing Preferences</h3>
          <p className="gdpr-page__p">
            If you wish to have your information removed from our database or if you do not want us to contact
            you for marketing purposes, please click the "Unsubscribe" option in any email we send to you or
            contact us directly.
          </p>
          <p className="gdpr-page__p">
            We will not share, sell or distribute any of the information you provide to us (other than as set
            out in this policy) without your prior consent, unless required to do so by law.
          </p>
        </div>

      </section>

      {/* Third Party Sites */}
      <section className="gdpr-page__section">
        <h3 className="gdpr-page__h3" style={{ marginTop: 0 }}>Third Party Sites</h3>
        <p className="gdpr-page__p">
          Our website may contain links to third party websites, including websites via which you are able to
          purchase products and services. They are provided for your convenience only and we do not check,
          endorse, approve or agree with such third-party websites nor the products and/or services offered
          and sold on them.
        </p>
        <p className="gdpr-page__p">
          We have no responsibility for the content, product and/or services of the linked websites. Please
          ensure that you review all terms and conditions of website use and the Privacy Policy of any such
          third-party websites before use and before you submit any personal data to those websites.
        </p>

        <h3 className="gdpr-page__h3">Complaints &amp; Supervisory Authority</h3>
        <p className="gdpr-page__p">
          If you have any complaints about our use of your personal data, please contact us. You also have
          the right to complain to the relevant supervisory authority in your jurisdiction.
        </p>
        <p className="gdpr-page__p">
          In the UK, the supervisory authority is the Information Commissioner's Office (ICO).
          <br />
          <a className="gdpr-page__link" href="https://ico.org.uk" target="_blank" rel="noopener noreferrer">
            Visit ICO Website ↗
          </a>
        </p>
      </section>
    </div>
  );
};

export default GDPRPage;