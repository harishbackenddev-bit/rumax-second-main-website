// src/components/website/funding/FundingPathway.tsx

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

interface FundingPathwayProps {
  className?: string;
}

interface FormData {
  // Step 1 - Care Needs Assessment
  age: string;
  careLevel: string;
  careSetting: string;
  complexNeeds: string;
  
  // Step 2 - Funding Eligibility
  assets: string;
  income: string;
  medicalSupport: string;
  
  // Step 3 - Contact Details
  fullName: string;
  contactMethod: string;
  email: string;
  phone: string;
}

interface FormErrors {
  age?: string;
  careLevel?: string;
  careSetting?: string;
  complexNeeds?: string;
  assets?: string;
  income?: string;
  medicalSupport?: string;
  fullName?: string;
  contactMethod?: string;
  email?: string;
  phone?: string;
}

const FundingPathway: React.FC<FundingPathwayProps> = ({ className = '' }) => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    age: '',
    careLevel: '',
    careSetting: '',
    complexNeeds: '',
    assets: '',
    income: '',
    medicalSupport: '',
    fullName: '',
    contactMethod: '',
    email: '',
    phone: '',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const sectionRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<Record<string, HTMLElement>>({});

  const goToStep = (stepNum: number) => {
    setCurrentStep(stepNum);
    if (sectionRef.current) {
      const yOffset = -20;
      const y = sectionRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleOptionSelect = (group: string, value: string) => {
    setFormData(prev => ({ ...prev, [group]: value }));
    
    // Clear error for this field
    if (errors[group as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [group]: '' }));
    }
    
    if (submitError) setSubmitError(null);
  };

  // Validation functions
  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    return /^[\d\s\-+()]{10,15}$/.test(phone.replace(/\s/g, ''));
  };

  const validateStep1 = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!formData.age) {
      newErrors.age = 'Please select age range';
      isValid = false;
    }
    if (!formData.careLevel) {
      newErrors.careLevel = 'Please select level of care needed';
      isValid = false;
    }
    if (!formData.careSetting) {
      newErrors.careSetting = 'Please select care setting';
      isValid = false;
    }
    if (!formData.complexNeeds) {
      newErrors.complexNeeds = 'Please select if there are complex needs';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const validateStep2 = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!formData.assets) {
      newErrors.assets = 'Please select assets range';
      isValid = false;
    }
    if (!formData.income) {
      newErrors.income = 'Please select income level';
      isValid = false;
    }
    if (!formData.medicalSupport) {
      newErrors.medicalSupport = 'Please select if medical support is involved';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const validateStep3 = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
      isValid = false;
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
      isValid = false;
    }

    if (!formData.contactMethod) {
      newErrors.contactMethod = 'Please select contact method';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number (10-15 digits)';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNextStep = (stepNum: number) => {
    let isValid = false;
    if (stepNum === 2) {
      isValid = validateStep1();
    } else if (stepNum === 3) {
      isValid = validateStep2();
    }
    
    if (isValid) {
      goToStep(stepNum);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateStep3()) {
      const firstError = document.querySelector('.error-text');
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
        // Step 1
        age: formData.age,
        careLevel: formData.careLevel,
        careSetting: formData.careSetting,
        complexNeeds: formData.complexNeeds === 'yes',
        
        // Step 2
        assets: formData.assets,
        income: formData.income,
        medicalSupport: formData.medicalSupport === 'yes-involved',
        
        // Step 3
        fullName: formData.fullName.trim(),
        contactMethod: formData.contactMethod,
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        
        // System fields
        source: "funding-pathway",
        formName: "Funding Pathway Assessment",
      };

      const response = await axios.post(
        `${API_URL}/api/website/funding-pathway/save`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        setSubmitSuccess(true);
        setFormData({
          age: '',
          careLevel: '',
          careSetting: '',
          complexNeeds: '',
          assets: '',
          income: '',
          medicalSupport: '',
          fullName: '',
          contactMethod: '',
          email: '',
          phone: '',
        });
        setErrors({});
        
        // Auto-hide success after 5 seconds
        setTimeout(() => {
          setSubmitSuccess(false);
          goToStep(1);
        }, 5000);
      } else {
        setSubmitError(response.data.message || "Failed to submit assessment");
      }
    } catch (err: any) {
      console.error("Error submitting funding pathway:", err);
      setSubmitError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-panel step-panel-active">
            <div className="step-head">
              <div className="step-head-icon">♡</div>
              <div>
                <p className="step-head-title">Care Needs Assessment</p>
                <p className="step-head-subtitle">Help us understand the care requirements</p>
              </div>
            </div>

            {/* Age Question */}
            <div className="question">
              <label className="question-label">
                Age of care recipient <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <div className="option-row" data-group="age">
                {['Under 18', '18-64', '65-84', '85+'].map((age) => (
                  <div
                    key={age}
                    className={`option-pill ${formData.age === age ? 'option-pill-active' : ''}`}
                    data-value={age}
                    onClick={() => handleOptionSelect('age', age)}
                    style={{ cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.6 : 1 }}
                  >
                    {age}
                  </div>
                ))}
              </div>
              {errors.age && <span className="error-text" style={{ color: '#dc3545', fontSize: '0.75rem', display: 'block', marginTop: '0.25rem' }}>{errors.age}</span>}
            </div>

            {/* Care Level Question */}
            <div className="question">
              <label className="question-label">
                Level of care needed <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <div className="option-row option-row-3" data-group="care-level">
                {[
                  { value: 'basic', title: 'Basic Support', desc: 'Help with daily activities, companionship' },
                  { value: 'moderate', title: 'Moderate Care', desc: 'Personal care, medication management' },
                  { value: 'extensive', title: 'Extensive Care', desc: '24/7 complex care support' }
                ].map((item) => (
                  <div
                    key={item.value}
                    className={`option-card ${formData.careLevel === item.value ? 'option-card-active' : ''}`}
                    data-value={item.value}
                    onClick={() => handleOptionSelect('careLevel', item.value)}
                    style={{ cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.6 : 1 }}
                  >
                    <p className="option-card-title">{item.title}</p>
                    <p className="option-card-desc">{item.desc}</p>
                  </div>
                ))}
              </div>
              {errors.careLevel && <span className="error-text" style={{ color: '#dc3545', fontSize: '0.75rem', display: 'block', marginTop: '0.25rem' }}>{errors.careLevel}</span>}
            </div>

            {/* Care Setting Question */}
            <div className="question">
              <label className="question-label">
                Care setting <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <div className="option-row option-row-3" data-group="setting">
  {[
    { value: 'own-home', label: 'Own Home' },
    { value: 'with-family', label: 'With Family' },
    { value: 'care-facility', label: 'Care Facility' }
  ].map((item) => (
    <div
      key={item.value}
      className={`option-icon ${formData.careSetting === item.value ? 'option-icon-active' : ''}`}
      data-value={item.value}
      onClick={() => handleOptionSelect('careSetting', item.value)}
      style={{ cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.6 : 1 }}
    >
     
      <span>{item.label}</span>
    </div>
  ))}
</div>
                ))}
              </div>
              {errors.careSetting && <span className="error-text" style={{ color: '#dc3545', fontSize: '0.75rem', display: 'block', marginTop: '0.25rem' }}>{errors.careSetting}</span>}
            </div>

            {/* Complex Needs Question */}
            <div className="question">
              <label className="question-label">
                Does the care recipient have complex medical or health needs? <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <div className="option-row option-row-2" data-group="complex-needs">
                {['yes', 'no'].map((option) => (
                  <div
                    key={option}
                    className={`option-pill ${formData.complexNeeds === option ? 'option-pill-active' : ''}`}
                    data-value={option}
                    onClick={() => handleOptionSelect('complexNeeds', option)}
                    style={{ cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.6 : 1 }}
                  >
                    {option === 'yes' ? 'Yes' : 'No'}
                  </div>
                ))}
              </div>
              {errors.complexNeeds && <span className="error-text" style={{ color: '#dc3545', fontSize: '0.75rem', display: 'block', marginTop: '0.25rem' }}>{errors.complexNeeds}</span>}
            </div>

            <div className="nav nav-end">
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={() => handleNextStep(2)}
                disabled={isSubmitting}
              >
                Next & Continue
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-panel step-panel-active">
            <div className="step-head">
              <div className="step-head-icon">$</div>
              <div>
                <p className="step-head-title">Funding Eligibility</p>
                <p className="step-head-subtitle">Help us identify potential funding sources</p>
              </div>
            </div>

            {/* Assets Question */}
            <div className="question">
              <label className="question-label">
                Total assets and savings (including property) <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <div className="option-row option-row-3" data-group="assets">
                {[
                  { value: 'under-23250', title: 'Under £23,250', desc: 'May qualify for local authority support' },
                  { value: '23250-100000', title: '£23,250 - £100,000', desc: 'Partial funding may be available' },
                  { value: 'over-100000', title: 'Over £100,000', desc: 'Likely self-funding initially' }
                ].map((item) => (
                  <div
                    key={item.value}
                    className={`option-card ${formData.assets === item.value ? 'option-card-active' : ''}`}
                    data-value={item.value}
                    onClick={() => handleOptionSelect('assets', item.value)}
                    style={{ cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.6 : 1 }}
                  >
                    <p className="option-card-title">{item.title}</p>
                    <p className="option-card-desc">{item.desc}</p>
                  </div>
                ))}
              </div>
              {errors.assets && <span className="error-text" style={{ color: '#dc3545', fontSize: '0.75rem', display: 'block', marginTop: '0.25rem' }}>{errors.assets}</span>}
            </div>

            {/* Income Question */}
            <div className="question">
              <label className="question-label">
                Monthly income level <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <div className="option-row option-row-3" data-group="income">
                {['Below £1,000/month', '£1,000 - £3,000/month', 'Above £3,000/month'].map((income) => (
                  <div
                    key={income}
                    className={`option-pill ${formData.income === income ? 'option-pill-active' : ''}`}
                    data-value={income}
                    onClick={() => handleOptionSelect('income', income)}
                    style={{ cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.6 : 1 }}
                  >
                    {income}
                  </div>
                ))}
              </div>
              {errors.income && <span className="error-text" style={{ color: '#dc3545', fontSize: '0.75rem', display: 'block', marginTop: '0.25rem' }}>{errors.income}</span>}
            </div>

            {/* Medical Support Question */}
            <div className="question">
              <label className="question-label">
                Is there GP or hospital support involved in the care? <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <div className="option-row option-row-2" data-group="medical-support">
                {[
                  { value: 'yes-involved', label: 'Yes, actively involved' },
                  { value: 'no-involvement', label: 'No medical team involvement' }
                ].map((option) => (
                  <div
                    key={option.value}
                    className={`option-pill ${formData.medicalSupport === option.value ? 'option-pill-active' : ''}`}
                    data-value={option.value}
                    onClick={() => handleOptionSelect('medicalSupport', option.value)}
                    style={{ cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.6 : 1 }}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
              {errors.medicalSupport && <span className="error-text" style={{ color: '#dc3545', fontSize: '0.75rem', display: 'block', marginTop: '0.25rem' }}>{errors.medicalSupport}</span>}
            </div>

            <div className="nav">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => goToStep(1)}
                disabled={isSubmitting}
              >
                Previous
              </button>
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={() => handleNextStep(3)}
                disabled={isSubmitting}
              >
                Next & Continue
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-panel step-panel-active">
            <div className="step-head">
              <div className="step-head-icon">☺</div>
              <div>
                <p className="step-head-title">Your Contact Details</p>
                <p className="step-head-subtitle">So we can send you your personalized recommendations</p>
              </div>
            </div>

            {/* Success Message */}
            {submitSuccess && (
              <div className="success-message" style={{
                background: "#d4edda",
                color: "#155724",
                padding: "12px 16px",
                borderRadius: "8px",
                marginBottom: "20px",
                border: "1px solid #c3e6cb"
              }}>
                ✅ Thank you! Your funding pathway results will be sent to you shortly.
              </div>
            )}

            {/* Error Message */}
            {submitError && (
              <div className="error-message" style={{
                background: "#f8d7da",
                color: "#721c24",
                padding: "12px 16px",
                borderRadius: "8px",
                marginBottom: "20px",
                border: "1px solid #f5c6cb"
              }}>
                ❌ {submitError}
              </div>
            )}

            <form id="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="field">
                  <label className="label" htmlFor="fp-full-name">
                    Full Name<span className="required" style={{ color: '#dc3545' }}>*</span>
                  </label>
                  <input 
                    className={`input ${errors.fullName ? 'error' : ''}`} 
                    type="text" 
                    id="fp-full-name" 
                    placeholder="Enter full name" 
                    value={formData.fullName}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, fullName: e.target.value }));
                      if (errors.fullName) {
                        setErrors(prev => ({ ...prev, fullName: '' }));
                      }
                    }}
                    disabled={isSubmitting}
                    style={errors.fullName ? { borderColor: '#dc3545', backgroundColor: '#fff8f8' } : {}}
                  />
                  {errors.fullName && <span className="error-text" style={{ color: '#dc3545', fontSize: '0.75rem', display: 'block', marginTop: '0.25rem' }}>{errors.fullName}</span>}
                </div>
                <div className="field">
                  <label className="label" htmlFor="fp-contact-method">
                    Preferred Contact Method<span className="required" style={{ color: '#dc3545' }}>*</span>
                  </label>
                  <select 
                    className={`select ${errors.contactMethod ? 'error' : ''}`} 
                    id="fp-contact-method" 
                    value={formData.contactMethod}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, contactMethod: e.target.value }));
                      if (errors.contactMethod) {
                        setErrors(prev => ({ ...prev, contactMethod: '' }));
                      }
                    }}
                    disabled={isSubmitting}
                    style={errors.contactMethod ? { borderColor: '#dc3545', backgroundColor: '#fff8f8' } : {}}
                  >
                    <option value="">Select</option>
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                    <option value="text">Text Message</option>
                  </select>
                  {errors.contactMethod && <span className="error-text" style={{ color: '#dc3545', fontSize: '0.75rem', display: 'block', marginTop: '0.25rem' }}>{errors.contactMethod}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="field">
                  <label className="label" htmlFor="fp-email">
                    Email Address<span className="required" style={{ color: '#dc3545' }}>*</span>
                  </label>
                  <input 
                    className={`input ${errors.email ? 'error' : ''}`} 
                    type="email" 
                    id="fp-email" 
                    placeholder="Enter email address" 
                    value={formData.email}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, email: e.target.value }));
                      if (errors.email) {
                        setErrors(prev => ({ ...prev, email: '' }));
                      }
                    }}
                    disabled={isSubmitting}
                    style={errors.email ? { borderColor: '#dc3545', backgroundColor: '#fff8f8' } : {}}
                  />
                  {errors.email && <span className="error-text" style={{ color: '#dc3545', fontSize: '0.75rem', display: 'block', marginTop: '0.25rem' }}>{errors.email}</span>}
                </div>
                <div className="field">
                  <label className="label" htmlFor="fp-phone">
                    Phone Number<span className="required" style={{ color: '#dc3545' }}>*</span>
                  </label>
                  <input 
                    className={`input ${errors.phone ? 'error' : ''}`} 
                    type="tel" 
                    id="fp-phone" 
                    placeholder="Enter phone number" 
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, phone: e.target.value }));
                      if (errors.phone) {
                        setErrors(prev => ({ ...prev, phone: '' }));
                      }
                    }}
                    disabled={isSubmitting}
                    style={errors.phone ? { borderColor: '#dc3545', backgroundColor: '#fff8f8' } : {}}
                  />
                  {errors.phone && <span className="error-text" style={{ color: '#dc3545', fontSize: '0.75rem', display: 'block', marginTop: '0.25rem' }}>{errors.phone}</span>}
                </div>
              </div>

              <div className="nav">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => goToStep(2)}
                  disabled={isSubmitting}
                >
                  Previous
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isSubmitting}
                  style={{
                    opacity: isSubmitting ? 0.7 : 1,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section className={`funding-pathway ${className}`} ref={sectionRef}>
      {/* Header */}
      <div className="header">
        <span></span>
        <h1 className="title">Find Your Funding Pathway</h1>
        <p className="subtitle">
          Answer a few questions to discover which funding options are available for your care needs
        </p>
      </div>

      {/* Stepper */}
      <div className="stepper">
        <div className={`step ${currentStep === 1 ? 'step-active' : ''} ${currentStep > 1 ? 'step-done' : ''}`}>
          <div className="circle">1</div>
          <span className="label">Care Needs Assessment</span>
        </div>
        <div className={`line ${currentStep > 1 ? 'line-fill' : ''}`}></div>
        <div className={`step ${currentStep === 2 ? 'step-active' : ''} ${currentStep > 2 ? 'step-done' : ''}`}>
          <div className="circle">2</div>
          <span className="label">Funding Eligibility</span>
        </div>
        <div className={`line ${currentStep > 2 ? 'line-fill' : ''}`}></div>
        <div className={`step ${currentStep === 3 ? 'step-active' : ''} ${currentStep > 3 ? 'step-done' : ''}`}>
          <div className="circle">3</div>
          <span className="label">Your Contact Details</span>
        </div>
      </div>

      <div className="panel">
        {renderStepContent()}
      </div>
    </section>
  );
};

export default FundingPathway;
