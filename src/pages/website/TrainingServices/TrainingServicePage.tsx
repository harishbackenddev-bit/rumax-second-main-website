import { useNavigate, useSearchParams } from "react-router-dom";
import { CareCta } from "@/components/common/CareCta";
import { QualityGovernanceStrip } from "@/components/common/QualityGovernanceStrip";
import { ReasonsGrid } from "@/components/common/ReasonsGrid";
import { FaqSection, InnerHero, PageShell } from "@/components/pages/InnerPages";
import { useState, FormEvent, useEffect } from "react";
import React from "react";
import axios from "axios";

type TrainingProps = {
  searchParams?: Promise<{ step?: string }>;
};

const trainingIntro =
  "Kickstart your journey in the care sector with Rumax Limited.\nBased in Basildon, Essex, we offer modern, streamlined training services designed to equip you with the practical skills and confidence you need to thrive. Whether you are taking your first steps into healthcare or looking to upskill, our expert-led programs are built around your success. Start building a career with purpose today.";

const trainingFeatures = [
  {
    iconAsset: "dom-care-reason-plans.svg",
    title: "Person-Centred Support",
    description: "Build confident, respectful care practice around individual needs, preferences and outcomes."
  },
  {
    iconAsset: "dom-care-reason-compassion.svg",
    title: "Health & Wellbeing",
    description: "Understand how to support appointments, medication routines, physical health and emotional wellbeing."
  },
  {
    iconAsset: "dom-care-reason-trained.svg",
    title: "Skill Development",
    description: "Develop practical care skills through clear instruction, guided practice and competency evidence."
  },
  {
    iconAsset: "dom-care-reason-cqc.svg",
    title: "Safety & Safeguarding",
    description: "Recognise concerns, reduce risk and respond through the correct safeguarding pathway."
  },
  {
    iconAsset: "dom-care-reason-flexible.svg",
    title: "Flexible Learning",
    description: "Training can be shaped around team needs, refresher requirements and practical role expectations."
  },
  {
    iconAsset: "dom-care-reason-availability.svg",
    title: "Ongoing Confidence",
    description: "Support workers leave with clearer expectations, stronger records and safer day-to-day practice."
  }
];

const trainingReasons = [
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

const portfolioItems = [
  ["Vendor Companies", "North America and EU companies requiring UK home-visit delivery"],
  ["CROs & Sponsors", "Seeking scalable decentralised trial operations"],
  ["Investigator Sites", "Needing additional capacity and scheduling support"],
  ["NHS Trusts", "Healthcare partners delivering research activity"]
];

const trainingSteps = [
  {
    id: "1",
    label: "Personal & Contact",
    title: "Learner Details",
    description: "Tell us who is booking training and how we can contact them.",
    fields: [
      ["Full Legal Name (as it appears on ID)*", "e.g. Margaret Anne Davies"],
      ["Preferred Name", "e.g. Maggie"],
      ["Date of Birth*", "text"],
      ["Duration at this address*", "text"],
      ["Current UK Address*", "Street address, town/city, postcode", "wide"],
      ["Email Address*", "e.g. m.davies@gmail.com"],
      ["Phone Number *", "e.g. 07700 900000"],
      ["National Insurance (NI) Number*", "AB123456C", "wide"]
    ]
  },
  {
    id: "2",
    label: "Emergency Contacts",
    title: "Emergency Contacts",
    description: "Add the best contact routes and emergency contact information.",
    fields: [
      ["Contact Phone Number*", "Enter phone number"],
      ["Alternative Email", "Enter email address"],
      ["Emergency Contact Name*", "Enter full name"],
      ["Emergency Contact Number*", "Enter phone number"],
      ["Relationship to learner", "text"],
      ["Preferred contact method", "text"]
    ]
  },
  {
    id: "3",
    label: "Eligibility & Vetting",
    title: "Eligibility & Vetting",
    description: "Help us confirm the checks required before training begins.",
    fields: [
      ["Right to work status*", "text"],
      ["DBS status*", "text"],
      ["Photo ID available*", "text"],
      ["Proof of address available*", "text"],
      ["National Insurance (NI) Number*", "AB123456C", "wide"]
    ]
  },
  {
    id: "4",
    label: "Experience & Quals",
    title: "Experience & Qualifications",
    description: "Tell us about your current experience and learning goals.",
    fields: [
      ["Training course required*", "text"],
      ["Current role", "text"],
      ["Previous care experience", "text"],
      ["Existing qualifications", "Enter details"],
      ["Preferred training date", "text"],
      ["Training location preference", "text"]
    ]
  },
  {
    id: "5",
    label: "Health & Accessibility",
    title: "Health & Accessibility",
    description: "Let us know about any adjustments needed for your training.",
    fields: [
      ["Health condition affecting training?", "text"],
      ["Accessibility requirements", "Enter details", "wide"],
      ["Learning support needs", "Enter details", "wide"],
      ["Can attend practical sessions?", "text"],
      ["Additional notes", "Tell us anything else we should know", "wide"]
    ]
  },
  {
    id: "6",
    label: "Declarations & Consents",
    title: "Declarations & Consents",
    description: "Your personal and sensitive data will be stored securely and processed for training administration purposes. It may be shared with regulated bodies as required by law.",
    fields: [
      ["Full Name *", "Enter full name"],
      ["Phone Number *", "Enter Phone Number"],
      ["Consent confirmation*", "text"],
      ["Signature name*", "Enter full name"]
    ]
  }
];

const trainingFaqs = [
  "Can I pause my application if I don't have all my documents on hand?",
  "What documents can I use to prove my Right to Work in the UK?",
  "What happens if I do not have an Enhanced DBS certificate registered on the Update Service?",
  "Why do I need to provide information about my health and fitness to work?",
  "How is my personal data and criminal record declaration handled?"
];

export default function TrainingServicePage() {
  const [searchParams] = useSearchParams();

  const step = searchParams.get("step");

  const currentStep =
    trainingSteps.find((item) => item.id === step) ?? trainingSteps[0];

  return (
    <PageShell>
      <InnerHero
        actions={[
          {
            href: "/training-service?step=1#book-training",
            label: "Book a Training",
          },
          {
            href: "#",
            label: "Work for us",
            variant: "secondary",
          },
        ]}
        className="inner-hero--supported-living inner-hero--training"
        title="Training Services"
        description={trainingIntro}
        backgroundImage="rumax-team-hero.png"
        showCallback
        showScrollCue
      />
      <QualityGovernanceStrip />

      <div className="key-main-cst">
        <ReasonsGrid title="Key Features of Our Service" items={trainingFeatures} />
      </div>

      <TrainingPortfolio />
      <ReasonsGrid title="Why Choose Rumax for Personal Care" items={trainingReasons} />
      <TrainingBookingForm active={currentStep} />
      <FaqSection items={trainingFaqs} />
      <CareCta />
    </PageShell>
  );
}

function TrainingBookingForm({ active }: { active: (typeof trainingSteps)[number] }) {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
  
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const currentIndex = trainingSteps.findIndex((step) => step.id === active.id);
  const previous = trainingSteps[Math.max(0, currentIndex - 1)];
  const next = trainingSteps[Math.min(trainingSteps.length - 1, currentIndex + 1)];
  const isFirstStep = currentIndex === 0;
  const isLastStep = currentIndex === trainingSteps.length - 1;

  // Validation functions for specific field types
  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    return /^[\d\s\-+()]{10,15}$/.test(phone.replace(/\s/g, ''));
  };

  const validateNINumber = (ni: string): boolean => {
    // Remove spaces and convert to uppercase
    const cleanNI = ni.replace(/\s/g, '').toUpperCase();
    
    // Check length (should be 9 characters)
    if (cleanNI.length !== 9) return false;
    
    // Check first 2 characters are letters (not D, F, I, Q, U, V)
    const firstChar = cleanNI[0];
    const secondChar = cleanNI[1];
    const invalidLetters = ['D', 'F', 'I', 'Q', 'U', 'V'];
    
    if (invalidLetters.includes(firstChar)) return false;
    if (invalidLetters.includes(secondChar)) return false;
    
    // Check characters 3-8 are digits
    const digits = cleanNI.substring(2, 8);
    if (!/^\d{6}$/.test(digits)) return false;
    
    // Check last character is A, B, C, or D
    const lastChar = cleanNI[8];
    if (!['A', 'B', 'C', 'D'].includes(lastChar)) return false;
    
    return true;
  };

  const validatePostcode = (postcode: string): boolean => {
    return /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i.test(postcode);
  };

  const validateDate = (date: string): boolean => {
    return /^\d{4}-\d{2}-\d{2}$/.test(date);
  };

  const validateStep = (step: typeof trainingSteps[0]): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    step.fields.forEach((field) => {
      const label = field[0];
      const value = formData[label] || "";
      const isRequired = label.includes('*');

      if (isRequired) {
        // Check if empty
        if (!value.trim()) {
          newErrors[label] = `${label.replace(/\*/g, "").trim()} is required`;
          isValid = false;
          return;
        }

        // Field-specific validation based on label
        const labelLower = label.toLowerCase();

        // Email validation - only for email fields
        if (labelLower.includes("email") && !labelLower.includes("alternative")) {
          if (!validateEmail(value)) {
            newErrors[label] = "Please enter a valid email address";
            isValid = false;
          }
        }

        // Phone number validation - only for phone fields (excluding NI Number)
        if (labelLower.includes("phone") && !labelLower.includes("national")) {
          if (!validatePhone(value)) {
            newErrors[label] = "Please enter a valid phone number (10-15 digits)";
            isValid = false;
          }
        }

        // NI Number validation - specifically for NI number fields
        if (labelLower.includes("national insurance") || labelLower.includes("ni number")) {
          if (!validateNINumber(value)) {
            newErrors[label] = "Please enter a valid NI number (e.g. AB123456C)";
            isValid = false;
          }
        }

        // Date validation
        if (labelLower.includes("date of birth")) {
          if (!validateDate(value)) {
            newErrors[label] = "Please enter a valid date (YYYY-MM-DD)";
            isValid = false;
          }
        }

        // Name validation (minimum 2 characters) - exclude preferred name and signature
        if (labelLower.includes("name") && !labelLower.includes("preferred") && !labelLower.includes("signature")) {
          if (value.trim().length < 2) {
            newErrors[label] = "Please enter at least 2 characters";
            isValid = false;
          }
        }

        // Postcode validation
        if (labelLower.includes("postcode")) {
          if (!validatePostcode(value)) {
            newErrors[label] = "Please enter a valid UK postcode";
            isValid = false;
          }
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (label: string, value: string) => {
    setFormData(prev => ({ ...prev, [label]: value }));
    
    // Clear error for this field if it exists
    if (errors[label]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[label];
        return newErrors;
      });
    }
    
    if (submitError) setSubmitError(null);
  };

  const handleStepChange = (stepId: string, e?: React.MouseEvent<HTMLAnchorElement>) => {
    if (e) {
      e.preventDefault();
    }
    
    // Find the target step
    const targetStep = trainingSteps.find(s => s.id === stepId);
    if (!targetStep) return;
    
    const targetIndex = trainingSteps.indexOf(targetStep);
    
    // If going forward, validate
    if (targetIndex > currentIndex) {
      if (validateStep(active)) {
        navigate(`/training-service?step=${stepId}#book-training`);
      }
    } else {
      // Going backward - no validation needed
      navigate(`/training-service?step=${stepId}#book-training`);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (isLastStep) {
      // Final submission
      if (validateStep(active)) {
        setIsSubmitting(true);
        setSubmitError(null);
        setSubmitSuccess(false);
        
        try {
          // Prepare form data for API
          const payload = {
            // Personal & Contact
            fullLegalName: formData["Full Legal Name (as it appears on ID)*"] || "",
            preferredName: formData["Preferred Name"] || "",
            dateOfBirth: formData["Date of Birth*"] || "",
            durationAtAddress: formData["Duration at this address*"] || "",
            currentAddress: formData["Current UK Address*"] || "",
            email: formData["Email Address*"] || "",
            phoneNumber: formData["Phone Number *"] || "",
            nationalInsurance: formData["National Insurance (NI) Number*"] || "",
            
            // Emergency Contacts
            contactPhone: formData["Contact Phone Number*"] || "",
            alternativeEmail: formData["Alternative Email"] || "",
            emergencyContactName: formData["Emergency Contact Name*"] || "",
            emergencyContactNumber: formData["Emergency Contact Number*"] || "",
            relationshipToLearner: formData["Relationship to learner"] || "",
            preferredContactMethod: formData["Preferred contact method"] || "",
            
            // Eligibility & Vetting
            rightToWorkStatus: formData["Right to work status*"] || "",
            dbsStatus: formData["DBS status*"] || "",
            photoIdAvailable: formData["Photo ID available*"] || "",
            proofOfAddress: formData["Proof of address available*"] || "",
            
            // Experience & Quals
            trainingCourseRequired: formData["Training course required*"] || "",
            currentRole: formData["Current role"] || "",
            previousCareExperience: formData["Previous care experience"] || "",
            existingQualifications: formData["Existing qualifications"] || "",
            preferredTrainingDate: formData["Preferred training date"] || "",
            trainingLocationPreference: formData["Training location preference"] || "",
            
            // Health & Accessibility
            healthCondition: formData["Health condition affecting training?"] || "",
            accessibilityRequirements: formData["Accessibility requirements"] || "",
            learningSupportNeeds: formData["Learning support needs"] || "",
            canAttendPractical: formData["Can attend practical sessions?"] || "",
            additionalNotes: formData["Additional notes"] || "",
            
            // Declarations & Consents
            fullName: formData["Full Name *"] || "",
            phoneNumberConfirmation: formData["Phone Number *"] || "",
            consentConfirmation: formData["Consent confirmation*"] || "",
            signatureName: formData["Signature name*"] || "",
            
            // System fields
            source: "training-service-page",
            formName: "Training Service Booking",
          };

          const response = await axios.post(
            `${API_URL}/api/website/training-booking/save`,
            payload,
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );

          if (response.data.success) {
            setSubmitSuccess(true);
            setFormData({});
            setErrors({});
            
            // Reset after 5 seconds
            setTimeout(() => {
              setSubmitSuccess(false);
              navigate(`/training-service?step=1#book-training`);
            }, 5000);
          } else {
            setSubmitError(response.data.message || "Failed to submit training booking");
          }
        } catch (err: any) {
          console.error("Error submitting training booking:", err);
          setSubmitError(err.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
          setIsSubmitting(false);
        }
      }
    } else {
      // Navigate to next step with validation
      if (validateStep(active)) {
        navigate(`/training-service?step=${next.id}#book-training`);
      }
    }
  };

  // Validate on mount to show initial errors if any
  const [isValidated, setIsValidated] = useState(false);

  // Run validation when form data changes
  useEffect(() => {
    if (isValidated) {
      validateStep(active);
    }
  }, [formData, active, isValidated]);

  return (
    <section className="page-section training-booking" id="book-training">
      <div className="container">
        <div className="training-booking__heading">
          <span aria-hidden="true" />
          <h2>Start Your Journey today</h2>
        </div>

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
            ✅ Your training booking has been submitted successfully! We will contact you shortly.
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

        <form className="training-booking__main__form" onSubmit={handleSubmit} noValidate>
          <div className="training-booking__stepper" aria-label="Training booking progress">
            {trainingSteps.map((step) => (
              <a 
                className={step.id === active.id ? "is-active" : undefined} 
                href={`/training-service?step=${step.id}#book-training`}
                onClick={(e) => handleStepChange(step.id, e)}
                key={step.id}
              >
                <span>{step.id}</span>
                <em>{step.label}</em>
              </a>
            ))}
          </div>

         <div className="training-booking__form">
          <div className="training-booking__copy">
            <small>Step {active.id} of {trainingSteps.length}</small>
            <h3>{active.title}</h3>
            <p>{active.description}</p>
          </div>
          <div className="training-booking__grid">
            {active.fields.map(([label, placeholder, width]) => {
              const value = formData[label] || "";
              const hasError = errors[label];
              const isSelect = placeholder === "Select";
              
              // Determine input type
              let inputType = "text";
              const labelLower = label.toLowerCase();
              if (labelLower.includes("email") && !labelLower.includes("alternative")) {
                inputType = "email";
              } else if (labelLower.includes("phone") && !labelLower.includes("national")) {
                inputType = "tel";
              } else if (labelLower.includes("date of birth")) {
                inputType = "date";
              }
              
              return (
                <label className={width === "wide" ? "is-wide" : undefined} key={label}>
                  <span>{label}</span>
                  {isSelect ? (
                    <select 
                      defaultValue="" 
                      value={value}
                      onChange={(e) => handleInputChange(label, e.target.value)}
                      style={hasError ? { borderColor: '#dc3545', backgroundColor: '#fff8f8' } : {}}
                      disabled={isSubmitting}
                    >
                      <option value="" disabled>Select</option>
                    </select>
                  ) : (
                    <input 
                      placeholder={placeholder} 
                      type={inputType}
                      value={value}
                      onChange={(e) => handleInputChange(label, e.target.value)}
                      style={hasError ? { borderColor: '#dc3545', backgroundColor: '#fff8f8' } : {}}
                      disabled={isSubmitting}
                    />
                  )}
                  {hasError && (
                    <span style={{ 
                      color: '#dc3545', 
                      fontSize: '0.75rem', 
                      display: 'block', 
                      marginTop: '0.25rem' 
                    }}>
                      {errors[label]}
                    </span>
                  )}
                </label>
              );
            })}
          </div>

          <div className="training-booking__actions">
            <a 
              href={`/training-service?step=${previous.id}#book-training`}
              onClick={(e) => handleStepChange(previous.id, e)}
              style={{ 
                pointerEvents: isFirstStep ? 'none' : 'auto',
                opacity: isFirstStep ? 0.5 : 1
              }}
            >
              Previous Step
            </a>
            <button 
              type="submit" 
              className="is-primary"
              disabled={isSubmitting}
              style={{ 
                background: isSubmitting ? '#ccc' : undefined,
                cursor: isSubmitting ? 'not-allowed' : 'pointer'
              }}
            >
              {isSubmitting ? "Submitting..." : 
                isLastStep ? "Submit Application" : 
                isFirstStep ? "Next Step" : "Save & Continue"}
            </button>
          </div>
          </div>
        </form>
      </div>
    </section>
  );
}

function TrainingPortfolio() {
  return (
    <section className="page-section training-portfolio">
      <div className="container training-portfolio__inner">
        <div className="training-portfolio__copy">
          <div className="dom-care-reasons__heading">
            <span aria-hidden="true" />
            <h2>Our Training Portfolio</h2>
          </div>
          <p>We offer a robust selection of mandatory and specialized training courses. Explore our current portfolio below:</p>
          <div className="training-portfolio__grid">
            {portfolioItems.map(([title, description]) => (
              <article key={title}>
                <img src="/assets/figma-exported/dom-care-reason-trained.svg" alt="" aria-hidden="true" />
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="training-portfolio__media">
          <img src="/assets/figma-exported/training-about.png" alt="Rumax training support" />
        </div>
      </div>
    </section>
  );
}