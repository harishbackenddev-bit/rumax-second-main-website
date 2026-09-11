import React, { useState, useEffect } from "react";
import "./CookieConsent.css";

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted/rejected
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setIsVisible(false);
  };

  const handleManage = () => {
    // Aap yahan apna manage cookies logic daal sakte ho (modal open etc.)
    alert("Manage Cookies clicked");
  };

  const handleClose = () => {
    localStorage.setItem("cookieConsent", "closed");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-consent-overlay">
      <div className="cookie-consent-box">
        {/* Close Button */}
        <button className="cookie-close-btn" onClick={handleClose}>
          &times;
        </button>

        {/* Title */}
        <h3 className="cookie-title">Cookie Consent</h3>

        {/* Message */}
        <p className="cookie-message">
          By clicking “Accept All Cookies”, you agree to the storing of cookies
          on your device to enhance site navigation, analyze site usage, and
          assist in our marketing efforts.{" "}
          <a href="/privacy-policy" className="cookie-privacy-link">
            Privacy policy
          </a>
        </p>

        {/* Buttons */}
        <div className="cookie-actions">
          <button className="cookie-manage-btn" onClick={handleManage}>
            Manage cookies
          </button>
          <button className="cookie-accept-btn" onClick={handleAccept}>
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;