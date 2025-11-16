# Next Session Tasks

## Overview
This document tracks tasks to be completed in the next development session.

## Priority Tasks

### 1. Google Calendar Integration
**Status**: Not Started  
**Priority**: High

**Requirements**:
- Integrate Google Calendar scheduling functionality
- Allow users to book consultations directly from the website
- Display available time slots
- Sync with contractor's Google Calendar
- Handle timezone considerations
- Provide confirmation after booking

**Current State**:
- Environment variables are set up in `env.template`:
  - `GOOGLE_CALENDAR_ID`
  - `GOOGLE_API_KEY`
- Basic schedule page exists at `src/app/(routes)/schedule/page.tsx`
- Placeholder for Google Calendar embed exists

**Next Steps**:
1. Set up Google Calendar API credentials
2. Implement Google Calendar API integration
3. Create booking form/component
4. Add calendar availability display
5. Implement booking confirmation flow
6. Add error handling and validation
7. Test integration end-to-end

**Resources**:
- Google Calendar API documentation
- Existing schedule page: `src/app/(routes)/schedule/page.tsx`
- Environment variables template: `env.template`

---

### 2. Email Functionality
**Status**: Partially Implemented  
**Priority**: High

**Requirements**:
- Send emails from contact form submissions
- Send confirmation emails to customers
- Send notification emails to contractor
- Handle email errors gracefully
- Add email templates
- Support for different email types (contact, booking confirmation, etc.)

**Current State**:
- Contact form exists: `src/components/forms/ContactForm.tsx`
- API route exists: `src/app/api/contact/route.ts`
- Email utility exists: `src/lib/email.ts`
- Resend integration is set up
- Environment variables configured:
  - `RESEND_API_KEY`
  - `EMAIL_FROM`
  - `EMAIL_TO`

**What's Working**:
- Contact form submission
- Basic email sending via Resend
- Auto-reply to customer
- Notification to contractor

**What Needs Work**:
1. Test email functionality end-to-end
2. Create professional email templates
3. Add HTML email formatting
4. Handle edge cases and errors
5. Add email logging/monitoring
6. Test with actual Resend account
7. Verify email delivery

**Resources**:
- Contact form: `src/components/forms/ContactForm.tsx`
- API route: `src/app/api/contact/route.ts`
- Email utility: `src/lib/email.ts`
- Resend documentation: https://resend.com/docs

---

## Notes

### Environment Variables Needed
Make sure these are set up in Vercel and `.env.local`:
- `GOOGLE_CALENDAR_ID`
- `GOOGLE_API_KEY`
- `RESEND_API_KEY`
- `EMAIL_FROM`
- `EMAIL_TO`

### Testing Checklist
- [ ] Google Calendar integration works
- [ ] Users can book appointments
- [ ] Calendar syncs correctly
- [ ] Email sending works
- [ ] Email templates look professional
- [ ] Error handling works
- [ ] Mobile responsiveness

### Documentation to Update
- Update `VERCEL_ENV_SETUP.md` with any new environment variables
- Document Google Calendar setup process
- Document email template customization

---

**Last Updated**: Today's session  
**Next Session Focus**: Google Calendar Integration & Email Functionality

