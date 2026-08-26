// src/components/website/pricing/CareCostCalculator.tsx

import React, { useState, useRef, useEffect } from 'react';
import './CareCostCalculator.css';
import axios from "axios";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  postcode: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  postcode?: string;
}

const CareCostCalculator: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showResults, setShowResults] = useState<boolean>(false);
  
  // Slider states
  const [frequency, setFrequency] = useState<number>(0);
  const [personalCare, setPersonalCare] = useState<number>(2);
  const [mobility, setMobility] = useState<number>(2);
  
  // Toggle states
  const [dementiaCare, setDementiaCare] = useState<boolean>(false);
  const [palliativeCare, setPalliativeCare] = useState<boolean>(false);
  const [neurologicalSupport, setNeurologicalSupport] = useState<boolean>(false);
  
  // Form states
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    postcode: ''
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  
  const sectionRef = useRef<HTMLDivElement>(null);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  // Slider value labels
  const frequencyLabels = ['Just a few hours (1-5 hrs)', 'Daily Visits', 'Overnight Support', 'Full Live-in Care'];
  const personalCareLabels = ['Companionship & Housekeeping', 'Help with Washing & Dressing', 'Complete/Medical Administration'];
  const mobilityLabels = ['Fully Independent', 'Needs Steadying/Walking Aids', 'Requires Hoisting/Two Carers'];

  const goToStep = (stepNum: number) => {
    setCurrentStep(stepNum);
    if (sectionRef.current) {
      const yOffset = -20;
      const y = sectionRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const getSliderFill = (value: number, min: number, max: number): string => {
    return `${((value - min) / (max - min)) * 100}%`;
  };

  const getFrequencyLabel = (value: number): string => {
    return frequencyLabels[value] || frequencyLabels[0];
  };

  const getPersonalCareLabel = (value: number): string => {
    return personalCareLabels[value] || personalCareLabels[0];
  };

  const getMobilityLabel = (value: number): string => {
    return mobilityLabels[value] || mobilityLabels[0];
  };

  const getEstimatedCost = (): string => {
    let baseCost = 350;
    
    // Frequency multiplier
    const frequencyMultipliers = [1, 1.3, 1.8, 2.5];
    baseCost *= frequencyMultipliers[frequency];
    
    // Personal care multiplier
    const personalCareMultipliers = [0.8, 1.2, 1.6];
    baseCost *= personalCareMultipliers[personalCare];
    
    // Mobility multiplier
    const mobilityMultipliers = [0.9, 1.2, 1.5];
    baseCost *= mobilityMultipliers[mobility];
    
    // Specialist care add-ons
    if (dementiaCare) baseCost *= 1.2;
    if (palliativeCare) baseCost *= 1.3;
    if (neurologicalSupport) baseCost *= 1.25;
    
    const minCost = Math.round(baseCost * 0.9);
    const maxCost = Math.round(baseCost * 1.2);
    
    return `£${minCost} - £${maxCost}`;
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    let isValid = true;

    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
      isValid = false;
    } else if (formData.fullName.trim().length < 2) {
      errors.fullName = 'Full name must be at least 2 characters';
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
      isValid = false;
    } else if (!/^[\d\s\-+()]{10,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = 'Please enter a valid phone number (10-15 digits)';
      isValid = false;
    }

    if (!formData.postcode.trim()) {
      errors.postcode = 'Postcode is required';
      isValid = false;
    } else if (!/^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i.test(formData.postcode.trim())) {
      errors.postcode = 'Please enter a valid UK postcode';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const fieldMap: Record<string, string> = {
      'cc-full-name': 'fullName',
      'cc-email': 'email',
      'cc-phone': 'phone',
      'cc-postcode': 'postcode'
    };
    const fieldName = fieldMap[id] || id;
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    if (formErrors[fieldName as keyof FormErrors]) {
      setFormErrors(prev => ({ ...prev, [fieldName]: '' }));
    }
    if (submitError) setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      const firstError = document.querySelector('.cc-input.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        postcode: formData.postcode.trim().toUpperCase(),
        careFrequency: frequencyLabels[frequency],
        personalCareLevel: personalCareLabels[personalCare],
        mobilityLevel: mobilityLabels[mobility],
        specialistCare: {
          dementia: dementiaCare,
          palliative: palliativeCare,
          neurological: neurologicalSupport
        },
        estimatedCost: getEstimatedCost(),
        source: "care-cost-calculator",
        formName: "Care Cost Calculator"
      };

      const response = await axios.post(
        `${API_URL}/api/website/care-cost/save`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        setSubmitSuccess(true);
        setShowResults(true);
        // Hide results after showing
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 5000);
      } else {
        setSubmitError(response.data.message || "Failed to submit");
      }
    } catch (err: any) {
      console.error("Error submitting:", err);
      setSubmitError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackHome = () => {
    setShowResults(false);
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderStepper = () => (
    <div className="cc-stepper">
      <div className={`cc-stepper__step ${currentStep >= 1 ? 'cc-stepper__step--active' : ''}`}>
        <div className="cc-stepper__circle">1</div>
        <span className="cc-stepper__label">Care Estimate</span>
      </div>
      <div className={`cc-stepper__line ${currentStep > 1 ? 'cc-stepper__line--fill' : ''}`}></div>
      <div className={`cc-stepper__step ${currentStep === 2 ? 'cc-stepper__step--active' : ''}`}>
        <div className="cc-stepper__circle">2</div>
        <span className="cc-stepper__label">Personal Info</span>
      </div>
    </div>
  );

  return (
    <section className="care-calc" ref={sectionRef}>
      {/* Header */}
      <div className="care-calc__header">
        <h2 className="care-calc__title">
          <img src="/assets/figma-exported/rumax-services-mark.svg" alt="" className="section-mark section-mark--services" aria-hidden="true"></img>
          Understand Your Care Options In Under 60 Seconds</h2>
        <p className="care-calc__subtitle">
          We know navigating home care can feel overwhelming. Use our interactive calculator below to share a little about
          your loved one's current situation. Adjust the sliders to get a transparent, instant estimate of weekly care costs.
        </p>
      </div>

      {/* Stepper */}
      {!showResults && renderStepper()}

      <div className="care-calc__panel">
        {!showResults ? (
          <>
            {/* SCREEN 1: Care estimate sliders */}
            <div className={`care-calc__screen ${currentStep === 1 ? 'care-calc__screen--active' : ''}`}>
              <p className="cc-panel-title">Your Interactive Care Estimate</p>

              <div className="cc-slider-block">
                <p className="cc-slider-block__label">Care Frequency (Hours per Week)</p>
                <p className="cc-slider-block__hint">How often do you feel support is needed?</p>
                <input
                  type="range"
                  className="cc-slider"
                  min="0"
                  max="3"
                  step="1"
                  value={frequency}
                  onChange={(e) => setFrequency(Number(e.target.value))}
                  style={{ '--fill': getSliderFill(frequency, 0, 3) } as React.CSSProperties}
                />
                <p className="cc-slider-block__selected">{getFrequencyLabel(frequency)}</p>
                <div className="cc-slider-block__ticks">
                  <span className="cc-slider-block__tick">Just a few hours<br />(1-5 hrs)</span>
                  <span className="cc-slider-block__tick">Daily Visits</span>
                  <span className="cc-slider-block__tick">Overnight Support</span>
                  <span className="cc-slider-block__tick">Full Live-in Care</span>
                </div>
              </div>

              <div className="cc-slider-block">
                <p className="cc-slider-block__label">Level of Personal Care Needed</p>
                <p className="cc-slider-block__hint">What level of daily assistance is required?</p>
                <input
                  type="range"
                  className="cc-slider"
                  min="0"
                  max="2"
                  step="1"
                  value={personalCare}
                  onChange={(e) => setPersonalCare(Number(e.target.value))}
                  style={{ '--fill': getSliderFill(personalCare, 0, 2) } as React.CSSProperties}
                />
                <p className="cc-slider-block__selected">{getPersonalCareLabel(personalCare)}</p>
                <div className="cc-slider-block__ticks">
                  <span className="cc-slider-block__tick">Companionship<br />&amp; Housekeeping</span>
                  <span className="cc-slider-block__tick">Help with Washing<br />&amp; Dressing</span>
                  <span className="cc-slider-block__tick">Complete/Medical<br />Administration</span>
                </div>
              </div>

              <div className="cc-slider-block">
                <p className="cc-slider-block__label">Mobility Assistance</p>
                <p className="cc-slider-block__hint">How is their current mobility?</p>
                <input
                  type="range"
                  className="cc-slider"
                  min="0"
                  max="2"
                  step="1"
                  value={mobility}
                  onChange={(e) => setMobility(Number(e.target.value))}
                  style={{ '--fill': getSliderFill(mobility, 0, 2) } as React.CSSProperties}
                />
                <p className="cc-slider-block__selected">{getMobilityLabel(mobility)}</p>
                <div className="cc-slider-block__ticks">
                  <span className="cc-slider-block__tick">Fully Independent</span>
                  <span className="cc-slider-block__tick">Needs Steadying/<br />Walking Aids</span>
                  <span className="cc-slider-block__tick">Requires Hoisting/<br />Two Carers</span>
                </div>
              </div>

              <p className="cc-toggles-label">Specialist Support (select any that apply):</p>
              <div className="cc-toggles">
                <label className="cc-toggle">
                  Dementia Care
                  <span className="cc-switch">
                    <input type="checkbox" checked={dementiaCare} onChange={(e) => setDementiaCare(e.target.checked)} />
                    <span className="cc-switch__track"></span>
                  </span>
                </label>
                <label className="cc-toggle">
                  Palliative Care
                  <span className="cc-switch">
                    <input type="checkbox" checked={palliativeCare} onChange={(e) => setPalliativeCare(e.target.checked)} />
                    <span className="cc-switch__track"></span>
                  </span>
                </label>
                <label className="cc-toggle">
                  Neurological Support
                  <span className="cc-switch">
                    <input type="checkbox" checked={neurologicalSupport} onChange={(e) => setNeurologicalSupport(e.target.checked)} />
                    <span className="cc-switch__track"></span>
                  </span>
                </label>
              </div>

              <div className="cc-cta-row">
                <div className="cc-cta-wrap">
                  <button type="button" className="btn btn--primary" onClick={() => goToStep(2)}>
                    Get Your Estimate
                  </button>
  
                </div>
              </div>
            </div>

            {/* SCREEN 2: Personal info form */}
            <div className={`care-calc__screen ${currentStep === 2 ? 'care-calc__screen--active' : ''}`}>
              <p className="cc-panel-title">Your Estimate Is Ready</p>
              <p className="cc-panel-sub">Enter your details to receive your personalized care estimate</p>

              {/* Success Message */}
              {submitSuccess && (
                <div className="success-message" style={{
                  background: "#d4edda",
                  color: "#155724",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  marginBottom: "16px",
                  border: "1px solid #c3e6cb"
                }}>
                  ✅ Thank you! Your estimate has been submitted successfully.
                </div>
              )}

              {/* Error Message */}
              {submitError && (
                <div className="error-message" style={{
                  background: "#f8d7da",
                  color: "#721c24",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  marginBottom: "16px",
                  border: "1px solid #f5c6cb"
                }}>
                  ❌ {submitError}
                </div>
              )}

              <form id="cc-personal-form" onSubmit={handleSubmit}>
                <div className="cc-form-row">
                  <div className="cc-field">
                    <label className="cc-field__label" htmlFor="cc-full-name">
                      Full Name<span className="cc-required">*</span>
                    </label>
                    <input
                      className={`cc-input ${formErrors.fullName ? 'error' : ''}`}
                      type="text"
                      id="cc-full-name"
                      placeholder="Enter Full Name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      style={formErrors.fullName ? { borderColor: '#dc3545', backgroundColor: '#fff8f8' } : {}}
                    />
                    {formErrors.fullName && <span className="error-text" style={{ color: '#dc3545', fontSize: '0.75rem', display: 'block', marginTop: '0.25rem' }}>{formErrors.fullName}</span>}
                  </div>
                  <div className="cc-field">
                    <label className="cc-field__label" htmlFor="cc-email">
                      Email Address<span className="cc-required">*</span>
                    </label>
                    <input
                      className={`cc-input ${formErrors.email ? 'error' : ''}`}
                      type="email"
                      id="cc-email"
                      placeholder="Enter Email Address"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      style={formErrors.email ? { borderColor: '#dc3545', backgroundColor: '#fff8f8' } : {}}
                    />
                    {formErrors.email && <span className="error-text" style={{ color: '#dc3545', fontSize: '0.75rem', display: 'block', marginTop: '0.25rem' }}>{formErrors.email}</span>}
                  </div>
                </div>
                <div className="cc-form-row">
                  <div className="cc-field">
                    <label className="cc-field__label" htmlFor="cc-phone">
                      Phone Number<span className="cc-required">*</span>
                    </label>
                    <input
                      className={`cc-input ${formErrors.phone ? 'error' : ''}`}
                      type="tel"
                      id="cc-phone"
                      placeholder="07XXX XXXXXX"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      style={formErrors.phone ? { borderColor: '#dc3545', backgroundColor: '#fff8f8' } : {}}
                    />
                    {formErrors.phone && <span className="error-text" style={{ color: '#dc3545', fontSize: '0.75rem', display: 'block', marginTop: '0.25rem' }}>{formErrors.phone}</span>}
                  </div>
                  <div className="cc-field">
                    <label className="cc-field__label" htmlFor="cc-postcode">
                      Postcode<span className="cc-required">*</span>
                    </label>
                    <input
                      className={`cc-input ${formErrors.postcode ? 'error' : ''}`}
                      type="text"
                      id="cc-postcode"
                      placeholder="SS14 3BB"
                      value={formData.postcode}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      style={formErrors.postcode ? { borderColor: '#dc3545', backgroundColor: '#fff8f8' } : {}}
                    />
                    {formErrors.postcode && <span className="error-text" style={{ color: '#dc3545', fontSize: '0.75rem', display: 'block', marginTop: '0.25rem' }}>{formErrors.postcode}</span>}
                  </div>
                </div>

<div className="cc-form-submit">
  <div className="cc-cta-wrap">

    <button
      type="button"
      className="btn btn--primary"
      onClick={() => goToStep(1)}
      disabled={isSubmitting}
    >
      ← Back
    </button>

    <button
      type="submit"
      className="btn btn--primary"
      disabled={isSubmitting}
      style={{
        opacity: isSubmitting ? 0.7 : 1,
        cursor: isSubmitting ? 'not-allowed' : 'pointer'
      }}
    >
      {isSubmitting ? "Submitting..." : "Review Your Estimate"}
    </button>

  </div>
</div>
              </form>
            </div>
          </>
        ) : (
          // RESULTS SCREEN
          <div className="cc-results">

            <div className="cc-results__check">✓</div>
            <h2 className="cc-results__title">Your Estimated Weekly Care Plan</h2>
            <p className="cc-results__subtitle">
              Based on your requirements of {getFrequencyLabel(frequency)} with {personalCare === 0 ? 'companionship' : personalCare === 1 ? 'personal care' : 'medical'} support
            </p>

            <div className="cc-results__price-box">
              <p className="cc-results__price">{getEstimatedCost()}</p>
              <p className="cc-results__price-sub">per week</p>
            </div>

            <div className="cc-results__note">
              <strong>Please note:</strong> This is an estimated range. Your actual costs may vary based on specific care
              needs, location, and timing. A care coordinator will provide a detailed quote during the
              consultation.
            </div>

            <p className="cc-results__next-label">What happens next?</p>
            <div className="cc-results__actions">
              <button type="button" className="cc-action-btn cc-action-btn--navy">Book Assessment</button>
              <button type="button" className="cc-action-btn cc-action-btn--green">💬 Send via WhatsApp</button>
              <button type="button" className="cc-action-btn">✉ Email Me the Estimate</button>
            </div>

            <button className="cc-results__back" onClick={handleBackHome}>Back Home</button>
          </div>
        )}
      </div>
    </section>
  );
};

export default CareCostCalculator;