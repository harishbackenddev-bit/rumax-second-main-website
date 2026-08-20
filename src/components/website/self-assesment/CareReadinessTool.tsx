// src/components/website/care/CareReadinessTool.tsx

import React, { useState } from 'react';
import axios from 'axios';

interface Question {
  id: string;
  title: string;
  subtitle: string;
  options: { label: string; score: number }[];
}

const QUESTIONS: Question[] = [
  {
    id: "personal_care",
    title: "Are daily personal care routines becoming difficult?",
    subtitle: "Consider activities like bathing, dressing, grooming, and personal hygiene.",
    options: [
      { label: "Independent - manages all personal care without help", score: 0 },
      { label: "Needs slight help - occasional assistance needed", score: 1 },
      { label: "Needs daily assistance - regular help required", score: 2 },
      { label: "Fully dependent - requires complete assistance", score: 3 }
    ]
  },
  {
    id: "mobility",
    title: "Is mobility decreasing or are safety risks increasing?",
    subtitle: "Think about walking, transferring from bed to chair, balance, and fall risks.",
    options: [
      { label: "Safe & independent - no mobility concerns", score: 0 },
      { label: "Slightly unsteady - minor balance issues", score: 1 },
      { label: "Recent fall or difficulty - clear mobility challenges", score: 2 },
      { label: "High risk or dependent - significant safety concerns", score: 3 }
    ]
  },
  {
    id: "household",
    title: "Are meals, nutrition, and household upkeep maintained?",
    subtitle: "Consider meal preparation, grocery shopping, eating habits, and home cleanliness.",
    options: [
      { label: "Fully independent - manages all household tasks", score: 0 },
      { label: "Occasional help needed - mostly independent", score: 1 },
      { label: "Poor nutrition or clutter - struggling with basics", score: 2 },
      { label: "Unsafe environment - cannot manage household", score: 3 }
    ]
  },
  {
    id: "health",
    title: "Are health and medication managed correctly?",
    subtitle: "Think about taking medications on time, attending appointments, and managing health conditions.",
    options: [
      { label: "Fully managed - handles all health needs independently", score: 0 },
      { label: "Needs reminders - occasional prompting required", score: 1 },
      { label: "Missed doses - frequently forgets medications", score: 2 },
      { label: "Cannot manage - needs complete health supervision", score: 3 }
    ]
  },
  {
    id: "cognitive",
    title: "Are there changes in memory, mood, or social connection?",
    subtitle: "Consider cognitive function, emotional wellbeing, social engagement, and behavioral changes.",
    options: [
      { label: "Active & engaged - socially connected with good cognition", score: 0 },
      { label: "Mild forgetfulness - some memory lapses", score: 1 },
      { label: "Confusion or isolation - noticeable cognitive or social decline", score: 2 },
      { label: "Severe cognitive issues - significant mental health concerns", score: 3 }
    ]
  }
];

interface ResultData {
  title: string;
  description: string;
  considerations: string[];
  scoreRange: string;
}

const CareReadinessTool: React.FC = () => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
  
  const [currentStep, setCurrentStep] = useState<number | string>(1);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [selectedOption, setSelectedOption] = useState<Record<string, number>>({});
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    postcode: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Result state
  const [result, setResult] = useState<ResultData | null>(null);
  
  // Submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [bookingDate, setBookingDate] = useState<string>('');
  const [bookingTime, setBookingTime] = useState<string>('');

  const TOTAL_STEPS = QUESTIONS.length;

  const handleOptionSelect = (questionId: string, score: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: score }));
    setSelectedOption(prev => ({ ...prev, [questionId]: score }));
  };

  const goToStep = (step: number | string) => {
    setCurrentStep(step);
    // Scroll to top of card
    const card = document.querySelector('.card');
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const goNext = (stepNum: number) => {
    if (stepNum < TOTAL_STEPS) {
      goToStep(stepNum + 1);
    } else {
      goToStep('details');
    }
  };

  const goBack = (stepNum: number) => {
    if (stepNum > 1) {
      goToStep(stepNum - 1);
    }
  };

  const validateDetails = (): boolean => {
    const errors: Record<string, string> = {};
    let valid = true;

    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
      valid = false;
    } else if (formData.fullName.trim().length < 2) {
      errors.fullName = 'Full name must be at least 2 characters';
      valid = false;
    }

    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      errors.email = 'Enter a valid email address';
      valid = false;
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
      valid = false;
    } else if (!/^[\d\s\-+()]{10,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = 'Enter a valid phone number (10-15 digits)';
      valid = false;
    }

    if (!formData.postcode.trim()) {
      errors.postcode = 'Postcode is required';
      valid = false;
    } else if (!/^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i.test(formData.postcode.trim())) {
      errors.postcode = 'Enter a valid UK postcode';
      valid = false;
    }

    setFormErrors(errors);
    return valid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    // Clear error when user types
    if (formErrors[id]) {
      setFormErrors(prev => ({ ...prev, [id]: '' }));
    }
  };

  const getResult = (totalScore: number): ResultData => {
    if (totalScore <= 2) {
      return {
        title: "Independent - Minimal Support Needed",
        description: "Based on your responses, your loved one is managing well independently. Occasional check-ins are recommended to monitor any changes.",
        considerations: [
          "Periodic wellbeing check-ins",
          "Monitor for early changes in routine",
          "Keep emergency contacts up to date"
        ],
        scoreRange: "0-2"
      };
    }
    if (totalScore <= 6) {
      return {
        title: "Light Support Recommended",
        description: "Based on your responses, some light, regular support would help maintain safety and independence at home.",
        considerations: [
          "Weekly welfare visits recommended",
          "Light help with household tasks",
          "Occasional medication reminders"
        ],
        scoreRange: "3-6"
      };
    }
    if (totalScore <= 10) {
      return {
        title: "Moderate Personal Care Needed",
        description: "Based on your responses, daily support visits are recommended to ensure safety, assist with routines, and support overall wellbeing.",
        considerations: [
          "Daily personal care assistance recommended",
          "Safety monitoring for mobility",
          "Support with meal preparation and medication"
        ],
        scoreRange: "7-10"
      };
    }
    return {
      title: "High Level of Care Needed",
      description: "Based on your responses, comprehensive daily or live-in care is recommended to ensure safety and quality of life.",
      considerations: [
        "Comprehensive daily care recommended",
        "Full mobility and falls support",
        "Complete health and medication supervision"
      ],
      scoreRange: "11-15"
    };
  };

  const handleGetResults = () => {
    if (!validateDetails()) return;
    
    const totalScore = Object.values(answers).reduce((sum, s) => sum + s, 0);
    const resultData = getResult(totalScore);
    setResult(resultData);
    goToStep('result');
  };

  const handleBookConsultation = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Calculate total score
      const totalScore = Object.values(answers).reduce((sum, s) => sum + s, 0);
      
      // Prepare payload
      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        postcode: formData.postcode.trim(),
        totalScore: totalScore,
        scoreRange: result?.scoreRange || '',
        resultTitle: result?.title || '',
        resultDescription: result?.description || '',
        considerations: result?.considerations || [],
        answers: answers,
        source: "care-readiness-tool",
        formName: "Care Readiness Assessment",
      };

      const response = await axios.post(
        `${API_URL}/api/website/care-readiness/save`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        setSubmitSuccess(true);
        
        // Set booking date and time (3 days from now)
        const date = new Date();
        date.setDate(date.getDate() + 3);
        setBookingDate(date.toLocaleDateString("en-GB", { 
          weekday: "long", 
          month: "long", 
          day: "numeric", 
          year: "numeric" 
        }));
        setBookingTime("11:00 AM");
        
        goToStep('confirmation');
      } else {
        setSubmitError(response.data.message || "Failed to book consultation");
      }
    } catch (error: any) {
      console.error("Error booking consultation:", error);
      setSubmitError(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContactUs = () => {
    window.location.href = '/contact-us';
  };

  const isStepActive = (step: number | string) => currentStep === step;

  const renderQuestionStep = (question: Question, index: number) => {
    const stepNum = index + 1;
    const isLast = stepNum === TOTAL_STEPS;
    const hasAnswer = answers[question.id] !== undefined;

    return (
      <div data-step={stepNum} className={isStepActive(stepNum) ? 'active' : ''} key={question.id}>
        <p className="step-label">Step {stepNum} of {TOTAL_STEPS}</p>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${(stepNum / TOTAL_STEPS) * 100}%` }}></div>
        </div>
        <h2 className="qtitle">{question.title}</h2>
        <p className="qsubtitle">{question.subtitle}</p>
        <div className="options">
          {question.options.map((opt, optIndex) => (
            <label 
              key={optIndex}
              className={`option ${selectedOption[question.id] === opt.score ? 'selected' : ''}`}
              onClick={() => handleOptionSelect(question.id, opt.score)}
            >
              <input 
                type="radio" 
                name={question.id} 
                value={opt.score}
                checked={selectedOption[question.id] === opt.score}
                onChange={() => {}}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
        <div className="btn-row">
          <button 
            className="btn btn-outline" 
            onClick={() => goBack(stepNum)}
            disabled={stepNum === 1}
          >
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Back
          </button>
          <button 
            className="btn btn-primary" 
            onClick={() => goNext(stepNum)}
            disabled={!hasAnswer}
          >
            {isLast ? 'Continue' : 'Next'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="care-readiness-tool">
      <div className="wrap">
        <svg className="ribbons" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
          <path d="M-50 300 C 100 100, 200 500, 400 300 S 700 100, 850 300" 
            stroke="var(--ribbon-1)" strokeWidth="60" fill="none"/>
          <path d="M-50 400 C 150 200, 250 600, 450 400 S 750 200, 900 400" 
            stroke="var(--ribbon-2)" strokeWidth="40" fill="none"/>
        </svg>

        <div className="content">
          <div className="logo-row">
            <div className="logo-block">
              <div className="logo-inner">
                <svg width="30" height="26" viewBox="0 0 30 26" fill="none">
                  <path d="M2 24C8 18 10 10 6 2C14 6 18 14 15 22C22 20 26 12 24 4C29 10 29 18 22 24"
                    stroke="url(#rumax-grad)" strokeWidth="2.4" strokeLinecap="round" fill="none"/>
                  <defs>
                    <linearGradient id="rumax-grad" x1="2" y1="2" x2="29" y2="24">
                      <stop offset="0%" stopColor="#7C3AED"/>
                      <stop offset="50%" stopColor="#4338CA"/>
                      <stop offset="100%" stopColor="#EC4899"/>
                    </linearGradient>
                  </defs>
                </svg>
                <span className="logo-text">RUMAX</span>
              </div>
              <span className="logo-tag">"Your Care, Our Commitment"</span>
            </div>
          </div>

          <div className="card">
            {/* Success Message */}
            {submitSuccess && (
              <div className="success-message" style={{
                background: "#d4edda",
                color: "#155724",
                padding: "16px 20px",
                borderRadius: "8px",
                marginBottom: "20px",
                border: "1px solid #c3e6cb",
                fontSize: "15px"
              }}>
                ✅ Your assessment has been submitted successfully!
              </div>
            )}

            {/* Error Message */}
            {submitError && (
              <div className="error-message" style={{
                background: "#f8d7da",
                color: "#721c24",
                padding: "16px 20px",
                borderRadius: "8px",
                marginBottom: "20px",
                border: "1px solid #f5c6cb",
                fontSize: "15px"
              }}>
                ❌ {submitError}
              </div>
            )}

            {/* Question Steps */}
            {QUESTIONS.map((q, index) => renderQuestionStep(q, index))}

            {/* Step: Details */}
            <div data-step="details" className={isStepActive('details') ? 'active' : ''}>
              <h2 className="form-title">Add Your Personal Details</h2>
              <p className="form-subtitle">We'll use this information to contact you</p>

              <div className="field">
                <label>
                  <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  Full Name
                </label>
                <input 
                  type="text" 
                  id="fullName" 
                  placeholder="Enter full name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={formErrors.fullName ? 'error' : ''}
                />
                {formErrors.fullName && <div className="error-msg" style={{ color: '#dc3545', fontSize: '0.75rem', marginTop: '4px' }}>{formErrors.fullName}</div>}
              </div>

              <div className="field">
                <label>
                  <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <path d="m22 7-10 6L2 7"/>
                  </svg>
                  Email Address
                </label>
                <input 
                  type="email" 
                  id="email" 
                  placeholder="Enter Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={formErrors.email ? 'error' : ''}
                />
                {formErrors.email && <div className="error-msg" style={{ color: '#dc3545', fontSize: '0.75rem', marginTop: '4px' }}>{formErrors.email}</div>}
              </div>

              <div className="field">
                <label>
                  <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  Phone Number
                </label>
                <input 
                  type="tel" 
                  id="phone" 
                  placeholder="(555) 123-4567"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={formErrors.phone ? 'error' : ''}
                />
                {formErrors.phone && <div className="error-msg" style={{ color: '#dc3545', fontSize: '0.75rem', marginTop: '4px' }}>{formErrors.phone}</div>}
              </div>

              <div className="field">
                <label>
                  <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  Postcode
                </label>
                <input 
                  type="text" 
                  id="postcode" 
                  placeholder="Enter Postcode"
                  value={formData.postcode}
                  onChange={handleInputChange}
                  className={formErrors.postcode ? 'error' : ''}
                />
                {formErrors.postcode && <div className="error-msg" style={{ color: '#dc3545', fontSize: '0.75rem', marginTop: '4px' }}>{formErrors.postcode}</div>}
              </div>

              <div className="btn-row" style={{ marginTop: '8px' }}>
                <button className="btn btn-outline" onClick={() => goToStep(TOTAL_STEPS)}>
                  Back
                </button>
                <button className="btn btn-outline" style={{ flex: 1 }} onClick={handleContactUs}>
                  Contact Us
                </button>
                <button className="btn btn-primary" onClick={handleGetResults}>
                  Get Results
                </button>
              </div>
            </div>

            {/* Step: Result */}
            <div data-step="result" className={isStepActive('result') ? 'active' : ''}>
              <div className="result-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21s-6.7-4.35-9.33-8.2C.86 10.1 1.4 6.6 4.1 4.9c2.2-1.38 4.9-.8 6.4 1.1.5.63.9 1.35 1.5 1.35s1-.72 1.5-1.35c1.5-1.9 4.2-2.48 6.4-1.1 2.7 1.7 3.24 5.2 1.43 7.9C18.7 16.65 12 21 12 21Z"/>
                </svg>
              </div>
              <p className="result-eyebrow">Your Assessment Result</p>
              <h2 className="result-title">{result?.title || ''}</h2>
              <p className="result-desc">{result?.description || ''}</p>

              <div className="considerations">
                <p>Key Considerations</p>
                <ul>
                  {result?.considerations.map((item, index) => (
                    <li key={index}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="m9 12 2 2 4-4"/>
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="btn-row">
                <button className="btn btn-outline" style={{ flex: 1 }} onClick={handleContactUs}>
                  Contact Us
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={handleBookConsultation}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Booking..." : "Book a Free Consultation"}
                </button>
              </div>
            </div>

            {/* Step: Confirmation */}
            <div data-step="confirmation" className={isStepActive('confirmation') ? 'active' : ''}>
              <div className="confirm">
                <div className="confirm-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
                <h2>Consultation Booked!</h2>
                <p className="sub">We've sent a confirmation email with all the details.</p>

                <div className="booking-card">
                  <div className="booking-row">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2"/>
                      <path d="M16 2v4M8 2v4M3 10h18"/>
                    </svg>
                    <span>{bookingDate || "Friday, 10 January 2025"}</span>
                  </div>
                  <div className="booking-row">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 6v6l4 2"/>
                    </svg>
                    <span>{bookingTime || "11:00 AM"}</span>
                  </div>
                </div>

                <p className="note">A care advisor will call you at the scheduled time.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareReadinessTool;