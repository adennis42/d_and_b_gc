# Google Calendar Scheduling Setup Guide

This guide will walk you through setting up Google Calendar scheduling for your website. The website supports two methods, but we recommend **Option 1: Google Calendar Appointment Scheduling** as it's simpler and doesn't require API keys.

## Option 1: Google Calendar Appointment Scheduling (Recommended) ⭐

This is the easiest method and provides a professional booking experience directly embedded in your website.

### Step 1: Create an Appointment Schedule

1. **Go to Google Calendar**
   - Visit [calendar.google.com](https://calendar.google.com)
   - Make sure you're signed in with the Google account you want to use for scheduling

2. **Create a New Appointment Schedule**
   - Click on **"Create"** button (top left)
   - Select **"Appointment schedule"**
   - Or go directly to: [https://calendar.google.com/calendar/u/0/appointments/schedules](https://calendar.google.com/calendar/u/0/appointments/schedules)

3. **Configure Your Schedule**
   - **Name**: Give it a name like "Free Consultation" or "Project Consultation"
   - **Duration**: Set how long each appointment should be (e.g., 30 minutes, 1 hour)
   - **General availability**: Set your available hours (e.g., Monday-Friday 9 AM - 6 PM)
   - **Scheduling window**: How far in advance people can book (e.g., 1 day to 3 months)
   - **Booked appointment settings**: 
     - Add a description about what the consultation includes
     - Add location (in-person address, phone number, or video call link)
     - Add any questions you want clients to answer when booking

4. **Save Your Schedule**
   - Click **"Save"** or **"Next"** to complete setup

### Step 2: Get Your Schedule ID

1. **Find Your Schedule URL**
   - After creating the schedule, Google will show you a shareable link
   - The URL will look like: `https://calendar.google.com/calendar/appointments/schedules/[SCHEDULE_ID]`
   - Or you can find it by:
     - Going to your Google Calendar
     - Clicking on the appointment schedule you created
     - The URL in your browser will contain the schedule ID

2. **Extract the Schedule ID**
   - The schedule ID is the long string of characters at the end of the URL
   - Example: If the URL is `https://calendar.google.com/calendar/appointments/schedules/1234567890abcdefghijklmnopqrstuvwxyz`
   - Then your schedule ID is: `1234567890abcdefghijklmnopqrstuvwxyz`

### Step 3: Add to Environment Variables

#### For Local Development:

1. **Open `.env.local`** in your project root (create it if it doesn't exist)
2. **Add the schedule ID**:
   ```bash
   NEXT_PUBLIC_GOOGLE_CALENDAR_SCHEDULE_ID=your-schedule-id-here
   ```
   Replace `your-schedule-id-here` with your actual schedule ID

3. **Restart your dev server**:
   ```bash
   npm run dev
   ```

#### For Vercel Deployment:

1. **Go to Vercel Dashboard**
   - Navigate to your project on [vercel.com](https://vercel.com)
   - Click on your project

2. **Add Environment Variable**
   - Go to **Settings** → **Environment Variables**
   - Click **Add New**
   - **Key**: `NEXT_PUBLIC_GOOGLE_CALENDAR_SCHEDULE_ID`
   - **Value**: Your schedule ID (the long string from Step 2)
   - Select environments: **Production**, **Preview**, **Development**
   - Click **Save**

3. **Redeploy**
   - Go to **Deployments** tab
   - Click the **"..."** menu on your latest deployment
   - Select **"Redeploy"**
   - Or push a new commit to trigger a deployment

### Step 4: Verify It Works

1. **Visit your schedule page**: `http://localhost:3000/schedule` (local) or your live site
2. **You should see**: The Google Calendar appointment scheduling widget embedded on the page
3. **Test booking**: Try selecting a time slot to make sure it works

---

## Option 2: Standard Calendar Embed (Alternative)

This method embeds your entire Google Calendar, but it's less ideal for scheduling appointments.

### Step 1: Make Your Calendar Public

1. **Go to Google Calendar Settings**
   - Visit [calendar.google.com](https://calendar.google.com)
   - Click the **⚙️ Settings** icon (top right)
   - Click **"Settings"**

2. **Find Your Calendar**
   - In the left sidebar, find **"Settings for my calendars"**
   - Click on the calendar you want to use

3. **Make It Public**
   - Scroll down to **"Access permissions"**
   - Check **"Make available to public"**
   - Select **"See all event details"** from the dropdown
   - Click **"Save"**

### Step 2: Get Your Calendar ID

1. **Find Calendar ID**
   - Still in Settings, scroll to **"Integrate calendar"**
   - Find **"Calendar ID"** - it will look like: `yourname@gmail.com` or `abc123@group.calendar.google.com`
   - Copy this ID

### Step 3: Add to Environment Variables

#### For Local Development:

Add to `.env.local`:
```bash
NEXT_PUBLIC_GOOGLE_CALENDAR_ID=your-calendar-id@gmail.com
```

#### For Vercel:

Add environment variable:
- **Key**: `NEXT_PUBLIC_GOOGLE_CALENDAR_ID`
- **Value**: Your calendar ID

---

## Troubleshooting

### Calendar Not Showing?

1. **Check environment variable name**
   - Must be exactly: `NEXT_PUBLIC_GOOGLE_CALENDAR_SCHEDULE_ID` (for Option 1)
   - Or: `NEXT_PUBLIC_GOOGLE_CALENDAR_ID` (for Option 2)

2. **Restart your dev server** after adding environment variables
   ```bash
   # Stop the server (Ctrl+C) and restart
   npm run dev
   ```

3. **Check the schedule page**
   - Visit `/schedule` on your site
   - If you see "Calendar Not Configured", the environment variable isn't set correctly

4. **Verify the schedule ID**
   - Make sure you copied the entire schedule ID (it's a long string)
   - No extra spaces or characters

5. **For Vercel deployments**
   - Make sure you redeployed after adding the environment variable
   - Check that the variable is set for the correct environment (Production/Preview)

### Schedule ID Not Working?

- Make sure your appointment schedule is **active** in Google Calendar
- Verify the schedule ID is correct by visiting the schedule URL directly
- Check that your schedule has available time slots configured

### Calendar Embed Not Showing?

- Verify your calendar is set to **"Public"** in Google Calendar settings
- Make sure you're using the correct calendar ID (not your email address, unless that's your calendar ID)
- Check that the calendar has events or is configured to show

---

## Best Practices

### For Appointment Scheduling (Option 1):

✅ **Do:**
- Set clear availability windows
- Add buffer time between appointments
- Include helpful information in the appointment description
- Set a reasonable scheduling window (e.g., book 1 day to 3 months in advance)
- Add location or video call information

❌ **Don't:**
- Make the schedule too restrictive (fewer bookings)
- Forget to update availability when you're unavailable
- Use a personal calendar ID (create a separate schedule)

### For Calendar Embed (Option 2):

✅ **Do:**
- Use a dedicated calendar for business appointments
- Keep your calendar updated
- Make sure events have clear titles

❌ **Don't:**
- Use your personal calendar (privacy concerns)
- Show sensitive information in event titles

---

## Next Steps

Once your calendar is set up:

1. ✅ Test booking an appointment yourself
2. ✅ Share the schedule page with a test user
3. ✅ Verify appointments appear in your Google Calendar
4. ✅ Set up email notifications in Google Calendar (Settings → Notifications)
5. ✅ Consider adding calendar reminders for yourself

---

## Need Help?

- **Google Calendar Help**: [support.google.com/calendar](https://support.google.com/calendar)
- **Appointment Scheduling Guide**: [support.google.com/calendar/answer/7638168](https://support.google.com/calendar/answer/7638168)
- **Check your code**: See `src/app/(routes)/schedule/page.tsx` for implementation details

