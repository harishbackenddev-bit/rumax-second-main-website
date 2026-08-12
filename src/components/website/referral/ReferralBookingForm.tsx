// ReferralBookingForm.tsx
import { useState, FormEvent, useRef, useEffect } from "react";
import axios from "axios";

type Step = {
  id: string;
  label: string;
  title: string;
  description: string;
  fields: string[][];
};

type ReferralBookingFormProps = {
  steps: Step[];
  initialStep?: string;
  apiEndpoint?: string;
  formName?: string;
};

export default function ReferralBookingForm({
  steps,
  initialStep = "1",
  apiEndpoint = "/api/website/referral/save",
  formName = "Referral Form"
}: ReferralBookingFormProps) {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  // Use state to manage current step instead of URL
  const [currentStepId, setCurrentStepId] = useState<string>(initialStep);
  const active = steps.find((item) => item.id === currentStepId) ?? steps[0];

  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentIndex = steps.findIndex((step) => step.id === active.id);
  const previous = steps[Math.max(0, currentIndex - 1)];
  const next = steps[Math.min(steps.length - 1, currentIndex + 1)];
  const isFirstStep = currentIndex === 0;
  const isLastStep = currentIndex === steps.length - 1;

  // Reset form when steps change
  useEffect(() => {
    setFormData({});
    setErrors({});
    setSubmitError(null);
    setSubmitSuccess(false);
    setUploadedFile(null);
  }, [steps]);

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
    return /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i.test(postcode);
  };

  const validateStep = (step: Step): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    step.fields.forEach((field) => {
      const label = field[0];
      const fieldType = field[1] || 'text';
      const isRequired = label.includes('*');

      if (isRequired) {
        if (fieldType === 'checkbox') {
          if (!formData[label]) {
            newErrors[label] = `You must agree to ${label.toLowerCase()}`;
            isValid = false;
          }
        } else if (fieldType === 'Radio') {
          if (!formData[label]) {
            newErrors[label] = `Please select an option`;
            isValid = false;
          }
        } else if (fieldType === 'upload') {
          if (!uploadedFile && !formData[label]) {
            newErrors[label] = `Please upload a file`;
            isValid = false;
          }
        } else if (fieldType === 'select') {
          if (!formData[label] || formData[label] === 'Select' || formData[label] === '') {
            newErrors[label] = `${label.replace(/\*/g, "").trim()} is required`;
            isValid = false;
          }
        } else {
          const value = formData[label] || "";
          if (!value.trim()) {
            newErrors[label] = `${label.replace(/\*/g, "").trim()} is required`;
            isValid = false;
            return;
          }

          // Field-specific validation
          const labelLower = label.toLowerCase();

          if (labelLower.includes('email')) {
            if (!validateEmail(value)) {
              newErrors[label] = "Please enter a valid email address";
              isValid = false;
            }
          }

          if (labelLower.includes('phone') && !labelLower.includes('emergency')) {
            if (!validatePhone(value)) {
              newErrors[label] = "Please enter a valid phone number (10-15 digits)";
              isValid = false;
            }
          }

          if (labelLower.includes('name') && !labelLower.includes('preferred')) {
            if (!validateName(value)) {
              newErrors[label] = "Please enter at least 2 characters";
              isValid = false;
            }
          }

          if (labelLower.includes('postcode')) {
            if (!validatePostcode(value)) {
              newErrors[label] = "Please enter a valid UK postcode";
              isValid = false;
            }
          }
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (label: string, value: any) => {
    setFormData(prev => ({ ...prev, [label]: value }));

    if (errors[label]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[label];
        return newErrors;
      });
    }

    if (submitError) setSubmitError(null);
  };

  const handleCheckboxChange = (label: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [label]: checked }));

    if (errors[label]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[label];
        return newErrors;
      });
    }
  };

  const handleRadioChange = (label: string, value: string) => {
    setFormData(prev => ({ ...prev, [label]: value }));

    if (errors[label]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[label];
        return newErrors;
      });
    }
  };

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setUploadProgress(0);
    setIsUploading(true);

    // Clear upload error
    const uploadField = active.fields.find(f => f[1] === 'upload');
    if (uploadField && errors[uploadField[0]]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[uploadField[0]];
        return newErrors;
      });
    }

    // Upload file to server
    try {
      const token = localStorage.getItem("token");
      const uploadFormData = new FormData();
      uploadFormData.append("document", file);

      const response = await axios.post(
        `${API_URL}/api/auth/upload-document`,
        uploadFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(progress);
            }
          },
        }
      );

      if (response.data.success) {
        let fileUrl = response.data.data?.url ||
          response.data.data?.fileUrl ||
          response.data.data?.documentUrl ||
          response.data.data?.path;

        if (fileUrl) {
          fileUrl = `/${fileUrl.replace(/^\/?public\//, '')}`;
        }

        // Store the file URL in form data
        const uploadFieldLabel = active.fields.find(f => f[1] === 'upload')?.[0] || 'uploadedFile';
        setFormData(prev => ({
          ...prev,
          [uploadFieldLabel]: fileUrl,
          uploadedFile: file.name,
          uploadedFileName: file.name,
          uploadedFileUrl: fileUrl
        }));
      } else {
        setSubmitError("Failed to upload file");
      }
    } catch (error: any) {
      console.error("Error uploading file:", error);
      setSubmitError(error.response?.data?.message || "Failed to upload file");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleStepChange = (stepId: string, e?: React.MouseEvent<HTMLAnchorElement>) => {
    if (e) e.preventDefault();

    const targetStep = steps.find(s => s.id === stepId);
    if (!targetStep) return;

    const targetIndex = steps.indexOf(targetStep);

    // If going forward, validate
    if (targetIndex > currentIndex) {
      if (validateStep(active)) {
        setCurrentStepId(stepId);
        // Scroll to form
        document.getElementById('book-referral')?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Going backward - no validation needed
      setCurrentStepId(stepId);
      document.getElementById('book-referral')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (isLastStep) {
      if (validateStep(active)) {
        setIsSubmitting(true);
        setSubmitError(null);
        setSubmitSuccess(false);

        try {
          // Prepare payload - map form fields to API expected fields
          const payload = {
            // Client Details
            firstName: formData["First Name *"] || "",
            lastName: formData["Last Name *"] || "",
            clientFullName: formData["Client Full Name *"] || formData["Full Name *"] || "",
            dateOfBirth: formData["Date of Birth *"] || "",
            currentLocation: formData["Current Location *"] || "",
            phoneNumber: formData["Phone Number *"] || "",
            email: formData["Email Address *"] || "",

            // Referrer Details
            organization: formData["Organization / Trust / Local Authority *"] || "",
            jobTitle: formData["Job Title / Role *"] || "",

            // Referral Details
            primaryReason: formData["Primary Reason for Referral *"] || "",
            briefSummary: formData["Brief Summary of Needs *"] || "",
            urgencyLevel: formData["Urgency Level *"] || "standard",
            estimatedDischargeDate: formData["Estimated Discharge Date (if in hospital)"] || "",
            additionalInfo: formData["Additional information or questions (optional)"] || "",

            // File Uploads
            uploadedFile: formData.uploadedFile || null,
            uploadedFileName: formData.uploadedFileName || null,
            uploadedFileUrl: formData.uploadedFileUrl || null,

            // Consents
            consentData: formData["I agree to the secure processing of this data in accordance with the Data Protection Act / GDPR. *"] || false,
            consentReferral: formData["I confirm that the client or their legal representative has consented to this referral being made to RUMAX LIMITED. *"] || false,

            // System fields
            source: "referral-form",
            formName: formName || "Referral Form",
          };

          const response = await axios.post(
            `${API_URL}${apiEndpoint}`,
            payload,
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );

          if (response.data.success) {
            setSubmitSuccess(true);
            // Reset form after success
            setTimeout(() => {
              setSubmitSuccess(false);
              setCurrentStepId("1");
              setFormData({});
              setUploadedFile(null);
              document.getElementById('book-referral')?.scrollIntoView({ behavior: 'smooth' });
            }, 3000);
          } else {
            setSubmitError(response.data.message || "Failed to submit referral");
          }
        } catch (error: any) {
          console.error("Error submitting referral:", error);
          setSubmitError(error.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
          setIsSubmitting(false);
        }
      }
    } else {
      if (validateStep(active)) {
        setCurrentStepId(next.id);
        document.getElementById('book-referral')?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const renderField = (field: string[]) => {
    const label = field[0];
    const placeholder = field[1] || 'text';
    const width = field[2] || '';
    const value = formData[label] || "";
    const hasError = errors[label];
    const isSelect = placeholder === "select" || placeholder === "Select";
    const isCheckbox = placeholder === "checkbox";
    const isRadio = placeholder === "Radio";
    const isUpload = placeholder === "upload";
    const isWide = width === "wide";
    const isRequired = label.includes('*');

    const fieldId = label
      .replace(/\*/g, "")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .toLowerCase();

    // Determine input type
    let inputType = "text";
    const labelLower = label.toLowerCase();
    if (labelLower.includes("email")) {
      inputType = "email";
    } else if (labelLower.includes("phone")) {
      inputType = "tel";
    } else if (labelLower.includes("date") || labelLower.includes("dob")) {
      inputType = "date";
    }

    if (isCheckbox) {
      const isChecked = formData[label] || false;
      return (
        <label className={isWide ? "is-wide" : undefined} key={label}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <input
              id={fieldId}
              name={fieldId}
              type="checkbox"
              checked={isChecked}
              onChange={(e) => handleCheckboxChange(label, e.target.checked)}
              style={{ marginTop: '4px', width: '18px', height: '18px' }}
              disabled={isSubmitting || isUploading}
            />
            <span>{label}</span>
          </div>
          {hasError && <span className="error-message" style={{ color: '#dc3545', fontSize: '0.75rem', display: 'block', marginTop: '0.25rem' }}>{errors[label]}</span>}
        </label>
      );
    }

    if (isRadio) {
      return (
        <label className={isWide ? "is-wide" : undefined} key={label}>
          <span>{label}</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="radio"
                name={label}
                value="standard"
                checked={value === 'standard'}
                onChange={(e) => handleRadioChange(label, e.target.value)}
                disabled={isSubmitting || isUploading}
              />
              Standard (Assessment within 48 hrs)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="radio"
                name={label}
                value="urgent"
                checked={value === 'urgent'}
                onChange={(e) => handleRadioChange(label, e.target.value)}
                disabled={isSubmitting || isUploading}
              />
              Urgent (Requires immediate attention/same-day contact)
            </label>
          </div>
          {hasError && <span className="error-message" style={{ color: '#dc3545', fontSize: '0.75rem', display: 'block', marginTop: '0.25rem' }}>{errors[label]}</span>}
        </label>
      );
    }

    if (isUpload) {
      return (
        <label className={isWide ? "is-wide" : undefined} key={label}>
          <span>{label}</span>
          <div
            className="upload-box"
            style={{
              border: isDragging ? '2px dashed #5b2a86' : '2px dashed #c9c9d1',
              borderRadius: '10px',
              padding: '40px 20px',
              textAlign: 'center',
              backgroundColor: isDragging ? '#f0ebf5' : '#fff',
              cursor: isSubmitting || isUploading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              marginTop: '8px',
              opacity: isSubmitting || isUploading ? 0.6 : 1
            }}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !isSubmitting && !isUploading && fileInputRef.current?.click()}
          >
            <div style={{ fontSize: '34px', marginBottom: '14px' }}>⬆</div>
            <p style={{ fontSize: '13px', color: '#1f1f24', margin: '0 0 6px' }}>
              <strong>Drag and drop files here</strong> or click to browse
            </p>
            <p style={{ fontSize: '12px', color: '#7a7a83', margin: '0 0 20px' }}>
              Accepts PDF, DOCX. Max file size 20MB. Fully encrypted and GDPR compliant.
            </p>

            {isUploading && (
              <div style={{ marginTop: '12px' }}>
                <div style={{
                  width: '100%',
                  height: '6px',
                  background: '#e0e0e0',
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${uploadProgress}%`,
                    height: '100%',
                    background: '#5b2a86',
                    borderRadius: '3px',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
                <p style={{ fontSize: '12px', color: '#5b2a86', marginTop: '4px' }}>
                  Uploading... {uploadProgress}%
                </p>
              </div>
            )}

            <input
              id={fieldId}
              name={fieldId}
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
              accept=".pdf,.docx,.doc"
              disabled={isSubmitting || isUploading}
            />
            {uploadedFile && !isUploading && (
              <div style={{ marginTop: '12px', color: '#17b169' }}>
                ✓ {uploadedFile.name} uploaded successfully
              </div>
            )}
            {formData.uploadedFileUrl && !isUploading && !uploadedFile && (
              <div style={{ marginTop: '12px', color: '#17b169' }}>
                ✓ File uploaded: {formData.uploadedFileName || 'File'}
              </div>
            )}
          </div>
          {hasError && <span className="error-message" style={{ color: '#dc3545', fontSize: '0.75rem', display: 'block', marginTop: '0.25rem' }}>{errors[label]}</span>}
        </label>
      );
    }

    return (
      <label className={isWide ? "is-wide" : undefined} key={label}>
        <span>
          {label}
          {isRequired && <span style={{ color: '#dc3545', marginLeft: '2px' }}>*</span>}
        </span>
        {isSelect ? (
          <select
            id={fieldId}
            name={fieldId}
            value={value}
            onChange={(e) => handleInputChange(label, e.target.value)}
            disabled={isSubmitting || isUploading}
            style={hasError ? { borderColor: '#dc3545', backgroundColor: '#fff8f8' } : {}}
          >
            <option value="" disabled>Select</option>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </select>
        ) : (
          <input
            id={fieldId}
            name={fieldId}
            type={inputType}
            placeholder={placeholder}
            value={value}
            onChange={(e) => handleInputChange(label, e.target.value)}
            disabled={isSubmitting || isUploading}
            style={hasError ? { borderColor: '#dc3545', backgroundColor: '#fff8f8' } : {}}
          />
        )}
        {hasError && <span className="error-message" style={{ color: '#dc3545', fontSize: '0.75rem', display: 'block', marginTop: '0.25rem' }}>{errors[label]}</span>}
      </label>
    );
  };

  return (
    <section className="page-section training-booking referral" id="book-referral">
      <div className="container">
        <div className="training-booking__heading">
          <span aria-hidden="true" />
          <h2>Secure Online Referral Portal</h2>
          <p style={{ fontSize: '14px', color: '#7a7a83', marginTop: '8px' }}>
            Complete the form below to submit your referral securely
          </p>
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
            ✅ Thank you! Your referral has been submitted successfully. We will review it promptly.
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

        <form className="referal_form" onSubmit={handleSubmit} noValidate>
          <div className="training-booking__stepper" aria-label="Referral progress">
            {steps.map((step) => (
              <a
                className={step.id === active.id ? "is-active" : undefined}
                href="#"
                onClick={(e) => handleStepChange(step.id, e)}
                key={step.id}
                style={{
                  pointerEvents: (isSubmitting || isUploading) ? 'none' : 'auto',
                  opacity: (isSubmitting || isUploading) ? 0.6 : 1
                }}
              >
                <span>{step.id}</span>
                <em>{step.label}</em>
              </a>
            ))}
          </div>

          <div className="training-booking__copy">
            <small>Step {active.id} of {steps.length}</small>
            <h3>{active.title}</h3>
            <p>{active.description}</p>
          </div>

          <div className="training-booking__grid">
            {active.fields.map(renderField)}
          </div>

          <div className="training-booking__actions">
            <a
              href="#"
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
              disabled={isSubmitting || isUploading}
              style={{
                background: (isSubmitting || isUploading) ? '#ccc' : undefined,
                cursor: (isSubmitting || isUploading) ? 'not-allowed' : 'pointer'
              }}
            >
              {isUploading ? `Uploading... ${uploadProgress}%` :
                isSubmitting ? "Submitting..." :
                  isLastStep ? "Submit Referral" :
                    isFirstStep ? "Save & Continue" : "Save & Continue"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}