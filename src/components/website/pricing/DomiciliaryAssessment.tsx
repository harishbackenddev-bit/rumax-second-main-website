// src/components/website/pricing/DomiciliaryAssessment.tsx

import React, { useState } from "react";
import axios from "axios";

interface AssessmentField {
  label: string;
  placeholder: string;
  name: string;
  as?: "input" | "select";
  wide?: boolean;
  options?: string[];
}

const assessmentFields: AssessmentField[] = [
  { label: "First Name *", placeholder: "Enter first name", name: "firstName" },
  { label: "Last Name *", placeholder: "Enter last name", name: "lastName" },
  { label: "Phone Number *", placeholder: "Enter Phone Number", name: "phoneNumber" },
  { label: "Email Address *", placeholder: "Enter email address", name: "email" },
  { label: "Postcode of care recipient *", placeholder: "Enter Postcode", name: "postcode" },
  { 
    label: "Your relationship to the person needing care *", 
    placeholder: "Select relationship", 
    name: "relationship",
    as: "select",
    options: [
      "Self",
      "Spouse/Partner",
      "Parent",
      "Child",
      "Sibling",
      "Grandparent",
      "Grandchild",
      "Friend",
      "Other Family Member",
      "Professional (Social Worker/Care Manager)"
    ]
  },
  { 
    label: "How soon is care needed? *", 
    placeholder: "Select timeframe", 
    name: "timeframe",
    as: "select",
    options: [
      "Immediately (Within 24 hours)",
      "Within 1 week",
      "Within 2 weeks",
      "Within 1 month",
      "Within 3 months",
      "Planning for future (3-6 months)",
      "Not sure yet"
    ]
  },
  { 
    label: "Funding type", 
    placeholder: "Select funding type", 
    name: "fundingType",
    as: "select",
    options: [
      "Self-Funded (Private)",
      "Local Authority (Council Funded)",
      "NHS Continuing Healthcare",
      "Personal Budget/Direct Payment",
      "Health Insurance",
      "Combination of sources",
      "Not sure / Undecided"
    ],
    wide: true 
  }
];

// Care type options for checkboxes
const careTypeOptions = [
  "Personal Care",
  "Dementia Care",
  "Medication Management",
  "Respite Care",
  "24-Hour/Live-In Care",
  "Supported Living",
  "Companionship",
  "Palliative/End of Life Care",
  "Hospital Discharge Support",
  "Home Help (Cleaning, Shopping)"
];

const DomiciliaryAssessment: React.FC = () => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
  
  interface FormData {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    postcode: string;
    relationship: string;
    careType: string[];
    timeframe: string;
    fundingType: string;
    additionalInfo: string;
    consent: boolean;
  }

  interface FormErrors {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    email?: string;
    postcode?: string;
    relationship?: string;
    careType?: string;
    timeframe?: string;
    fundingType?: string;
    consent?: string;
  }

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    postcode: "",
    relationship: "",
    careType: [],
    timeframe: "",
    fundingType: "",
    additionalInfo: "",
    consent: false
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox" && name === "consent") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
      if (errors.consent) {
        setErrors(prev => ({ ...prev, consent: '' }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      if (errors[name as keyof FormErrors]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    }
    
    if (error) setError(null);
  };

  const handleCareTypeChange = (careType: string) => {
    setFormData(prev => {
      const current = prev.careType;
      const newValues = current.includes(careType)
        ? current.filter(item => item !== careType)
        : [...current, careType];
      return { ...prev, careType: newValues };
    });
    if (errors.careType) {
      setErrors(prev => ({ ...prev, careType: '' }));
    }
    if (error) setError(null);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    // Phone Number validation
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else {
      const phoneRegex = /^[\d\s\-+()]{10,15}$/;
      if (!phoneRegex.test(formData.phoneNumber.replace(/\s/g, ''))) {
        newErrors.phoneNumber = "Please enter a valid phone number (10-15 digits)";
      }
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Postcode validation
    if (!formData.postcode.trim()) {
      newErrors.postcode = "Postcode is required";
    } else if (formData.postcode.trim().length < 3) {
      newErrors.postcode = "Please enter a valid postcode";
    }

    // Relationship validation
    if (!formData.relationship) {
      newErrors.relationship = "Please select your relationship to the person needing care";
    }

    // Care Type validation
    if (formData.careType.length === 0) {
      newErrors.careType = "Please select at least one care type";
    }

    // Timeframe validation
    if (!formData.timeframe) {
      newErrors.timeframe = "Please select when care is needed";
    }

    // Consent validation
    if (!formData.consent) {
      newErrors.consent = "You must consent to be contacted";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      const firstError = document.querySelector('.error-text');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post(
        `${API_URL}/api/website/domiciliary-assessment/save`,
        {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          fullName: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
          phoneNumber: formData.phoneNumber.trim(),
          email: formData.email.trim(),
          postcode: formData.postcode.trim(),
          relationship: formData.relationship,
          careType: formData.careType,
          timeframe: formData.timeframe,
          fundingType: formData.fundingType || "Not specified",
          additionalInfo: formData.additionalInfo.trim(),
          consent: formData.consent,
          source: "domiciliary-assessment",
          formName: "Domiciliary Care Assessment"
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setSuccess(true);
        setFormData({
          firstName: "",
          lastName: "",
          phoneNumber: "",
          email: "",
          postcode: "",
          relationship: "",
          careType: [],
          timeframe: "",
          fundingType: "",
          additionalInfo: "",
          consent: false
        });
        setErrors({});
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(response.data.message || "Failed to submit assessment");
      }
    } catch (err: any) {
      console.error("Error submitting assessment:", err);
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-section dom-care-assessment">
      <div className="container">
        <div className="dom-care-assessment__heading">
          <div>
            <span aria-hidden="true" />
            <h2>Care Clients & Families</h2>
          </div>
          <p>
            If you are looking for homecare for yourself or a family member, please use this form. 
            We will be in touch within one working day to arrange a free initial assessment.
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="success-message" style={{
            background: "#d4edda",
            color: "#155724",
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "20px",
            border: "1px solid #c3e6cb"
          }}>
            ✅ Thank you! We will contact you within one working day to arrange your free initial assessment.
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="error-message" style={{
            background: "#f8d7da",
            color: "#721c24",
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "20px",
            border: "1px solid #f5c6cb"
          }}>
            ❌ {error}
          </div>
        )}

        <form className="dom-care-assessment__form" onSubmit={handleSubmit}>
          <div className="dom-care-assessment__grid">
            {assessmentFields.map((field) => (
              <label 
                className={field.wide ? "is-wide" : undefined} 
                key={field.label}
              >
                <span>{field.label}</span>
                {field.as === "select" ? (
                  <select 
                    name={field.name}
                    value={formData[field.name as keyof FormData] as string}
                    onChange={handleChange}
                    disabled={loading}
                    className={errors[field.name as keyof FormErrors] ? 'error' : ''}
                  >
                    <option value="">{field.placeholder}</option>
                    {field.options?.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <input 
                    placeholder={field.placeholder} 
                    type={field.name === "email" ? "email" : field.name === "phoneNumber" ? "tel" : "text"}
                    name={field.name}
                    value={formData[field.name as keyof FormData] as string}
                    onChange={handleChange}
                    disabled={loading}
                    className={errors[field.name as keyof FormErrors] ? 'error' : ''}
                  />
                )}
                {errors[field.name as keyof FormErrors] && (
                  <span className="error-text" style={{ color: '#dc3545', fontSize: '0.75rem', display: 'block', marginTop: '0.25rem' }}>
                    {errors[field.name as keyof FormErrors]}
                  </span>
                )}
              </label>
            ))}
          </div>

          {/* Care Type Checkboxes */}
          <div className="dom-care-assessment__care-type">
            <label className="care-type-label">
              <span>Type of care needed (tick all that apply) *</span>
            </label>
            <div className="care-type-grid">
              {careTypeOptions.map((careType) => (
                <label 
                  key={careType} 
                  className={`care-type-checkbox ${errors.careType ? 'error' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={formData.careType.includes(careType)}
                    onChange={() => handleCareTypeChange(careType)}
                    disabled={loading}
                  />
                  <span className="checkbox-label">{careType}</span>
                </label>
              ))}
            </div>
            {errors.careType && (
              <span className="error-text" style={{ color: '#dc3545', fontSize: '0.75rem', display: 'block', marginTop: '0.25rem' }}>
                {errors.careType}
              </span>
            )}
          </div>

          <label className="dom-care-assessment__message">
            <span>Additional information or questions (optional)</span>
            <textarea 
              placeholder="Enter additional information" 
              rows={7}
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleChange}
              disabled={loading}
            />
          </label>

          <label className="dom-care-assessment__consent">
            <input 
              type="checkbox" 
              name="consent"
              checked={formData.consent}
              onChange={handleChange}
              disabled={loading}
              className={errors.consent ? 'error' : ''}
              required
            />
            <span>
              I consent to RUMAX LIMITED contacting me regarding my enquiry in accordance with their Privacy Policy. *
            </span>
            {errors.consent && (
              <span className="error-text" style={{ color: '#dc3545', fontSize: '0.75rem', display: 'block', marginTop: '0.25rem' }}>
                {errors.consent}
              </span>
            )}
          </label>

          <button 
            type="submit" 
            disabled={loading}
            style={{
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Submitting..." : "Request a Free Assessment"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default DomiciliaryAssessment;