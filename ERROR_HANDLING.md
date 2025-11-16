# Error Handling Guide

This document outlines the error handling strategy implemented throughout the contractor website.

## Error Boundaries

### 1. Global Error Boundary (`app/error.tsx`)

**Purpose**: Catches unhandled errors in the application and displays a user-friendly error page.

**Features**:
- ✅ Friendly error message
- ✅ Retry button to attempt recovery
- ✅ Link back to homepage
- ✅ Quick navigation to other pages
- ✅ Error details in development mode only
- ✅ Accessible design with proper ARIA labels

**When it triggers**:
- Unhandled errors in React components
- Errors during server-side rendering
- Errors in route handlers
- Any error that bubbles up without being caught

**Usage**: Automatically handled by Next.js App Router - no manual setup needed.

### 2. 404 Not Found Page (`app/not-found.tsx`)

**Purpose**: Displays when a user navigates to a non-existent page.

**Features**:
- ✅ Clear 404 message
- ✅ Navigation back to homepage
- ✅ Quick links to popular pages
- ✅ Helpful suggestions
- ✅ Contact link for reporting issues

**When it triggers**:
- User navigates to `/non-existent-page`
- `notFound()` is called in a route handler
- Dynamic route with invalid parameter

**Usage**: Automatically handled by Next.js - create `not-found.tsx` in route folders for page-specific 404s.

### 3. Global Loading State (`app/loading.tsx`)

**Purpose**: Shows a loading spinner during route transitions and Suspense boundaries.

**Features**:
- ✅ Centered loading spinner
- ✅ Accessible (screen reader friendly)
- ✅ Consistent with app design
- ✅ Smooth animations

**When it triggers**:
- Route transitions
- Suspense boundaries resolving
- Data fetching in server components

**Usage**: Automatically handled by Next.js - create `loading.tsx` in route folders for page-specific loading states.

## Error Handling Throughout the App

### API Routes

**Location**: `src/app/api/contact/route.ts`

**Error Handling**:
- ✅ Rate limiting with proper HTTP 429 responses
- ✅ JSON parsing errors (400 Bad Request)
- ✅ Validation errors with detailed messages (400 Bad Request)
- ✅ Missing configuration errors (503 Service Unavailable)
- ✅ Email sending errors (500 Internal Server Error)
- ✅ Proper error logging
- ✅ User-friendly error messages

**Example**:
```typescript
try {
  // API logic
} catch (error) {
  console.error("Error details:", error);
  return NextResponse.json(
    { error: "Internal server error", message: "Please try again later" },
    { status: 500 }
  );
}
```

### Form Components

**Location**: `src/components/forms/ContactForm.tsx`

**Error Handling**:
- ✅ Client-side validation with Zod
- ✅ Server-side validation feedback
- ✅ Network error handling
- ✅ Loading states during submission
- ✅ Success/error toast notifications
- ✅ Form reset on success
- ✅ Error tracking via analytics

**Example**:
```typescript
try {
  const response = await fetch("/api/contact", { ... });
  if (!response.ok) {
    throw new Error("Failed to send message");
  }
  // Success handling
} catch (error) {
  // Error handling with user feedback
  toast.error("Failed to send message", { ... });
}
```

### Gallery Components

**Location**: `src/components/gallery/GalleryGrid.tsx`, `Lightbox.tsx`

**Error Handling**:
- ✅ Suspense boundaries with loading skeletons
- ✅ Empty state handling (no projects found)
- ✅ Image loading errors (handled by Next.js Image)
- ✅ Navigation error handling

### Image Loading

**Location**: All components using `next/image`

**Error Handling**:
- ✅ Automatic fallback handling
- ✅ Blur placeholders prevent layout shift
- ✅ Proper error boundaries
- ✅ Missing image handling

## Error Handling Best Practices

### 1. User-Friendly Messages

✅ **Do**:
- Show clear, actionable error messages
- Provide next steps or alternatives
- Use plain language (avoid technical jargon)

❌ **Don't**:
- Expose internal error details in production
- Show stack traces to users
- Use technical error codes without explanation

### 2. Error Logging

✅ **Do**:
- Log errors to console in development
- Log to error tracking service in production (e.g., Sentry)
- Include context (user actions, request data)
- Include error IDs for tracking

❌ **Don't**:
- Log sensitive user data
- Log passwords or tokens
- Over-log (avoid spam)

### 3. Graceful Degradation

✅ **Do**:
- Provide fallback UI when features fail
- Allow users to continue using the app
- Show partial content when possible
- Provide alternative actions

❌ **Don't**:
- Crash the entire app for minor errors
- Show blank screens
- Block user navigation

### 4. Error Recovery

✅ **Do**:
- Provide retry buttons
- Allow users to go back
- Suggest alternative actions
- Remember user's context

❌ **Don't**:
- Force page reloads unnecessarily
- Lose user's work
- Require multiple steps to recover

## Testing Error States

### Manual Testing

1. **Test 404 Page**:
   - Navigate to `/non-existent-page`
   - Verify 404 page displays
   - Test navigation links

2. **Test Error Boundary**:
   - Create a test error (temporarily throw error in component)
   - Verify error page displays
   - Test retry functionality

3. **Test Loading States**:
   - Navigate between pages
   - Verify loading spinner appears
   - Check Suspense boundaries

4. **Test Form Errors**:
   - Submit invalid form data
   - Test network errors (disable network)
   - Verify error messages display

5. **Test API Errors**:
   - Submit form with invalid data
   - Test rate limiting
   - Test server errors

### Automated Testing (Future)

Consider adding:
- Unit tests for error components
- Integration tests for error flows
- E2E tests for error scenarios

## Error Monitoring

### Development
- Errors logged to console
- Error details visible in error boundary
- Stack traces available

### Production
- Consider integrating error tracking service:
  - [Sentry](https://sentry.io/)
  - [LogRocket](https://logrocket.com/)
  - [Rollbar](https://rollbar.com/)
- Monitor error rates
- Set up alerts for critical errors

## Files Created

1. `src/app/error.tsx` - Global error boundary
2. `src/app/not-found.tsx` - 404 page
3. `src/app/loading.tsx` - Global loading state

## Summary

✅ Global error boundary implemented
✅ Custom 404 page with navigation
✅ Global loading state
✅ API route error handling
✅ Form error handling
✅ Image error handling
✅ Graceful degradation throughout
✅ User-friendly error messages
✅ Proper error logging

All error states are handled gracefully throughout the application, providing a smooth user experience even when things go wrong.

