"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { trackFormSubmission } from "@/lib/analytics";

/**
 * Contact form validation schema using Zod
 */
const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .regex(
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
      "Please enter a valid phone number"
    ),
  projectType: z.enum(["kitchen", "bathroom", "both", "other"], {
    message: "Please select a project type",
  }),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1000 characters"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

/**
 * ContactForm component - Contact form with validation and submission
 * Features:
 * - React Hook Form for form state management
 * - Zod schema validation
 * - Client-side validation with error messages
 * - Loading state during submission
 * - Toast notifications for success/error
 * - Accessible form labels and ARIA attributes
 * - Responsive layout
 */
export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      projectType: undefined,
    },
  });

  const projectType = watch("projectType");

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      // Track successful form submission
      trackFormSubmission("contact", "schedule", true);

      toast.success("Message sent successfully!", {
        description: "We'll get back to you within 24 hours.",
      });
      reset();
    } catch (error) {
      // Track failed form submission
      trackFormSubmission("contact", "schedule", false);

      toast.error("Failed to send message", {
        description:
          "Please try again later or contact us directly via phone or email.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      noValidate
      aria-label="Contact form"
    >
      {/* Name Field */}
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Name <span className="text-destructive" aria-label="required">*</span>
        </label>
        <Input
          id="name"
          type="text"
          placeholder="John Doe"
          {...register("name")}
          aria-invalid={errors.name ? "true" : "false"}
          aria-describedby={errors.name ? "name-error" : undefined}
          className={errors.name ? "border-destructive" : ""}
        />
        {errors.name && (
          <p
            id="name-error"
            className="text-sm text-destructive"
            role="alert"
            aria-live="polite"
          >
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Email{" "}
          <span className="text-destructive" aria-label="required">*</span>
        </label>
        <Input
          id="email"
          type="email"
          placeholder="john@example.com"
          {...register("email")}
          aria-invalid={errors.email ? "true" : "false"}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={errors.email ? "border-destructive" : ""}
        />
        {errors.email && (
          <p
            id="email-error"
            className="text-sm text-destructive"
            role="alert"
            aria-live="polite"
          >
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Phone Field */}
      <div className="space-y-2">
        <label
          htmlFor="phone"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Phone{" "}
          <span className="text-destructive" aria-label="required">*</span>
        </label>
        <Input
          id="phone"
          type="tel"
          placeholder="(555) 123-4567"
          {...register("phone")}
          aria-invalid={errors.phone ? "true" : "false"}
          aria-describedby={errors.phone ? "phone-error" : undefined}
          className={errors.phone ? "border-destructive" : ""}
        />
        {errors.phone && (
          <p
            id="phone-error"
            className="text-sm text-destructive"
            role="alert"
            aria-live="polite"
          >
            {errors.phone.message}
          </p>
        )}
      </div>

      {/* Project Type Field */}
      <div className="space-y-2">
        <label
          htmlFor="projectType"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Project Type{" "}
          <span className="text-destructive" aria-label="required">*</span>
        </label>
        <Select
          value={projectType}
          onValueChange={(value) =>
            setValue("projectType", value as ContactFormData["projectType"], {
              shouldValidate: true,
            })
          }
        >
          <SelectTrigger
            id="projectType"
            className={`w-full ${errors.projectType ? "border-destructive" : ""}`}
            aria-invalid={errors.projectType ? "true" : "false"}
            aria-describedby={
              errors.projectType ? "projectType-error" : undefined
            }
          >
            <SelectValue placeholder="Select a project type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="kitchen">Kitchen Remodeling</SelectItem>
            <SelectItem value="bathroom">Bathroom Remodeling</SelectItem>
            <SelectItem value="both">Both Kitchen & Bathroom</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        {errors.projectType && (
          <p
            id="projectType-error"
            className="text-sm text-destructive"
            role="alert"
            aria-live="polite"
          >
            {errors.projectType.message}
          </p>
        )}
      </div>

      {/* Message Field */}
      <div className="space-y-2">
        <label
          htmlFor="message"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Message{" "}
          <span className="text-destructive" aria-label="required">*</span>
        </label>
        <Textarea
          id="message"
          placeholder="Tell us about your project..."
          rows={6}
          {...register("message")}
          aria-invalid={errors.message ? "true" : "false"}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={errors.message ? "border-destructive" : ""}
        />
        {errors.message && (
          <p
            id="message-error"
            className="text-sm text-destructive"
            role="alert"
            aria-live="polite"
          >
            {errors.message.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        className="w-full sm:w-auto"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            Sending...
          </>
        ) : (
          "Send Message"
        )}
      </Button>
    </form>
  );
}
