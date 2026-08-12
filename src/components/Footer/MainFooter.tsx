import React from "react";
import { Link } from "react-router-dom";

// Import assets (adjust paths as needed)
const asset = (path: string) => `/assets/figma-exported/${path}`;

const MainFooter: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        {/* Brand Section */}
        <div className="footer__brand reveal-on-scroll is-visible" style={{ '--reveal-delay': '90ms' } as React.CSSProperties}>
          <img 
            className="footer__logo" 
            src={asset("rumax-footer-logo.svg")} 
            alt="Rumax" 
          />
          <div className="footer__cqc-rating">
            <img 
              className="footer__cqc" 
              src={asset("rumax-footer-cqc-badge.svg")} 
              alt="Care Quality Commission" 
            />
            <span>Overall: Good</span>
          </div>
        </div>

        {/* Footer Menus */}
        <div className="footer__menus">
          {/* Useful Links */}
          <nav className="reveal-on-scroll is-visible" style={{ '--reveal-delay': '135ms' } as React.CSSProperties}>
            <h2>Useful Links</h2>
            <Link to="/">Home</Link>
            <Link to="/about-us">About us</Link>
            <Link to="/careers">Careers</Link>
            <Link to="/contact-us">Contact Us</Link>
            <Link to="/domiciliary-and-personal-care">Domiciliary Care</Link>
            <Link to="/supported-living">Supported Living</Link>
            <Link to="/training-service">Training Services</Link>
          </nav>

          {/* Locations - Two Column */}
          <nav className="two-col reveal-on-scroll is-visible" style={{ '--reveal-delay': '180ms' } as React.CSSProperties}>
            <h2>Locations</h2>
            <Link className="footer-link--accent" to="/locations/rayleigh">Rayleigh</Link>
            <Link to="/locations/billericay">Billericay</Link>
            <Link className="footer-link--accent" to="/locations/rochford">Rochford</Link>
            <Link to="/locations/chelmsford">Chelmsford</Link>
            <Link className="footer-link--accent" to="/locations/leigh-on-sea">Leigh On Sea</Link>
            <Link to="/locations/maldon">Maldon</Link>
            <Link className="footer-link--accent" to="/locations/brentwood">Brentwood</Link>
            <Link to="/locations/rawreth">Rawreth</Link>
            <Link className="footer-link--accent" to="/locations/basildon">Basildon</Link>
            <Link to="/locations/eastwood">Eastwood</Link>
            <Link className="footer-link--accent" to="/locations/wickford">Wickford</Link>
            <Link to="/locations/southend-on-sea">Southend On Sea</Link>
            <Link to="/locations/hadleigh">Hadleigh</Link>
            <span aria-hidden="true"></span>
            <Link to="/locations/hullbridge">Hullbridge</Link>
            <span aria-hidden="true"></span>
            <Link to="/locations/pitsea">Pitsea</Link>
            <span aria-hidden="true"></span>
            <Link to="/locations/laindon">Laindon</Link>
            <span aria-hidden="true"></span>
          </nav>

          {/* Company Links */}
          <nav className="reveal-on-scroll is-visible" style={{ '--reveal-delay': '225ms' } as React.CSSProperties}>
            <h2>Company</h2>
            <Link to="/cookie-policy">GDPR</Link>
            <Link to="/gdpr-and-privacy">GDPR &amp; Privacy</Link>
            <Link to="/privacy-policy">Privacy &amp; Cookie Policy</Link>
      
          </nav>

          {/* Resources & Social */}
          <nav className="reveal-on-scroll is-visible" style={{ '--reveal-delay': '0ms' } as React.CSSProperties}>
            <h2>Resources</h2>
            <Link to="/self-assessment">Self Assessment</Link>
            <Link to="/care-calculator">Care Estimator</Link>
            <Link to="/complaints-concerns-feedback">Complaints, Concerns &amp; Feedback</Link>
            <Link to="/referral">Referral</Link>
            
            <h2 className="footer-social-title">Social Media</h2>
            <p>Follow Rumax Limited across Essex to get the latest updates.</p>
            <div className="footer-socials">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Facebook"
              >
                <img src={asset("rumax-footer-facebook.svg")} alt="" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Instagram"
              >
                <img src={asset("rumax-footer-instagram.svg")} alt="" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="LinkedIn"
              >
                <img src={asset("rumax-footer-linkedin.svg")} alt="" />
              </a>
              <a 
                href="https://x.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="X"
              >
                <img src={asset("rumax-footer-twitter.svg")} alt="" />
              </a>
            </div>
          </nav>
        </div>
      </div>

      {/* Footer Bottom */}
     <div className="container footer__bottom">
        <p>
          Copyright 2026 &copy; RUMAX LIMITED 2026, trading as RUMAX LIMITED, registered in England and Wales at Cornwallis
          House, Unit 2, Howard Chase, Basildon, Essex, SS14 3BB, United Kingdom Registered No: 7468421 ICO Registration Nr:
          ZA038243 "Your Care, Our Commitment"
        </p>
        <div className="footer-badges" aria-label="Rumax accreditation badges">
          <img src={asset("rumax-footer-eca.png")} alt="ECA" />
          <img src={asset("rumax-footer-cqc.png")} alt="CQC" />
          <img src={asset("rumax-footer-ico.png")} alt="ICO" />
          <img src={asset("rumax-footer-nhs.png")} alt="NHS" />
          <img src={asset("rumax-footer-iso.png")} alt="ISO" />
          <img src={asset("rumax-footer-cyber.png")} alt="Cyber Essentials" />
        </div>
      </div>
    </footer>
  );
};

export default MainFooter;