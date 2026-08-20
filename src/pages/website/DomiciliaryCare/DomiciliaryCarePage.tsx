import { CareProcessSection } from "@/components/common/CareProcessSection";
import { CareCta } from "@/components/common/CareCta";
import { ReasonsGrid } from "@/components/common/ReasonsGrid";
import { AssetImage } from "@/components/ui/AssetImage";
import { FaqSection, InnerHero, PageShell } from "@/components/pages/InnerPages";
import { careFaqs, careSteps } from "@/data/pages";
import React, { useState } from "react";
import axios from "axios";

const serviceDetails = [
  {
    icon: "home",
    iconAsset: "dom-care-service-personal.svg",
    title: "Personal Care & Daily Living",
    summary: "Respectful, dignified support with everyday tasks to help clients maintain independence and wellbeing.",
    items: ["Washing, bathing, showering and personal hygiene", "Dressing and undressing", "Continence care and catheter management", "Oral hygiene", "Grooming and appearance", "Preparation of meals and nutrition support", "Assistance with mobility and transfers"]
  },
  {
    icon: "heart",
    iconAsset: "dom-care-service-medication-a.svg",
    title: "Dementia Care",
    summary: "Specialist support for individuals living with dementia and their families, focused on safety, familiarity and quality of life.",
    items: ["Person-centred dementia care planning", "Cognitive stimulation and meaningful activity", "Behavioural support and de-escalation", "Safe home environment assessment", "Carer respite and family liaison", "End of life dementia care"]
  },
  {
    icon: "medical",
    iconAsset: "dom-care-service-medication-b.svg",
    title: "Medication Administration & Management",
    summary: "Safe, accurate medication support delivered by trained staff under a robust medication management policy.",
    items: ["Oral medication prompting and administration", "Topical medication application", "Medication ordering liaison with community pharmacies", "MAR (Medication Administration Record)", "Grooming and appearance", "Preparation of meals and nutrition support"]
  },
  {
    icon: "clock",
    iconAsset: "dom-care-service-dementia.svg",
    title: "Respite & 24-Hour / Live-In Care",
    summary: "Flexible respite cover for family carers, and continuous live-in support for clients who require around-the-clock care.",
    items: ["Short-break respite care (day, overnight, weekly)", "24-hour waking or sleeping night support", "Live-in care packages", "Hospital discharge support and short-term step-down care", "Emergency cover at short notice"]
  },
  {
    icon: "medical",
    iconAsset: "dom-care-service-respite.svg",
    title: "Medication Administration & Management",
    summary: "Safe, accurate medication support delivered by trained staff under a robust medication management policy.",
    items: ["Oral medication prompting and administration", "Topical medication application", "Medication ordering liaison with community pharmacies", "MAR (Medication Administration Record)", "Grooming and appearance", "Preparation of meals and nutrition support"]
  },
  {
    icon: "users",
    iconAsset: "dom-care-service-supported.svg",
    title: "Supported Living",
    summary: "Empowering adults with learning disabilities, autism, mental health needs, or physical disabilities to live independently in their own home or supported accommodation.",
    items: ["Daily living skills and personal routines", "Community access and meaningful activities", "Medication support", "Tenancy support and independent living skills", "Budgeting and financial skills support", "Collaboration with families, social workers, and support networks"]
  }
];

const careReasons = [
  {
    iconAsset: "dom-care-reason-cqc.svg",
    title: "CQC Registration",
    description: "Fully regulated and compliant with all Care Quality Commission standards."
  },
  {
    iconAsset: "dom-care-reason-trained.svg",
    title: "Trained Professionals",
    description: "All carers are DBS checked, fully trained, and experienced in person-centred care."
  },
  {
    iconAsset: "dom-care-reason-compassion.svg",
    title: "Compassionate Care",
    description: "We treat every individual with kindness, dignity, and respect they deserve."
  },
  {
    iconAsset: "dom-care-reason-flexible.svg",
    title: "Flexible Support",
    description: "From a few hours a week to full-time care, we adapt to your needs and schedule."
  },
  {
    iconAsset: "dom-care-reason-plans.svg",
    title: "Personalised Plans",
    description: "No two people are the same. Your care plan is uniquely yours and regularly reviewed."
  },
  {
    iconAsset: "dom-care-reason-availability.svg",
    title: "24/7 Availability",
    description: "Our office team is always available to support you, your family, and our care team."
  }
];

// Define assessment fields with options
const assessmentFields = [
  { 
    label: "First Name *", 
    placeholder: "Enter first name",
    name: "firstName"
  },
  { 
    label: "Last Name *", 
    placeholder: "Enter last name",
    name: "lastName"
  },
  { 
    label: "Phone Number *", 
    placeholder: "Enter Phone Number",
    name: "phoneNumber"
  },
  { 
    label: "Email Address *", 
    placeholder: "Enter email address",
    name: "email"
  },
  { 
    label: "Postcode of care recipient *", 
    placeholder: "Enter Postcode",
    name: "postcode"
  },
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

export default function DomiciliaryCarePage() {
  return (
    <PageShell>
      <InnerHero
        actions={[
          { label: "Calculate Your Care Costs", href: "/care-calculator" },
          { label: "Start a Self-Assessment", href: "/self-assessment", variant: "secondary" }
        ]}
        className="inner-hero--domiciliary"
        title="Domiciliary & Personal Care"
        description={"Our domiciliary care services are designed for individuals who wish to remain in their own homes, maintaining their independence, routines, and quality of life.\n\nWe provide care across the full spectrum - from a few hours per week through to 24-hour live-in support."}
        backgroundImage="rumax-team-hero.png"
        showCallback
        showScrollCue
      />
      <DomiciliaryCqcStrip />
      <DomiciliaryServices />
      <CareProcessSection
        title="How We Work"
        intro="Our person-centred approach ensures you receive the right support at the right time."
        image="rumax-domiciliary-team.png"
        imageAlt="Rumax care worker with client"
        steps={careSteps}
      />
      <ReasonsGrid title="Why Choose Rumax for Personal Care" items={careReasons} />
      <DomiciliaryAssessment />
      <FaqSection items={careFaqs} />
      <CareCta />
    </PageShell>
  );
}

function DomiciliaryAssessment() {
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
      // Clear error for this field
      if (errors.consent) {
        setErrors(prev => ({ ...prev, consent: '' }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      // Clear error for this field
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
    // Clear careType error
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      // Scroll to first error
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
          source: "domiciliary-care-page",
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
          <p>If you are looking for homecare for yourself or a family member, please use this form. We will be in touch within one working day to arrange a free initial assessment.</p>
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
              <label className={field.wide ? "is-wide" : undefined} key={field.label}>
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
                  <span className="error-text">{errors[field.name as keyof FormErrors]}</span>
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
              <span className="error-text">{errors.careType}</span>
            )}
          </div>
          
          <label className="dom-care-assessment__message">
            <span>Additional information or questions (optional)</span>
            <textarea 
              placeholder="Enter any additional information" 
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
            />
            <span>I consent to RUMAX LIMITED contacting me regarding my enquiry in accordance with their Privacy Policy. *</span>
            {errors.consent && (
              <span className="error-text">{errors.consent}</span>
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
}

function DomiciliaryCqcStrip() {
  return (
    <section className="dom-care-cqc">
      <div className="container dom-care-cqc__inner">
        <div className="dom-care-cqc__provider">
          <AssetImage className="dom-care-cqc__mark" name="dom-care-cqc-mark.png" alt="CQC" />
          <div>
            <h2>CQC Registered Provider</h2>
            <p>Personal Care &middot; Treatment of Disease, Disorder or Injury &middot; Nursing Care</p>
            <small>location ID No. 1-1162554428</small>
          </div>
        </div>
        <div className="dom-care-cqc__rating">
          <AssetImage name="dom-care-cqc-rating-logo.svg" alt="Care Quality Commission" />
          <i aria-hidden="true" />
          <span>Overall: <strong>Good</strong></span>
          <AssetImage className="dom-care-cqc__external" name="dom-care-cqc-external.svg" alt="" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}

function DomiciliaryServices() {
  return (
    <section className="page-section dom-care-services">
      <div className="container">
        <div className="page-section__heading">
          <span className="section-spark" aria-hidden="true" />
          <h2>Our Care Services</h2>
        </div>
        <div className="dom-care-service-grid">
          {serviceDetails.map((service) => (
            <article className="dom-care-service-card" key={service.iconAsset}>
              <span aria-hidden="true">
                <AssetImage name={service.iconAsset} alt="" aria-hidden="true" />
              </span>
              <h3>{service.title}</h3>
              <p>{service.summary}</p>
              <ul>
                {service.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}