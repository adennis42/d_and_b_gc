"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowRight, Loader2 } from "lucide-react";
import { trackFormSubmission } from "@/lib/analytics";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().regex(
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
    "Please enter a valid phone number"
  ),
  projectType: z.enum(["kitchen", "bathroom", "sunroom", "millwork", "other"], {
    message: "Please select a project type",
  }),
  message: z.string().min(10, "Please tell us a bit more").max(1000),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

// ── Shared inline styles ──────────────────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-sans, 'Inter', sans-serif)",
  fontSize: "0.6875rem",
  fontWeight: 500,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "#76726A",
  marginBottom: "0.5rem",
};

const inputStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: "12px 0",
  background: "transparent",
  border: "none",
  borderBottom: "1px solid #D9D1C2",
  outline: "none",
  fontFamily: "var(--font-sans, 'Inter', sans-serif)",
  fontSize: "1rem",
  color: "#1B1A17",
  lineHeight: 1.5,
  transition: "border-color 0.22s ease",
  borderRadius: 0,
};

const errorStyle: React.CSSProperties = {
  fontFamily: "var(--font-sans, 'Inter', sans-serif)",
  fontSize: "0.75rem",
  color: "#9B3A2E",
  marginTop: "0.375rem",
};

const fieldStyle: React.CSSProperties = {
  marginBottom: "2.5rem",
};

// ── Underline Input ────────────────────────────────────────────────────────────

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={fieldStyle}>
      <label style={labelStyle}>{label}</label>
      {children}
      {error && <p style={errorStyle} role="alert" aria-live="polite">{error}</p>}
    </div>
  );
}

// ── Main Form ─────────────────────────────────────────────────────────────────

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } =
    useForm<ContactFormData>({ resolver: zodResolver(contactFormSchema) });

  const projectType = watch("projectType");

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to send message");
      trackFormSubmission("contact", "schedule", true);
      toast.success("Message sent.", { description: "We'll be in touch within 24 hours." });
      reset();
    } catch {
      trackFormSubmission("contact", "schedule", false);
      toast.error("Something went wrong.", { description: "Please try again or call us directly." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const focusBrass = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderBottomColor = "#A8804A";
  };
  const blurWarm = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderBottomColor = "#D9D1C2";
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label="Contact form">

      {/* Two-column row: Name + Email */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 3rem" }}>
        <Field label="Name" error={errors.name?.message}>
          <input
            id="name"
            type="text"
            placeholder="Your name"
            style={inputStyle}
            {...register("name")}
            onFocus={focusBrass}
            onBlur={blurWarm}
            aria-invalid={errors.name ? "true" : "false"}
          />
        </Field>

        <Field label="Email" error={errors.email?.message}>
          <input
            id="email"
            type="email"
            placeholder="your@email.com"
            style={inputStyle}
            {...register("email")}
            onFocus={focusBrass}
            onBlur={blurWarm}
            aria-invalid={errors.email ? "true" : "false"}
          />
        </Field>
      </div>

      {/* Two-column row: Phone + Project type */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 3rem" }}>
        <Field label="Phone" error={errors.phone?.message}>
          <input
            id="phone"
            type="tel"
            placeholder="(555) 123-4567"
            style={inputStyle}
            {...register("phone")}
            onFocus={focusBrass}
            onBlur={blurWarm}
            aria-invalid={errors.phone ? "true" : "false"}
          />
        </Field>

        <Field label="Project type" error={errors.projectType?.message}>
          <select
            id="projectType"
            value={projectType || ""}
            onChange={(e) =>
              setValue("projectType", e.target.value as ContactFormData["projectType"], { shouldValidate: true })
            }
            style={{ ...inputStyle, cursor: "pointer", appearance: "none", WebkitAppearance: "none" }}
            onFocus={focusBrass}
            onBlur={blurWarm}
            aria-invalid={errors.projectType ? "true" : "false"}
          >
            <option value="" disabled>Select a type</option>
            <option value="kitchen">Kitchen</option>
            <option value="bathroom">Bathroom</option>
            <option value="sunroom">Sunroom</option>
            <option value="millwork">Millwork</option>
            <option value="other">Other</option>
          </select>
        </Field>
      </div>

      {/* Message */}
      <Field label="Tell us about your project" error={errors.message?.message}>
        <textarea
          id="message"
          rows={5}
          placeholder="Describe what you have in mind…"
          style={{ ...inputStyle, resize: "none" }}
          {...register("message")}
          onFocus={focusBrass}
          onBlur={blurWarm}
          aria-invalid={errors.message ? "true" : "false"}
        />
      </Field>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          fontFamily: "var(--font-sans, 'Inter', sans-serif)",
          fontSize: "11px",
          fontWeight: 500,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#FAF7F2",
          background: isSubmitting ? "#4A4842" : "#1B1A17",
          border: "1px solid #1B1A17",
          padding: "14px 32px",
          cursor: isSubmitting ? "not-allowed" : "pointer",
          borderRadius: "4px",
          transition: "opacity 0.18s ease",
          opacity: isSubmitting ? 0.6 : 1,
        }}
      >
        {isSubmitting ? (
          <>
            <Loader2 size={14} strokeWidth={1.25} className="animate-spin" />
            Sending…
          </>
        ) : (
          <>
            Send Message
            <ArrowRight size={14} strokeWidth={1.25} />
          </>
        )}
      </button>
    </form>
  );
}
