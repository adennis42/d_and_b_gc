import { Suspense } from "react";
import { ContactForm } from "@/components/forms/ContactForm";
import { FormSkeleton } from "@/components/forms/FormSkeleton";
import { Clock, Calendar, MessageSquare, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getScheduleMetadata } from "@/lib/metadata";

/**
 * Schedule page metadata for SEO
 * Generated using centralized metadata utility
 */
export const metadata = getScheduleMetadata();

/**
 * Google Calendar embed component
 * 
 * Option 1: Google Calendar Appointment Scheduling (Recommended)
 * - Create an appointment schedule in Google Calendar
 * - Get the schedule ID from the appointment scheduling page URL
 * - Set NEXT_PUBLIC_GOOGLE_CALENDAR_SCHEDULE_ID in environment variables
 * 
 * Option 2: Standard Calendar Embed
 * - Set NEXT_PUBLIC_GOOGLE_CALENDAR_ID with your public calendar ID
 * - Make sure the calendar is set to "Public" for embedding
 */
function GoogleCalendarEmbed() {
  // Google Calendar Appointment Scheduling (for booking available times)
  const scheduleId = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_SCHEDULE_ID;

  // Show button to navigate to appointment scheduling page
  if (scheduleId) {
    // Support both old format (calendar.google.com) and new format (calendar.app.google)
    const appointmentUrl = scheduleId.startsWith('http') 
      ? scheduleId 
      : `https://calendar.app.google/${scheduleId}`;
    
    return (
      <div className="w-full rounded-lg border shadow-sm p-8 md:p-12 bg-card">
        <div className="text-center space-y-6 max-w-2xl mx-auto">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-primary/10">
              <Calendar className="h-12 w-12 text-primary" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl md:text-3xl font-bold mb-3">
              Book Your Consultation
            </h3>
            <p className="text-muted-foreground text-lg">
              Click the button below to view available appointment times and schedule your free consultation.
            </p>
          </div>
          <a
            href={appointmentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-4 text-base font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
          >
            <Calendar className="mr-2 h-5 w-5" />
            View Available Times & Book Appointment
          </a>
          <p className="text-sm text-muted-foreground">
            The booking page will open in a new window
          </p>
        </div>
      </div>
    );
  }

  // Fallback: If calendar ID is set but no appointment scheduling
  const calendarId = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID;
  if (calendarId) {
    const timezone = "America/New_York";
    const calendarUrl = `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(
      calendarId
    )}&ctz=${encodeURIComponent(timezone)}`;

    return (
      <div className="w-full rounded-lg overflow-hidden border shadow-sm">
        <div className="relative" style={{ paddingBottom: '75%' }}> {/* 4:3 aspect ratio (800x600) */}
          <iframe
            src={calendarUrl}
            className="absolute top-0 left-0 w-full h-full"
            title="View available consultation times"
            allow="encrypted-media"
            loading="lazy"
            style={{ border: 0 }}
            scrolling="no"
          />
        </div>
      </div>
    );
  }

  // Fallback: Show configuration message
  return (
    <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed">
      <div className="text-center p-8 max-w-md">
        <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-lg font-semibold mb-2">Calendar Not Configured</p>
        <p className="text-sm text-muted-foreground mb-4">
          To enable calendar scheduling, set one of these environment variables:
        </p>
        <ul className="text-left text-sm text-muted-foreground space-y-2 mb-6">
          <li>
            <strong>NEXT_PUBLIC_GOOGLE_CALENDAR_SCHEDULE_ID</strong> (Recommended)
            <br />
            <span className="text-xs">For Google Calendar Appointment Scheduling</span>
          </li>
          <li>
            <strong>NEXT_PUBLIC_GOOGLE_CALENDAR_ID</strong>
            <br />
            <span className="text-xs">For standard calendar embed</span>
          </li>
        </ul>
        <a
          href="https://calendar.google.com/calendar/u/0/appointments/schedules"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Set Up Google Calendar Scheduling
        </a>
      </div>
    </div>
  );
}

/**
 * Schedule page component
 * Features:
 * - Google Calendar embed for scheduling
 * - Contact form as alternative
 * - Business hours information
 * - Consultation expectations
 * - Responsive layout
 */
export default function SchedulePage() {
  const businessHours = [
    { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM" },
    { day: "Saturday", hours: "10:00 AM - 4:00 PM" },
    { day: "Sunday", hours: "Closed" },
  ];

  const consultationExpectations = [
    {
      icon: Calendar,
      title: "Choose Your Time",
      description:
        "Select a date and time that works best for you from our available slots.",
    },
    {
      icon: MessageSquare,
      title: "Discuss Your Vision",
      description:
        "We'll talk about your project goals, style preferences, and budget considerations.",
    },
    {
      icon: CheckCircle2,
      title: "Get Expert Advice",
      description:
        "Receive professional recommendations and a preliminary project timeline.",
    },
  ];

  return (
    <main className="py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Title */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Schedule a Consultation
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl">
            Book a free consultation to discuss your kitchen or bathroom
            remodeling project. We'll help bring your vision to life.
          </p>
        </div>

        {/* Consultation Process Intro */}
        <section className="mb-12 md:mb-16">
          <div className="prose prose-lg max-w-none">
            <p className="text-muted-foreground">
              Our consultation process is designed to understand your needs and
              provide expert guidance. During your consultation, we'll discuss
              your project goals, explore design options, review your budget,
              and answer any questions you may have. This initial meeting helps
              us create a customized plan that fits your vision and lifestyle.
            </p>
          </div>
        </section>

        {/* Google Calendar Appointment Scheduling */}
        <section className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">
            Book Your Consultation
          </h2>
          <GoogleCalendarEmbed />
          <p className="mt-4 text-sm text-muted-foreground">
            Can't find a time that works? Use the contact form below or call us
            directly to schedule.
          </p>
        </section>

        {/* Two Column Layout: Business Hours & What to Expect */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 md:mb-16">
          {/* Business Hours */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Clock className="h-5 w-5" />
                </div>
                <CardTitle>Business Hours</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {businessHours.map((schedule, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center py-2 border-b last:border-b-0"
                  >
                    <span className="font-medium">{schedule.day}</span>
                    <span className="text-muted-foreground">
                      {schedule.hours}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-muted-foreground">
                Response time: We typically respond within 24 hours during
                business days.
              </p>
            </CardContent>
          </Card>

          {/* What to Expect */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <CardTitle>What to Expect</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {consultationExpectations.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <li key={index} className="flex gap-4">
                      <div className="p-2 rounded-lg bg-muted shrink-0">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form Alternative */}
        <section className="mb-12">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4 text-center">
              Prefer to Contact Us Directly?
            </h2>
            <p className="text-center text-muted-foreground mb-8">
              Fill out the form below and we'll get back to you within 24 hours
              to schedule your consultation.
            </p>
            <div className="bg-card border rounded-lg p-6 md:p-8">
              <Suspense fallback={<FormSkeleton />}>
                <ContactForm />
              </Suspense>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
