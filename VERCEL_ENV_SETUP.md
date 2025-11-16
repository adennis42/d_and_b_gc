# Vercel Environment Variables Setup

This guide explains how to set up environment variables for your contractor website on Vercel.

## Local Development

The `.env.local` file has been created in your project root. Fill in your actual values for local development.

**Important**: `.env.local` is already in `.gitignore` and will NOT be committed to git.

## Vercel Deployment

For Vercel deployment, you need to add environment variables in the Vercel dashboard:

### Steps:

1. **Go to your Vercel project dashboard**
   - Navigate to your project on [vercel.com](https://vercel.com)
   - Click on your project

2. **Access Environment Variables**
   - Go to **Settings** → **Environment Variables**

3. **Add Variables**
   - Add each variable from `.env.local` one by one
   - Select the appropriate environments (Production, Preview, Development)
   - For `NEXT_PUBLIC_*` variables, they will be available in the browser
   - For server-only variables (like API keys), they remain server-side only

### Required Variables:

#### Email (Resend)
- `RESEND_API_KEY` - Your Resend API key
- `EMAIL_FROM` - Sender email address (e.g., noreply@yourdomain.com)
- `EMAIL_TO` - Recipient email address (your business email)

#### Google Calendar (Optional)
- `GOOGLE_CALENDAR_ID` - Your Google Calendar ID
- `GOOGLE_API_KEY` - Google API key for Calendar access

#### Analytics (Optional)
- `NEXT_PUBLIC_GA_ID` - Google Analytics 4 Measurement ID (format: G-XXXXXXXXXX)

#### Image Storage (Optional - Cloudinary)
- `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret

### Environment-Specific Variables

You can set different values for:
- **Production** - Live site
- **Preview** - Preview deployments (pull requests)
- **Development** - Local development (via `.env.local`)

### After Adding Variables

1. **Redeploy** your application for changes to take effect
2. Variables are available immediately in new deployments
3. Existing deployments need to be redeployed to pick up new variables

### Security Best Practices

- ✅ Never commit `.env.local` to git (already in `.gitignore`)
- ✅ Use Vercel's environment variables for production secrets
- ✅ Use different API keys for development and production when possible
- ✅ Rotate API keys regularly
- ✅ Use the minimum required permissions for API keys

### Testing Locally

To test with environment variables locally:
1. Fill in `.env.local` with your values
2. Restart your Next.js dev server (`npm run dev`)
3. Variables will be loaded automatically

### Troubleshooting

- **Variables not working?** Make sure you've redeployed after adding them
- **NEXT_PUBLIC_* variables not accessible?** Check that they're prefixed correctly
- **Server variables exposed?** Ensure non-public variables don't have `NEXT_PUBLIC_` prefix

