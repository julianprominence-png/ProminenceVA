"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import {
  quoteFormSchema,
  SERVICE_OPTIONS,
  BUDGET_RANGES,
  type QuoteFormData,
  type QuoteSubmitResponse,
} from "@/types/quote";
import "./QuoteModal.css";

/* ─── Props ─────────────────────────────────────────────────────────────── */

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/* ─── Animation Variants ────────────────────────────────────────────────── */

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.25, ease: "easeIn" } },
};

const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.92,
    y: 40,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: 0.25, ease: "easeIn" },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

const successVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

/* ─── Component ─────────────────────────────────────────────────────────── */

export default function QuoteModal({ isOpen, onClose }: QuoteModalProps) {
  const [submitState, setSubmitState] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [quoteId, setQuoteId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showOptional, setShowOptional] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      company: "",
      services: [],
      projectDescription: "",
      budgetRange: "",
    },
  });

  const selectedServices = watch("services") || [];

  /* ── Lock body scroll ────────────────────────────────────────────────── */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  /* ── Escape key handler ──────────────────────────────────────────────── */
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && submitState !== "submitting") {
        onClose();
      }
    },
    [onClose, submitState]
  );

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
      return () => window.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, handleEscape]);

  /* ── Reset on close ──────────────────────────────────────────────────── */
  useEffect(() => {
    if (!isOpen) {
      // Delay reset so exit animation completes
      const timer = setTimeout(() => {
        reset();
        setSubmitState("idle");
        setQuoteId("");
        setErrorMessage("");
        setShowOptional(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isOpen, reset]);

  /* ── Toggle service selection ────────────────────────────────────────── */
  const toggleService = (service: (typeof SERVICE_OPTIONS)[number]) => {
    const current = selectedServices;
    if (current.includes(service)) {
      setValue(
        "services",
        current.filter((s) => s !== service),
        { shouldValidate: true }
      );
    } else {
      setValue("services", [...current, service], { shouldValidate: true });
    }
  };

  /* ── Form submission ─────────────────────────────────────────────────── */
  const onSubmit = async (data: QuoteFormData) => {
    setSubmitState("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result: QuoteSubmitResponse = await res.json();

      if (res.ok && result.status === "success" && result.quoteId) {
        setQuoteId(result.quoteId);
        setSubmitState("success");
      } else {
        setErrorMessage(result.error || "Something went wrong.");
        setSubmitState("error");
      }
    } catch {
      setErrorMessage("Network error. Please check your connection.");
      setSubmitState("error");
    }
  };

  /* ── Service icons ───────────────────────────────────────────────────── */
  const serviceIcons: Record<string, React.ReactNode> = {
    "Web Development": (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    "Graphic Design": (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /><path d="M2 2l7.586 7.586" /><circle cx="11" cy="11" r="2" />
      </svg>
    ),
    "Video Editing": (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" /><line x1="7" y1="2" x2="7" y2="22" /><line x1="17" y1="2" x2="17" y2="22" /><line x1="2" y1="12" x2="22" y2="12" /><line x1="2" y1="7" x2="7" y2="7" /><line x1="2" y1="17" x2="7" y2="17" /><line x1="17" y1="17" x2="22" y2="17" /><line x1="17" y1="7" x2="22" y2="7" />
      </svg>
    ),
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="quote-modal-overlay"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={() => submitState !== "submitting" && onClose()}
        >
          <motion.div
            className="quote-modal-container"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="quote-modal-title"
          >
            {/* Ambient glow effects */}
            <div className="quote-modal-glow quote-modal-glow-1" />
            <div className="quote-modal-glow quote-modal-glow-2" />

            {/* Close button */}
            <button
              className="quote-modal-close"
              onClick={onClose}
              disabled={submitState === "submitting"}
              aria-label="Close modal"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* ── SUCCESS STATE ── */}
            <AnimatePresence mode="wait">
              {submitState === "success" ? (
                <motion.div
                  key="success"
                  className="quote-modal-success"
                  variants={successVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  <motion.div className="quote-success-icon" variants={itemVariants}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </motion.div>
                  <motion.h3 className="quote-success-title" variants={itemVariants}>
                    Quote Request Received
                  </motion.h3>
                  <motion.p className="quote-success-message" variants={itemVariants}>
                    Your quote request has been received. We&apos;ll contact you shortly.
                  </motion.p>
                  <motion.div className="quote-success-id" variants={itemVariants}>
                    <span className="quote-success-id-label">Quote ID</span>
                    <span className="quote-success-id-value">{quoteId}</span>
                  </motion.div>
                  <motion.button
                    className="quote-success-close"
                    onClick={onClose}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Done
                  </motion.button>
                </motion.div>
              ) : (
                /* ── FORM STATE ── */
                <motion.div key="form" className="quote-modal-form-wrapper">
                  {/* Header */}
                  <motion.div className="quote-modal-header" variants={itemVariants}>
                    <div className="quote-modal-header-badge">
                      <div className="quote-modal-header-dot" />
                      <span>Available for Projects</span>
                    </div>
                    <h2 id="quote-modal-title" className="quote-modal-title">
                      Let&apos;s Discuss Your Project
                    </h2>
                    <p className="quote-modal-subtitle">
                      Tell us about your project and we&apos;ll get back to you within 24 hours.
                    </p>
                  </motion.div>

                  {/* Form */}
                  <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    {/* Services */}
                    <motion.div className="quote-field-group" variants={itemVariants}>
                      <label className="quote-label">
                        Services Needed
                        <span className="quote-label-required">*</span>
                      </label>
                      <div className="quote-services-grid">
                        {SERVICE_OPTIONS.map((service) => {
                          const isSelected = selectedServices.includes(service);
                          return (
                            <button
                              key={service}
                              type="button"
                              className={`quote-service-chip ${isSelected ? "quote-service-chip-active" : ""}`}
                              onClick={() => toggleService(service)}
                              aria-pressed={isSelected}
                            >
                              <span className="quote-service-icon">
                                {serviceIcons[service]}
                              </span>
                              <span>{service}</span>
                              {isSelected && (
                                <motion.span
                                  className="quote-service-check"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                >
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>
                                </motion.span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                      {errors.services && (
                        <p className="quote-error">{errors.services.message}</p>
                      )}
                    </motion.div>

                    {/* Name & Email */}
                    <motion.div className="quote-field-row" variants={itemVariants}>
                      <div className="quote-field-group">
                        <label className="quote-label" htmlFor="quote-fullName">
                          Full Name
                          <span className="quote-label-required">*</span>
                        </label>
                        <input
                          id="quote-fullName"
                          type="text"
                          className={`quote-input ${errors.fullName ? "quote-input-error" : ""}`}
                          placeholder="Your full name"
                          {...register("fullName")}
                          disabled={submitState === "submitting"}
                        />
                        {errors.fullName && (
                          <p className="quote-error">{errors.fullName.message}</p>
                        )}
                      </div>
                      <div className="quote-field-group">
                        <label className="quote-label" htmlFor="quote-email">
                          Email Address
                          <span className="quote-label-required">*</span>
                        </label>
                        <input
                          id="quote-email"
                          type="email"
                          className={`quote-input ${errors.email ? "quote-input-error" : ""}`}
                          placeholder="your@email.com"
                          {...register("email")}
                          disabled={submitState === "submitting"}
                        />
                        {errors.email && (
                          <p className="quote-error">{errors.email.message}</p>
                        )}
                      </div>
                    </motion.div>

                    {/* Project Description */}
                    <motion.div className="quote-field-group" variants={itemVariants}>
                      <label className="quote-label" htmlFor="quote-description">
                        Project Description
                        <span className="quote-label-required">*</span>
                      </label>
                      <textarea
                        id="quote-description"
                        className={`quote-textarea ${errors.projectDescription ? "quote-input-error" : ""}`}
                        placeholder="I need a business website for my company. I also need a logo and social media graphics."
                        rows={4}
                        {...register("projectDescription")}
                        disabled={submitState === "submitting"}
                      />
                      {errors.projectDescription && (
                        <p className="quote-error">{errors.projectDescription.message}</p>
                      )}
                    </motion.div>

                    {/* Optional fields toggle */}
                    <motion.div variants={itemVariants}>
                      <button
                        type="button"
                        className="quote-optional-toggle"
                        onClick={() => setShowOptional(!showOptional)}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{
                            transform: showOptional ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.3s ease",
                          }}
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                        <span>
                          {showOptional ? "Hide" : "Add"} additional details
                          <span className="quote-optional-hint">(optional)</span>
                        </span>
                      </button>
                    </motion.div>

                    {/* Optional fields */}
                    <AnimatePresence>
                      {showOptional && (
                        <motion.div
                          className="quote-optional-fields"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }}
                          exit={{ height: 0, opacity: 0, transition: { duration: 0.25, ease: "easeIn" } }}
                        >
                          <div className="quote-field-row">
                            <div className="quote-field-group">
                              <label className="quote-label" htmlFor="quote-phone">
                                Phone Number
                              </label>
                              <input
                                id="quote-phone"
                                type="tel"
                                className={`quote-input ${errors.phone ? "quote-input-error" : ""}`}
                                placeholder="+63 912 345 6789"
                                {...register("phone")}
                                disabled={submitState === "submitting"}
                              />
                              {errors.phone && (
                                <p className="quote-error">{errors.phone.message}</p>
                              )}
                            </div>
                            <div className="quote-field-group">
                              <label className="quote-label" htmlFor="quote-company">
                                Company Name
                              </label>
                              <input
                                id="quote-company"
                                type="text"
                                className={`quote-input ${errors.company ? "quote-input-error" : ""}`}
                                placeholder="Your company"
                                {...register("company")}
                                disabled={submitState === "submitting"}
                              />
                              {errors.company && (
                                <p className="quote-error">{errors.company.message}</p>
                              )}
                            </div>
                          </div>
                          <div className="quote-field-group">
                            <label className="quote-label" htmlFor="quote-budget">
                              Budget Range
                            </label>
                            <select
                              id="quote-budget"
                              className="quote-select"
                              {...register("budgetRange")}
                              disabled={submitState === "submitting"}
                            >
                              <option value="">Select a range (optional)</option>
                              {BUDGET_RANGES.map((range) => (
                                <option key={range} value={range}>
                                  {range}
                                </option>
                              ))}
                            </select>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Error message */}
                    <AnimatePresence>
                      {submitState === "error" && (
                        <motion.div
                          className="quote-form-error"
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                          </svg>
                          <span>{errorMessage}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Submit */}
                    <motion.div variants={itemVariants} className="quote-submit-wrapper">
                      <motion.button
                        type="submit"
                        className="quote-submit-btn"
                        disabled={submitState === "submitting"}
                        whileHover={submitState !== "submitting" ? { scale: 1.01 } : {}}
                        whileTap={submitState !== "submitting" ? { scale: 0.98 } : {}}
                      >
                        {submitState === "submitting" ? (
                          <span className="quote-submit-loading">
                            <span className="quote-spinner" />
                            <span>Submitting...</span>
                          </span>
                        ) : (
                          <span className="quote-submit-text">
                            <span>Get Your Quote</span>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                            </svg>
                          </span>
                        )}
                      </motion.button>
                      <p className="quote-submit-note">
                        Free consultation · No commitment required
                      </p>
                    </motion.div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
