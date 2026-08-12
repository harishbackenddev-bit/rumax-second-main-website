import React, { useRef, useState, useEffect } from "react";
import "./FeedbackSection.css";
import {
  SparkleIcon,
  HappyIcon,
  NeutralIcon,
  WorriedIcon,
  FrustratedIcon,
  UpsetIcon,
  MessageIcon,
  MicIcon,
  VideoIcon,
  UploadIcon,
  PaperclipIcon,
} from "./icons";
import axios from "axios";

type MoodKey = "happy" | "neutral" | "worried" | "frustrated" | "upset";
type MethodKey = "write" | "voice" | "video";

const MOODS: { key: MoodKey; label: string; Icon: React.FC<{ className?: string }> }[] = [
  { key: "happy", label: "Happy", Icon: HappyIcon },
  { key: "neutral", label: "Neutral", Icon: NeutralIcon },
  { key: "worried", label: "Worried", Icon: WorriedIcon },
  { key: "frustrated", label: "Frustrated", Icon: FrustratedIcon },
  { key: "upset", label: "Upset", Icon: UpsetIcon },
];

const METHODS: {
  key: MethodKey;
  title: string;
  desc: string;
  Icon: React.FC<{ className?: string }>;
}[] = [
    { key: "write", title: "Write Your Message", desc: "Type written feedback", Icon: MessageIcon },
    { key: "voice", title: "Record Voice Note", desc: "Record a spoken message", Icon: MicIcon },
    { key: "video", title: "Submit Video Feedback", desc: "Upload a short video", Icon: VideoIcon },
  ];

export default function FeedbackSection() {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const [selectedMood, setSelectedMood] = useState<MoodKey | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<MethodKey>("write");
  const [isDragOver, setIsDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);

  // Voice recording states
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordingError, setRecordingError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    urgency: "",
    message: "",
    mood: "",
    feedbackMethod: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const attachmentInputRef = useRef<HTMLInputElement | null>(null);

  // Audio recording refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Validation functions
  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    return /^[\d\s\-+()]{10,15}$/.test(phone.replace(/\s/g, ''));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
      isValid = false;
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
      isValid = false;
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
      isValid = false;
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
      isValid = false;
    }

    // Phone Number validation
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
      isValid = false;
    } else if (!validatePhone(formData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number (10-15 digits)";
      isValid = false;
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Urgency validation
    if (!formData.urgency) {
      newErrors.urgency = "Please select urgency level";
      isValid = false;
    }

    // Message validation (only for write method)
    if (selectedMethod === "write" && !formData.message.trim()) {
      newErrors.message = "Please enter your feedback message";
      isValid = false;
    }

    // Voice recording validation
    if (selectedMethod === "voice" && !audioBlob) {
      newErrors.voice = "Please record a voice message";
      isValid = false;
    }

    // Mood validation
    if (!selectedMood) {
      newErrors.mood = "Please select how you're feeling";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Clean up recording on unmount
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    const fieldMap: Record<string, string> = {
      "fb-first-name": "firstName",
      "fb-last-name": "lastName",
      "fb-phone": "phoneNumber",
      "fb-email": "email",
      "fb-urgency": "urgency",
      "fb-message": "message",
    };

    const fieldName = fieldMap[id] || id;
    setFormData(prev => ({ ...prev, [fieldName]: value }));

    // Clear error for this field
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }

    if (submitError) setSubmitError(null);
  };

  const handleMoodSelect = (mood: MoodKey) => {
    setSelectedMood(mood);
    setFormData(prev => ({ ...prev, mood }));
    if (errors.mood) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.mood;
        return newErrors;
      });
    }
  };

  const handleMethodSelect = (method: MethodKey) => {
    setSelectedMethod(method);
    setFormData(prev => ({ ...prev, feedbackMethod: method }));
    if (errors.feedbackMethod) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.feedbackMethod;
        return newErrors;
      });
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAttachmentFile(e.target.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  // Voice Recording Functions
  const startRecording = async () => {
    setRecordingError(null);
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingDuration(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);

        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());

        // Clear timer
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current);
          recordingTimerRef.current = null;
        }
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Start timer
      let seconds = 0;
      recordingTimerRef.current = setInterval(() => {
        seconds++;
        setRecordingDuration(seconds);
      }, 1000);

    } catch (error) {
      console.error("Error accessing microphone:", error);
      setRecordingError("Unable to access microphone. Please check your permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
    }
  };

  const playRecording = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const deleteRecording = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingDuration(0);
    if (errors.voice) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.voice;
        return newErrors;
      });
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Helper function to construct full URL
  const constructFileUrl = (filePath: string): string => {
    if (!filePath) return '';

    return filePath;
  };
  // Upload file function
  const uploadFile = async (file: File, uploadType: string = "document"): Promise<string | null> => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const token = localStorage.getItem("token");
      const uploadFormData = new FormData();
      uploadFormData.append(uploadType, file);

      let endpoint = "";
      switch (uploadType) {
        case "certificate":
          endpoint = "/api/auth/upload-certificate";
          break;
        case "drivingLicence":
          endpoint = "/api/auth/upload-driving-licence";
          break;
        case "dbsCertificate":
          endpoint = "/api/auth/upload-dbs";
          break;
        case "resume":
          endpoint = "/api/auth/upload-resume";
          break;
        default:
          endpoint = "/api/auth/upload-document";
      }

      const response = await axios.post(
        `${API_URL}${endpoint}`,
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
        // Get the URL from response
        let fileUrl = response.data.data?.url ||
          response.data.data?.fileUrl ||
          response.data.data?.documentUrl ||
          response.data.data?.path;

        // Construct full URL
        const fullUrl = constructFileUrl(fileUrl);
        setUploadedFileUrl(fullUrl);
        return fullUrl;
      }
      return null;
    } catch (error: any) {
      console.error("Error uploading file:", error);
      setSubmitError(error.response?.data?.message || "Failed to upload file");
      return null;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Upload audio file
  const uploadAudioFile = async (audioBlob: Blob): Promise<string | null> => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const token = localStorage.getItem("token");
      const uploadFormData = new FormData();
      const audioFile = new File([audioBlob], `voice-recording-${Date.now()}.webm`, { type: 'audio/webm' });
      uploadFormData.append("document", audioFile);

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

        const fullUrl = constructFileUrl(fileUrl);
        setUploadedFileUrl(fullUrl);
        return fullUrl;
      }
      return null;
    } catch (error: any) {
      console.error("Error uploading audio:", error);
      setSubmitError(error.response?.data?.message || "Failed to upload audio");
      return null;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to first error
      const firstError = document.querySelector('.feedback-section__input.error, .feedback-section__select.error, .feedback-section__textarea.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      let attachmentUrl = null;
      let videoUrl = null;
      let audioUrlFromUpload = null;

      // Upload attachment file if exists
      if (attachmentFile) {
        attachmentUrl = await uploadFile(attachmentFile, "document");
        if (!attachmentUrl) {
          setSubmitError("Failed to upload attachment");
          setIsSubmitting(false);
          return;
        }
      }

      // Upload video file if exists (for video method)
      if (selectedMethod === "video" && file) {
        videoUrl = await uploadFile(file, "document");
        if (!videoUrl) {
          setSubmitError("Failed to upload video");
          setIsSubmitting(false);
          return;
        }
      }

      // Upload audio recording if exists (for voice method)
      if (selectedMethod === "voice" && audioBlob) {
        audioUrlFromUpload = await uploadAudioFile(audioBlob);
        if (!audioUrlFromUpload) {
          setSubmitError("Failed to upload voice recording");
          setIsSubmitting(false);
          return;
        }
      }

      // Submit feedback
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        fullName: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        phoneNumber: formData.phoneNumber.trim(),
        email: formData.email.trim(),
        urgency: formData.urgency,
        mood: selectedMood,
        feedbackMethod: selectedMethod,
        message: selectedMethod === "write" ? formData.message.trim() : `Voice recording submitted (${formatDuration(recordingDuration)})`,
        attachmentUrl: attachmentUrl,
        videoUrl: videoUrl,
        audioUrl: audioUrlFromUpload,
        attachmentFileName: attachmentFile?.name || null,
        videoFileName: file?.name || null,
        audioDuration: recordingDuration,
        source: "feedback-section",
        formName: "Feedback Form",
      };

      const response = await axios.post(
        `${API_URL}/api/website/feedback/save`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        setSubmitSuccess(true);
        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          phoneNumber: "",
          email: "",
          urgency: "",
          message: "",
          mood: "",
          feedbackMethod: "",
        });
        setSelectedMood(null);
        setSelectedMethod("write");
        setFile(null);
        setAttachmentFile(null);
        setUploadedFileUrl(null);
        setAudioBlob(null);
        setAudioUrl(null);
        setRecordingDuration(0);
        setErrors({});

        // Auto-hide success after 5 seconds
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 5000);
      } else {
        setSubmitError(response.data.message || "Failed to submit feedback");
      }
    } catch (err: any) {
      console.error("Error submitting feedback:", err);
      setSubmitError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="feedback-section">
      <div className="feedback-section__header">
        <div className="feedback-section__icon">
          <SparkleIcon className="feedback-section__icon-svg" />
        </div>
        <h1 className="feedback-section__title">
          Your Feedback Matters: Help Us Improve Our Care
        </h1>
        <p className="feedback-section__subtitle">
          Share your concerns or feedback with RUMAX. We listen, support, and resolve directly.
        </p>
      </div>

      <div className="feedback-section__panel">
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
            ✅ Thank you! Your feedback has been submitted successfully. The Registered Manager will review it promptly.
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

        {/* Upload Progress */}
        {isUploading && (
          <div style={{
            background: "#e7f3ff",
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "20px",
            border: "1px solid #b3d9ff"
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: '500' }}>Uploading file...</span>
              <span style={{ fontSize: '14px' }}>{uploadProgress}%</span>
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              background: '#e0e0e0',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${uploadProgress}%`,
                height: '100%',
                background: '#3b82f6',
                borderRadius: '4px',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        )}

        {/* Step 1: Mood selector */}
        <p className="feedback-section__step-label">Step 1: How can we help today?</p>
        {errors.mood && (
          <span style={{ color: '#dc3545', fontSize: '0.75rem', display: 'block', marginBottom: '10px' }}>
            {errors.mood}
          </span>
        )}
        <div className="mood-grid">
          {MOODS.map((mood) => (
            <div
              key={mood.key}
              className={`mood-card mood-card--${mood.key} ${selectedMood === mood.key ? "mood-card--active" : ""
                }`}
              onClick={() => handleMoodSelect(mood.key)}
              role="button"
              tabIndex={0}
              style={{ cursor: isSubmitting || isUploading ? 'not-allowed' : 'pointer', opacity: isSubmitting || isUploading ? 0.6 : 1 }}
            >
              <span className="mood-card__icon">
                <mood.Icon className="mood-card__icon-svg" />
              </span>
              <span className="mood-card__label">{mood.label}</span>
            </div>
          ))}
        </div>

        {/* Step 2: Method selector */}
        <p className="feedback-section__step-label">
          Step 2: Share your concern or feedback in your preferred way:
        </p>
        <div className="method-grid">
          {METHODS.map((method) => (
            <div
              key={method.key}
              className={`method-card ${selectedMethod === method.key ? "method-card--active" : ""
                }`}
              onClick={() => handleMethodSelect(method.key)}
              role="button"
              tabIndex={0}
              style={{ cursor: isSubmitting || isUploading ? 'not-allowed' : 'pointer', opacity: isSubmitting || isUploading ? 0.6 : 1 }}
            >
              <span className="method-card__icon">
                <method.Icon className="method-card__icon-svg" />
              </span>
              <p className="method-card__title">{method.title}</p>
              <p className="method-card__desc">{method.desc}</p>
            </div>
          ))}
        </div>

        {/* Method content */}
        <div className="feedback-section__method-content">
          {selectedMethod === "write" && (
            <div className="feedback-section__method-panel feedback-section__method-panel--active">
              <label className="feedback-section__label" htmlFor="fb-message">
                Please describe your concern here (include date, location, details). The
                Registered Manager will review this promptly.
                <span className="feedback-section__required">*</span>
              </label>
              <textarea
                className={`feedback-section__textarea ${errors.message ? 'error' : ''}`}
                id="fb-message"
                placeholder="Share your feedback here..."
                value={formData.message}
                onChange={handleInputChange}
                disabled={isSubmitting || isUploading}
                style={errors.message ? { borderColor: '#dc3545', backgroundColor: '#fff8f8' } : {}}
              />
              {errors.message && (
                <span style={{ color: '#dc3545', fontSize: '0.75rem', display: 'block', marginTop: '0.25rem' }}>
                  {errors.message}
                </span>
              )}
            </div>
          )}

          {selectedMethod === "voice" && (
            <div className="feedback-section__method-panel feedback-section__method-panel--active">
              <div className="voice-box">
                <div className="voice-box__icon">
                  <MicIcon className="voice-box__icon-svg" />
                </div>

                {recordingError && (
                  <p className="voice-box__error" style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '8px' }}>
                    {recordingError}
                  </p>
                )}

                {!isRecording && !audioBlob && (
                  <>
                    <p className="voice-box__text">
                      Click the button below to start recording your voice message
                    </p>
                    <button
                      type="button"
                      className="voice-box__button"
                      onClick={startRecording}
                      disabled={isSubmitting || isUploading}
                    >
                      Start Recording
                    </button>
                  </>
                )}

                {isRecording && (
                  <div className="voice-box__recording">
                    <p className="voice-box__text" style={{ color: '#dc3545' }}>
                      🔴 Recording... {formatDuration(recordingDuration)}
                    </p>
                    <div className="voice-box__recording-indicator" style={{
                      display: 'flex',
                      gap: '12px',
                      justifyContent: 'center',
                      marginTop: '12px'
                    }}>
                      <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: '#dc3545',
                        animation: 'pulse 1s ease-in-out infinite'
                      }} />
                      <span style={{ fontSize: '14px', color: '#666' }}>
                        {formatDuration(recordingDuration)}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="voice-box__button voice-box__button--stop"
                      onClick={stopRecording}
                      disabled={isSubmitting || isUploading}
                      style={{ background: '#dc3545' }}
                    >
                      Stop Recording
                    </button>
                  </div>
                )}

                {audioBlob && !isRecording && (
                  <div className="voice-box__preview" style={{
                    background: '#f0f7ff',
                    padding: '16px',
                    borderRadius: '8px',
                    marginTop: '12px',
                    width: '100%'
                  }}>
                    <p style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#1a56db' }}>
                      ✅ Recording saved ({formatDuration(recordingDuration)})
                    </p>
                    <audio controls src={audioUrl || undefined} style={{ width: '100%', marginBottom: '8px' }} />
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button
                        type="button"
                        className="voice-box__button voice-box__button--play"
                        onClick={playRecording}
                        style={{ background: '#28a745' }}
                      >
                        ▶ Play
                      </button>
                      <button
                        type="button"
                        className="voice-box__button voice-box__button--delete"
                        onClick={deleteRecording}
                        style={{ background: '#dc3545' }}
                      >
                        ✕ Delete
                      </button>
                    </div>
                  </div>
                )}

                {errors.voice && (
                  <span style={{ color: '#dc3545', fontSize: '0.75rem', display: 'block', marginTop: '0.25rem' }}>
                    {errors.voice}
                  </span>
                )}
              </div>
            </div>
          )}

          {selectedMethod === "video" && (
            <div className="feedback-section__method-panel feedback-section__method-panel--active">
              <div
                className={`upload-box ${isDragOver ? "upload-box--drag" : ""}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={handleBrowseClick}
                style={{ cursor: isSubmitting || isUploading ? 'not-allowed' : 'pointer', opacity: isSubmitting || isUploading ? 0.6 : 1 }}
              >
                <div className="upload-box__icon">
                  <UploadIcon className="upload-box__icon-svg" />
                </div>
                <p className="upload-box__text">
                  <strong>Drag and drop files here</strong> or click to browse
                </p>
                <p className="upload-box__hint">
                  Accepts MP4, MOV, AVI. Max file size 20MB. Fully encrypted and GDPR compliant.
                </p>
                {file && <p className="upload-box__filename">📹 {file.name}</p>}
                {uploadedFileUrl && (
                  <p className="upload-box__filename" style={{ color: '#28a745' }}>
                    ✅ Video uploaded successfully
                  </p>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  className="upload-box__input"
                  onChange={handleFileChange}
                  onClick={(e) => e.stopPropagation()}
                  disabled={isSubmitting || isUploading}
                  accept="video/*"
                />
                <button
                  type="button"
                  className="upload-box__button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBrowseClick();
                  }}
                  disabled={isSubmitting || isUploading}
                >
                  Browse Files
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Form fields */}
        <form onSubmit={handleSubmit}>
          <div className="feedback-section__form-row">
            <div className="feedback-section__field">
              <label className="feedback-section__label" htmlFor="fb-first-name">
                First Name<span className="feedback-section__required">*</span>
              </label>
              <input
                className={`feedback-section__input ${errors.firstName ? 'error' : ''}`}
                type="text"
                id="fb-first-name"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={isSubmitting || isUploading}
                style={errors.firstName ? { borderColor: '#dc3545', backgroundColor: '#fff8f8' } : {}}
              />
              {errors.firstName && (
                <span style={{ color: '#dc3545', fontSize: '0.75rem', display: 'block', marginTop: '0.25rem' }}>
                  {errors.firstName}
                </span>
              )}
            </div>
            <div className="feedback-section__field">
              <label className="feedback-section__label" htmlFor="fb-last-name">
                Last Name<span className="feedback-section__required">*</span>
              </label>
              <input
                className={`feedback-section__input ${errors.lastName ? 'error' : ''}`}
                type="text"
                id="fb-last-name"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={handleInputChange}
                disabled={isSubmitting || isUploading}
                style={errors.lastName ? { borderColor: '#dc3545', backgroundColor: '#fff8f8' } : {}}
              />
              {errors.lastName && (
                <span style={{ color: '#dc3545', fontSize: '0.75rem', display: 'block', marginTop: '0.25rem' }}>
                  {errors.lastName}
                </span>
              )}
            </div>
          </div>

          <div className="feedback-section__form-row">
            <div className="feedback-section__field">
              <label className="feedback-section__label" htmlFor="fb-phone">
                Phone Number<span className="feedback-section__required">*</span>
              </label>
              <input
                className={`feedback-section__input ${errors.phoneNumber ? 'error' : ''}`}
                type="tel"
                id="fb-phone"
                placeholder="Enter Phone Number"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                disabled={isSubmitting || isUploading}
                style={errors.phoneNumber ? { borderColor: '#dc3545', backgroundColor: '#fff8f8' } : {}}
              />
              {errors.phoneNumber && (
                <span style={{ color: '#dc3545', fontSize: '0.75rem', display: 'block', marginTop: '0.25rem' }}>
                  {errors.phoneNumber}
                </span>
              )}
            </div>
            <div className="feedback-section__field">
              <label className="feedback-section__label" htmlFor="fb-email">
                Email Address<span className="feedback-section__required">*</span>
              </label>
              <input
                className={`feedback-section__input ${errors.email ? 'error' : ''}`}
                type="email"
                id="fb-email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isSubmitting || isUploading}
                style={errors.email ? { borderColor: '#dc3545', backgroundColor: '#fff8f8' } : {}}
              />
              {errors.email && (
                <span style={{ color: '#dc3545', fontSize: '0.75rem', display: 'block', marginTop: '0.25rem' }}>
                  {errors.email}
                </span>
              )}
            </div>
          </div>

          <div className="feedback-section__form-row">
            <div className="feedback-section__field">
              <label className="feedback-section__label" htmlFor="fb-urgency">
                Urgency<span className="feedback-section__required">*</span>
              </label>
              <select
                className={`feedback-section__select ${errors.urgency ? 'error' : ''}`}
                id="fb-urgency"
                value={formData.urgency}
                onChange={handleInputChange}
                disabled={isSubmitting || isUploading}
                style={errors.urgency ? { borderColor: '#dc3545', backgroundColor: '#fff8f8' } : {}}
              >
                <option value="">Select</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              {errors.urgency && (
                <span style={{ color: '#dc3545', fontSize: '0.75rem', display: 'block', marginTop: '0.25rem' }}>
                  {errors.urgency}
                </span>
              )}
            </div>
            <div className="feedback-section__field">
              <label className="feedback-section__label feedback-section__label--icon" htmlFor="fb-attachment">
                <PaperclipIcon className="feedback-section__label-icon" />
                Add Attachment
              </label>
              <div
                className="attachment-field"
                onClick={() => attachmentInputRef.current?.click()}
                style={{ cursor: isSubmitting || isUploading ? 'not-allowed' : 'pointer', opacity: isSubmitting || isUploading ? 0.6 : 1 }}
              >
                <span
                  className={`attachment-field__text ${attachmentFile ? "attachment-field__text--filled" : ""
                    }`}
                >
                  {attachmentFile
                    ? `📎 ${attachmentFile.name}`
                    : "Choose file (No file chosen)"}
                </span>
                <input
                  ref={attachmentInputRef}
                  type="file"
                  id="fb-attachment"
                  className="attachment-field__input"
                  onChange={handleAttachmentChange}
                  disabled={isSubmitting || isUploading}
                />
              </div>
            </div>
          </div>

          <div className="feedback-section__submit-wrap">
            <button
              type="submit"
              className="feedback-section__submit"
              disabled={isSubmitting || isUploading}
              style={{
                opacity: isSubmitting || isUploading ? 0.7 : 1,
                cursor: isSubmitting || isUploading ? 'not-allowed' : 'pointer'
              }}
            >
              {isUploading ? `Uploading... ${uploadProgress}%` :
                isSubmitting ? "Submitting..." :
                  "Launch Concern to Registered Manager"}
            </button>
          </div>
        </form>
      </div>

      {/* Add pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
      `}</style>
    </section>
  );
}