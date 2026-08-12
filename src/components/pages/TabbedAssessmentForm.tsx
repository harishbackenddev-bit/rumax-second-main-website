import { FormInputField, FormTextareaField, type FieldIconName } from "@/components/pages/PageFormControls";
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import axios from "axios";

type EnquiryType = "care" | "research";

type FieldConfig = {
  icon?: FieldIconName;
  label: string;
  placeholder: string;
  name: string;
  id?: string;
  required?: boolean;
  type?: string;
  options?: string[];
};

const enquiryTabs: Array<{ id: EnquiryType; label: string; description: string; buttonLabel: string }> = [
  {
    id: "care",
    label: "Care Enquiry",
    description: "Tell us about your care needs and we will arrange a free, no-obligation assessment.",
    buttonLabel: "Apply Now"
  },
  {
    id: "research",
    label: "Research Enquiry",
    description: "Tell us about your study, protocol needs, location and visit requirements.",
    buttonLabel: "Apply Now"
  }
];

const careFields: FieldConfig[] = [
  { label: "Full Name*", placeholder: "John Smith", icon: "user", name: "fullName", id: "care-full-name", required: true },
  { 
    label: "Relationship to Client", 
    placeholder: "Select", 
    name: "relationshipToClient", 
    id: "care-relationship",
    options: ["Select", "Self", "Spouse/Partner", "Parent", "Child", "Sibling", "Grandparent", "Grandchild", "Friend", "Other Family Member", "Professional"]
  },
  { label: "Email Address*", placeholder: "sarah@example.com", icon: "mail", name: "email", id: "care-email", required: true, type: "email" },
  { label: "Phone Number*", placeholder: "00 23 456 7890", icon: "phone", name: "phoneNumber", id: "care-phone", required: true, type: "tel" },
  { 
    label: "Postcode", 
    placeholder: "Enter your postcode", 
    name: "postcode", 
    id: "care-postcode",
    type: "text"
  },
  { 
    label: "Type of Care Required", 
    placeholder: "Select", 
    name: "careType", 
    id: "care-type",
    options: ["Select", "Personal Care", "Dementia Care", "Medication Management", "Respite Care", "24-Hour/Live-In Care", "Supported Living", "Companionship", "Palliative/End of Life Care", "Hospital Discharge Support", "Home Help"]
  },
  { 
    label: "When do you need care?", 
    placeholder: "Select", 
    name: "timeframe", 
    id: "care-timeframe",
    options: ["Select", "Immediately (Within 24 hours)", "Within 1 week", "Within 2 weeks", "Within 1 month", "Within 3 months", "Planning for future (3-6 months)", "Not sure yet"]
  },
  { 
    label: "Funding Type", 
    placeholder: "Select", 
    name: "fundingType", 
    id: "care-funding",
    options: ["Select", "Self-Funded (Private)", "Local Authority (Council Funded)", "NHS Continuing Healthcare", "Personal Budget/Direct Payment", "Health Insurance", "Combination of sources", "Not sure / Undecided"]
  }
];

const researchFields: FieldConfig[] = [
  { label: "Full Name*", placeholder: "John Smith", icon: "user", name: "fullName", id: "research-full-name", required: true },
  { label: "Organization", placeholder: "Enter Organization Name", name: "organization", id: "research-organization" },
  { label: "Job Title", placeholder: "e.g. Study Manager", name: "jobTitle", id: "research-job-title" },
  { label: "Email Address*", placeholder: "sarah@example.com", icon: "mail", name: "email", id: "research-email", required: true, type: "email" },
  { label: "Phone Number*", placeholder: "00 23 456 7890", icon: "phone", name: "phoneNumber", id: "research-phone", required: true, type: "tel" },
  { 
    label: "Regions/Locations Required", 
    placeholder: "Select", 
    name: "regions", 
    id: "research-regions",
    options: ["Select", "London", "South East", "South West", "East Midlands", "West Midlands", "North West", "North East", "Yorkshire", "Scotland", "Wales", "Northern Ireland", "Multiple Regions", "UK Wide"]
  },
  { 
    label: "Support Required", 
    placeholder: "Select", 
    name: "supportRequired", 
    id: "research-support",
    options: ["Select", "Homecare Visit Management", "Direct-to-Patient Logistics", "Site Administrative Support", "Regulatory & Compliance Training", "Feasibility & Recruitment Support", "Study Coordination", "Sample Collection & Handling", "Remote Patient Monitoring", "Multiple Services"]
  },
  { 
    label: "Timeline", 
    placeholder: "Select", 
    name: "timeline", 
    id: "research-timeline",
    options: ["Select", "Immediate (Within 2 weeks)", "Short-term (1-3 months)", "Medium-term (3-6 months)", "Long-term (6-12 months)", "Planning for future (12+ months)", "Not yet determined"]
  },
  { 
    label: "Funding Type", 
    placeholder: "Select", 
    name: "fundingType", 
    id: "research-funding",
    options: ["Select", "Sponsor Funded", "CRO Funded", "Grant Funded", "NHS Funded", "Combination", "Other"]
  }
];

export function TabbedAssessmentForm({ activeTab = "care" }: { activeTab?: EnquiryType }) {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
  
  const activeConfig = enquiryTabs.find((tab) => tab.id === activeTab) ?? enquiryTabs[0];
  const fields = activeTab === "care" ? careFields : researchFields;
  
  // Form state
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Reset form when tab changes
  useEffect(() => {
    setFormData({});
    setErrors({});
    setSubmitError(null);
    setSubmitSuccess(false);
  }, [activeTab]);

  // Validation functions
  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    return /^[\d\s\-+()]{10,15}$/.test(phone.replace(/\s/g, ''));
  };

  const validateName = (name: string): boolean => {
    return name.trim().length >= 2;
  };

  const validatePostcode = (postcode: string): boolean => {
    // UK Postcode format: AA9A 9AA, A9A 9AA, A9 9AA, A99 9AA, AA9 9AA, AA99 9AA
    const ukPostcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;
    return ukPostcodeRegex.test(postcode);
  };

const validateSelect = (value: string): boolean => {
  return value !== "" && value !== "Select";
};

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    fields.forEach((field) => {
      const value = formData[field.name] || "";
      const isRequired = field.required || field.label.includes('*');

      if (isRequired) {
        // Check if empty
        if (!value || !value.trim() || value === "Select") {
          newErrors[field.name] = `${field.label.replace(/\*/g, "").trim()} is required`;
          isValid = false;
          return;
        }

        // Field-specific validation
        const labelLower = field.label.toLowerCase();

        // Email validation
        if (labelLower.includes("email")) {
          if (!validateEmail(value)) {
            newErrors[field.name] = "Please enter a valid email address (e.g., name@domain.com)";
            isValid = false;
          }
        }

        // Phone validation
        if (labelLower.includes("phone")) {
          if (!validatePhone(value)) {
            newErrors[field.name] = "Please enter a valid phone number (10-15 digits)";
            isValid = false;
          }
        }

        // Name validation
        if (labelLower.includes("name") && !labelLower.includes("relationship")) {
          if (!validateName(value)) {
            newErrors[field.name] = "Please enter at least 2 characters";
            isValid = false;
          }
        }

        // Postcode validation (if it's the postcode field and has a value)
        if (field.name === "postcode" && value && value.trim()) {
          if (!validatePostcode(value)) {
            newErrors[field.name] = "Please enter a valid UK postcode (e.g., SW1A 1AA)";
            isValid = false;
          }
        }
      } else {
        // Optional field validation - Postcode is optional but validate if filled
        if (field.name === "postcode" && value && value.trim()) {
          if (!validatePostcode(value)) {
            newErrors[field.name] = "Please enter a valid UK postcode (e.g., SW1A 1AA)";
            isValid = false;
          }
        }
        
        // Check if select fields have valid selection (not "Select")
        if (field.options && value && value === "Select") {
          newErrors[field.name] = "Please select an option";
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    if (submitError) setSubmitError(null);
  };

  const handleTabChange = (tabId: EnquiryType, e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate(`/contact-us?enquiry=${tabId}#assessment-form`);
    
    // Smooth scroll to form
    const formElement = document.getElementById('assessment-form');
    if (formElement) {
      setTimeout(() => {
        formElement.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to first error
      const firstError = document.querySelector('.form-input.error, .form-select.error, .form-field-wrapper .error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      // Prepare payload based on enquiry type
      let payload: any = {
        enquiryType: activeTab,
        fullName: formData.fullName || "",
        email: formData.email || "",
        phoneNumber: formData.phoneNumber || "",
        additionalInfo: formData.additionalInfo || "",
        source: "contact-us-page",
        formName: activeTab === "care" ? "Care Enquiry Form" : "Research Enquiry Form",
      };

      if (activeTab === "care") {
        payload = {
          ...payload,
          relationshipToClient: formData.relationshipToClient || null,
          postcode: formData.postcode || null,
          careType: formData.careType || null,
          timeframe: formData.timeframe || null,
          fundingType: formData.fundingType || null,
        };
      } else {
        payload = {
          ...payload,
          organization: formData.organization || null,
          jobTitle: formData.jobTitle || null,
          regions: formData.regions || null,
          supportRequired: formData.supportRequired || null,
          timeline: formData.timeline || null,
          fundingType: formData.fundingType || null,
        };
      }

      const response = await axios.post(
        `${API_URL}/api/website/enquiry/save`,
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
        
        // Auto-hide success after 5 seconds
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 5000);
      } else {
        setSubmitError(response.data.message || "Failed to submit enquiry");
      }
    } catch (err: any) {
      console.error("Error submitting enquiry:", err);
      setSubmitError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle field change
  const handleFieldChange = (name: string, value: string) => {
    handleInputChange(name, value);
  };

  // Check if field is a select field
  const isSelectField = (field: FieldConfig): boolean => {
    return !!field.options && field.options.length > 0;
  };

  // Generate unique ID for labels
  const getFieldId = (field: FieldConfig): string => {
    return field.id || `${activeTab}-${field.name}`;
  };

  return (
    <section className="page-section assessment-section tabbed-assessment-section" id="assessment-form">
      <div className="container assessment-section__inner">
        <div className="page-section__heading">
          <h2>Request A Free Assessment</h2>
          <p>{activeConfig.description}</p>
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
            ✅ Thank you! Your enquiry has been submitted successfully. We will contact you within one working day.
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

        <div className="form-tabs" aria-label="Enquiry type">
          {enquiryTabs.map((tab) => (
            <a
              aria-pressed={activeTab === tab.id}
              className={activeTab === tab.id ? "is-active" : undefined}
              href={`/contact-us?enquiry=${tab.id}#assessment-form`}
              key={tab.id}
              role="button"
              onClick={(e) => handleTabChange(tab.id, e)}
            >
              {tab.label}
            </a>
          ))}
        </div>

        <form
          className="assessment-form"
          id={`${activeTab}-enquiry-panel`}
          key={activeTab}
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="form-grid">
            {fields.map((field) => {
              const value = formData[field.name] || "";
              const hasError = errors[field.name];
              const isSelect = isSelectField(field);
              const fieldId = getFieldId(field);
              
              return (
                <div key={field.name} className="form-field-wrapper">
                  {isSelect ? (
                    <div className="form-field">
                      <label htmlFor={fieldId} className="form-label">
                        {field.label}
                        {field.required && <span className="required" style={{ color: '#dc3545', marginLeft: '2px' }}>*</span>}
                      </label>
                      <select
                        id={fieldId}
                        name={field.name}
                        className={`form-select ${hasError ? 'error' : ''}`}
                        value={value}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        disabled={isSubmitting}
                        style={hasError ? { borderColor: '#dc3545', backgroundColor: '#fff8f8' } : {}}
                      >
                        {field.options?.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      {hasError && (
                        <span className="error-text" style={{ 
                          color: '#dc3545', 
                          fontSize: '0.75rem', 
                          display: 'block', 
                          marginTop: '0.25rem' 
                        }}>
                          {errors[field.name]}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="form-field">
                      <FormInputField
                        id={fieldId}
                        name={field.name}
                        icon={field.icon}
                        label={field.label}
                        placeholder={field.placeholder}
                        type={field.type || "text"}
                        value={value}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange(field.name, e.target.value)}
                        disabled={isSubmitting}
                      />
                      {hasError && (
                        <span className="error-text" style={{ 
                          color: '#dc3545', 
                          fontSize: '0.75rem', 
                          display: 'block', 
                          marginTop: '0.25rem' 
                        }}>
                          {errors[field.name]}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="form-field form-field--full">
            <FormTextareaField
              id={`${activeTab}-additional-info`}
              name="additionalInfo"
              icon="message"
              label="Additional information"
              rows={6}
              placeholder={
                activeTab === "care"
                  ? "Please share any relevant details about care needs, medical conditions, or specific requirements..."
                  : "Please share protocol requirements, visit procedures, sample handling needs, timelines, and coverage areas..."
              }
              value={formData.additionalInfo || ""}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleFieldChange("additionalInfo", e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting}
            style={{
              opacity: isSubmitting ? 0.7 : 1,
              cursor: isSubmitting ? 'not-allowed' : 'pointer'
            }}
          >
            {isSubmitting ? "Submitting..." : activeConfig.buttonLabel}
          </button>
        </form>
      </div>
    </section>
  );
}