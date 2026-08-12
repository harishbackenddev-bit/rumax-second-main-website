import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu and dropdown when navigating
  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  // Helper to check if link is active
  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    setActiveDropdown(activeDropdown === 'services' ? null : 'services');
  };

  // Social media links with proper attributes
  const socialLinks = [
    { label: "Facebook", icon: "rumax-facebook.svg", url: "https://facebook.com" },
    { label: "Instagram", icon: "rumax-instagram.svg", url: "https://instagram.com" },
    { label: "LinkedIn", icon: "rumax-linkedin.svg", url: "https://linkedin.com" },
    { label: "X", icon: "rumax-twitter.svg", url: "https://x.com" },
  ];

  // Dropdown items for Services
  const dropdownItems = [
    { label: "Domiciliary Care/Personal Care Service", path: "/domiciliary-and-personal-care" },
    { label: "Supported Living Service", path: "/supported-living" },
    { label: "Training Service", path: "/training-service" },
  ];

  return (
    <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
      {/* Top Bar */}
      <div className="topbar">
        <div className="container topbar__inner">
          <div className="topbar__left">
            <img 
              src="/assets/figma-exported/rumax-location.svg" 
              alt="" 
              className="topbar-icon" 
              aria-hidden="true" 
            />
            <span>Basildon, Essex</span>
            <span className="divider"></span>
            <img 
              src="/assets/figma-exported/rumax-phone.svg" 
              alt="" 
              className="topbar-icon" 
              aria-hidden="true" 
            />
            <span>+44 3330115030 | +44 1268 293666</span>
          </div>
          <nav className="socials" aria-label="Social media">
            {socialLinks.map((social) => (
              <a 
                key={social.label}
                href={social.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label={social.label}
              >
                <img src={`/assets/figma-exported/${social.icon}`} alt="" />
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Navbar */}
      <div className="navbar">
        <div className="container navbar__inner">
          <Link className="brand" to="/" aria-label="Rumax home">
            <img src="/assets/figma-exported/rumax-logo-header.png" alt="Rumax" />
          </Link>

          <button 
            className={`menu-toggle ${isMobileMenuOpen ? 'active' : ''}`} 
            type="button" 
            aria-expanded={isMobileMenuOpen} 
            aria-controls="primary-nav"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
            <span className="sr-only">Open navigation</span>
          </button>

          <nav className={`primary-nav ${isMobileMenuOpen ? 'is-open' : ''}`} id="primary-nav" aria-label="Main navigation">
            <Link 
              to="/" 
              className={isActiveLink('/') ? 'active' : ''}
              onClick={handleLinkClick}
            >
              Home
            </Link>
            
            {/* Services with Dropdown */}
            <div className="nav-dropdown">
              <button 
                className="nav-dropdown__trigger nav-with-icon" 
                type="button" 
                aria-expanded={activeDropdown === 'services'} 
                aria-controls="services-menu"
                onClick={toggleDropdown}
              >
                Services
                <img 
                  src="/assets/figma-exported/rumax-nav-arrow.svg" 
                  alt="" 
                  aria-hidden="true"
                  style={{ 
                    transform: activeDropdown === 'services' ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease'
                  }}
                />
              </button>
              <div 
                className={`nav-dropdown__menu ${activeDropdown === 'services' ? 'open' : ''}`} 
                id="services-menu" 
                role="menu"
                style={{
                  display: activeDropdown === 'services' ? 'block' : 'none'
                }}
              >
                {dropdownItems.map((item) => (
                  <Link 
                    key={item.path}
                    to={item.path} 
                    role="menuitem" 
                    onClick={handleLinkClick}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <Link 
              to="/pricing-and-funding" 
              className={isActiveLink('/pricing-and-funding') ? 'active' : ''}
              onClick={handleLinkClick}
            >
              Funding &amp; Cost
            </Link>

            <Link 
              to="/about-us" 
              className={isActiveLink('/about-us') ? 'active' : ''}
              onClick={handleLinkClick}
            >
              About Us
            </Link>

            <Link 
              to="/careers" 
              className={isActiveLink('/careers') ? 'active' : ''}
              onClick={handleLinkClick}
            >
              Careers
            </Link>

            <Link 
              to="/contact-us" 
              className={isActiveLink('/contact-us') ? 'active' : ''}
              onClick={handleLinkClick}
            >
              Contact Us
            </Link>
          </nav>

          <Link className="login-btn" to="/contact-us" onClick={handleLinkClick}>
            Login
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;