"use client";

import { AssetImage } from "@/components/ui/AssetImage";
import React, { useState } from "react";
import axios from "axios";

interface FormData {
  fullName: string;
  phoneNumber: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

export function HeroCallbackCard() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    phoneNumber: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validate
    if (!formData.fullName.trim() || !formData.phoneNumber.trim()) {
      setError("All fields are required");
      return;
    }

    // Phone number validation (basic)
    const phoneRegex = /^[\d\s\-+()]{10,15}$/;
    if (!phoneRegex.test(formData.phoneNumber.replace(/\s/g, ''))) {
      setError("Please enter a valid phone number (10-15 digits)");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post<ApiResponse>(
        `${API_URL}/api/website/callback/save`,
        {
          fullName: formData.fullName.trim(),
          phoneNumber: formData.phoneNumber.trim(),
          workEmail: "callback@request.com", // Default value
          organisation: "Clinical Trials Homecare", // Default value
          source: "website-1",
          formName: "Hero Callback",
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
          fullName: "",
          phoneNumber: "",
        });
        // Auto-hide success message after 5 seconds
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(response.data.message || "Failed to submit request");
      }
    } catch (err: any) {
      console.error("Error submitting callback:", err);
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form 
      className="callback-card" 
      aria-label="Request a callback" 
      onSubmit={handleSubmit}
    >
      <h2>Request a Callback</h2>
      <p>Connect with our experts</p>

      {/* Success Message */}
      {success && (
        <div className="success-message" style={{
          background: "#d4edda",
          color: "#155724",
          padding: "10px 12px",
          borderRadius: "6px",
          marginBottom: "12px",
          fontSize: "13px",
          border: "1px solid #c3e6cb",
        }}>
          ✅ Thank you! We will call you back shortly.
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="error-message" style={{
          background: "#f8d7da",
          color: "#721c24",
          padding: "10px 12px",
          borderRadius: "6px",
          marginBottom: "12px",
          fontSize: "13px",
          border: "1px solid #f5c6cb",
        }}>
          ❌ {error}
        </div>
      )}

      <label htmlFor="full-name">
        Full Name <span>*</span>
      </label>
      <input 
        id="full-name" 
        name="fullName"
        type="text" 
        placeholder="Enter full name" 
        value={formData.fullName}
        onChange={handleChange}
        disabled={loading}
        required
        className={error && !formData.fullName ? "error" : ""}
      />

      <label htmlFor="phone">
        Phone Number <span>*</span>
      </label>
      <input 
        id="phone" 
        name="phoneNumber"
        type="tel" 
        placeholder="Enter Phone Number" 
        value={formData.phoneNumber}
        onChange={handleChange}
        disabled={loading}
        required
        className={error && !formData.phoneNumber ? "error" : ""}
      />

      <button 
        type="submit" 
        disabled={loading}
        style={{
          opacity: loading ? 0.7 : 1,
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        <AssetImage name="rumax-hero-callback.svg" aria-hidden="true" />
        {loading ? "Submitting..." : "Request a Callback"}
      </button>
    </form>
  );
}