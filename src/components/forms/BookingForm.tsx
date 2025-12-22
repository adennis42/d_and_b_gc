"use client";

import { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Calendar as CalendarIcon, Clock } from "lucide-react";
import { trackFormSubmission } from "@/lib/analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Booking form validation schema using Zod
 */
const bookingFormSchema = z.object({
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
  date: z.string().min(1, "Please select a date"),
  time: z.string().min(1, "Please select a time"),
  projectType: z.enum(["kitchen", "bathroom", "millwork", "sunroom", "other"], {
    message: "Please select a project type",
  }),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1000 characters")
    .optional()
    .or(z.literal("")),
});

type BookingFormData = z.infer<typeof bookingFormSchema>;

/**
 * Business hours configuration
 */
const BUSINESS_HOURS = {
  weekdays: { start: 9, end: 18 }, // 9 AM - 6 PM
  saturday: { start: 10, end: 16 }, // 10 AM - 4 PM
  sunday: null, // Closed
};

/**
 * Time slot duration in minutes
 */
const TIME_SLOT_DURATION = 30;

/**
 * Generate available time slots for a given date
 */
function generateTimeSlots(date: Date): string[] {
  const dayOfWeek = date.getDay();
  let hours: { start: number; end: number } | null = null;

  if (dayOfWeek === 0) {
    // Sunday - closed
    return [];
  } else if (dayOfWeek === 6) {
    // Saturday
    hours = BUSINESS_HOURS.saturday;
  } else {
    // Monday - Friday
    hours = BUSINESS_HOURS.weekdays;
  }

  if (!hours) return [];

  const slots: string[] = [];
  const startMinutes = hours.start * 60;
  const endMinutes = hours.end * 60;

  for (let minutes = startMinutes; minutes < endMinutes; minutes += TIME_SLOT_DURATION) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    const displayMins = mins === 0 ? "00" : mins.toString().padStart(2, "0");
    slots.push(`${displayHours}:${displayMins} ${period}`);
  }

  return slots;
}

/**
 * Format date for display
 */
function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format date for form submission (YYYY-MM-DD)
 */
function formatDateForSubmission(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * BookingForm component - Custom booking interface with date/time selection
 * Features:
 * - Date picker with calendar view
 * - Time slot selection based on business hours
 * - Form validation with Zod
 * - Responsive design
 * - Accessible form controls
 */
export function BookingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
  });

  const selectedTime = watch("time");
  const projectType = watch("projectType");

  // Fetch available time slots from Google Calendar when date is selected
  useEffect(() => {
    if (!selectedDate) {
      setAvailableTimeSlots([]);
      return;
    }

    const fetchAvailability = async () => {
      setIsLoadingSlots(true);
      try {
        const dateStr = formatDateForSubmission(selectedDate);
        const response = await fetch(`/api/calendar/availability?date=${dateStr}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch availability");
        }

        const data = await response.json();
        setAvailableTimeSlots(data.availableSlots || []);
      } catch (error) {
        console.error("Error fetching availability:", error);
        // Fallback to default slots if API fails
        setAvailableTimeSlots(generateTimeSlots(selectedDate));
      } finally {
        setIsLoadingSlots(false);
      }
    };

    fetchAvailability();
  }, [selectedDate]);

  // Generate calendar days for current month
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  }, [currentMonth]);

  // availableTimeSlots is now fetched from API via useEffect

  // Check if a date is in the past
  const isPastDate = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Check if a date is available (not Sunday)
  const isDateAvailable = (date: Date): boolean => {
    return date.getDay() !== 0 && !isPastDate(date);
  };

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    if (!isDateAvailable(date)) return;
    setSelectedDate(date);
    setValue("date", formatDateForSubmission(date), { shouldValidate: true });
    setValue("time", "", { shouldValidate: false }); // Reset time when date changes
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to book appointment");
      }

      trackFormSubmission("booking", "schedule", true);

      toast.success("Appointment requested successfully!", {
        description: "We'll confirm your appointment via email shortly.",
      });

      // Reset form
      reset();
      setSelectedDate(null);
      setValue("date", "");
      setValue("time", "");
    } catch (error) {
      trackFormSubmission("booking", "schedule", false);

      toast.error("Failed to book appointment", {
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
      aria-label="Booking form"
    >
      {/* Date Selection */}
      <div className="space-y-4">
        <label className="text-sm font-medium leading-none">
          Select Date <span className="text-destructive">*</span>
        </label>
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={goToPreviousMonth}
                  aria-label="Previous month"
                >
                  ‹
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={goToNextMonth}
                  aria-label="Next month"
                >
                  ›
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-medium text-muted-foreground py-1"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((date, index) => {
                if (!date) {
                  return <div key={`empty-${index}`} className="aspect-square" />;
                }

                const isSelected =
                  selectedDate &&
                  date.toDateString() === selectedDate.toDateString();
                const isAvailable = isDateAvailable(date);
                const isToday = date.toDateString() === new Date().toDateString();

                return (
                  <button
                    key={date.toDateString()}
                    type="button"
                    onClick={() => handleDateSelect(date)}
                    disabled={!isAvailable}
                    className={`
                      aspect-square rounded-md text-sm transition-colors
                      ${isSelected ? "bg-primary text-primary-foreground" : ""}
                      ${!isSelected && isAvailable ? "hover:bg-muted" : ""}
                      ${!isAvailable ? "text-muted-foreground cursor-not-allowed opacity-50" : ""}
                      ${isToday && !isSelected ? "ring-2 ring-primary" : ""}
                    `}
                    aria-label={`Select ${formatDate(date)}`}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>

            {selectedDate && (
              <div className="mt-4 pt-4 border-t text-sm text-muted-foreground">
                Selected: <strong className="text-foreground">{formatDate(selectedDate)}</strong>
              </div>
            )}
          </CardContent>
        </Card>

        <input
          type="hidden"
          {...register("date")}
        />
        {errors.date && (
          <p className="text-sm text-destructive" role="alert">
            {errors.date.message}
          </p>
        )}
      </div>

      {/* Time Selection */}
      {selectedDate && (
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Select Time <span className="text-destructive">*</span>
          </label>
          {isLoadingSlots ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">
                Loading available times...
              </span>
            </div>
          ) : availableTimeSlots.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {availableTimeSlots.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setValue("time", time, { shouldValidate: true })}
                    className={`
                      px-4 py-2 rounded-md text-sm font-medium transition-colors
                      ${
                        selectedTime === time
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80"
                      }
                    `}
                  >
                    {time}
                  </button>
                ))}
              </div>
              <input
                type="hidden"
                {...register("time")}
              />
              {errors.time && (
                <p className="text-sm text-destructive" role="alert">
                  {errors.time.message}
                </p>
              )}
            </>
          ) : (
            <div className="p-4 bg-muted rounded-md text-sm text-muted-foreground">
              No available time slots for this date. Please select another date.
            </div>
          )}
        </div>
      )}

      {/* Name Field */}
      <div className="space-y-2">
        <label htmlFor="booking-name" className="text-sm font-medium leading-none">
          Name <span className="text-destructive">*</span>
        </label>
        <Input
          id="booking-name"
          type="text"
          placeholder="John Doe"
          {...register("name")}
          aria-invalid={errors.name ? "true" : "false"}
          className={errors.name ? "border-destructive" : ""}
        />
        {errors.name && (
          <p className="text-sm text-destructive" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <label htmlFor="booking-email" className="text-sm font-medium leading-none">
          Email <span className="text-destructive">*</span>
        </label>
        <Input
          id="booking-email"
          type="email"
          placeholder="john@example.com"
          {...register("email")}
          aria-invalid={errors.email ? "true" : "false"}
          className={errors.email ? "border-destructive" : ""}
        />
        {errors.email && (
          <p className="text-sm text-destructive" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Phone Field */}
      <div className="space-y-2">
        <label htmlFor="booking-phone" className="text-sm font-medium leading-none">
          Phone <span className="text-destructive">*</span>
        </label>
        <Input
          id="booking-phone"
          type="tel"
          placeholder="(555) 123-4567"
          {...register("phone")}
          aria-invalid={errors.phone ? "true" : "false"}
          className={errors.phone ? "border-destructive" : ""}
        />
        {errors.phone && (
          <p className="text-sm text-destructive" role="alert">
            {errors.phone.message}
          </p>
        )}
      </div>

      {/* Project Type Field */}
      <div className="space-y-2">
        <label htmlFor="booking-project-type" className="text-sm font-medium leading-none">
          Project Type <span className="text-destructive">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: "kitchen", label: "Kitchen" },
            { value: "bathroom", label: "Bathroom" },
            { value: "millwork", label: "Millwork" },
            { value: "sunroom", label: "Sunroom" },
            { value: "other", label: "Other" },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() =>
                setValue("projectType", option.value as BookingFormData["projectType"], {
                  shouldValidate: true,
                })
              }
              className={`
                px-4 py-2 rounded-md text-sm font-medium transition-colors
                ${
                  projectType === option.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
        <input
          type="hidden"
          {...register("projectType")}
        />
        {errors.projectType && (
          <p className="text-sm text-destructive" role="alert">
            {errors.projectType.message}
          </p>
        )}
      </div>

      {/* Message Field */}
      <div className="space-y-2">
        <label htmlFor="booking-message" className="text-sm font-medium leading-none">
          Additional Details (Optional)
        </label>
        <Textarea
          id="booking-message"
          placeholder="Tell us about your project..."
          rows={4}
          {...register("message")}
          aria-invalid={errors.message ? "true" : "false"}
          className={errors.message ? "border-destructive" : ""}
        />
        {errors.message && (
          <p className="text-sm text-destructive" role="alert">
            {errors.message.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isSubmitting || !selectedDate || !selectedTime}
        aria-busy={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            Booking...
          </>
        ) : (
          <>
            <CalendarIcon className="mr-2 h-4 w-4" aria-hidden="true" />
            Request Appointment
          </>
        )}
      </Button>
    </form>
  );
}

