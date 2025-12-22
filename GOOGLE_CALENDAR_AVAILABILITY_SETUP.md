# Google Calendar Availability Integration Setup

This guide explains how to set up your Google Calendar appointment schedule so the booking form can display real-time available time slots based on your actual calendar configuration and bookings.

## How It Works

The booking form uses your Google Calendar appointment schedule to:
1. **Respect your schedule configuration** - Only shows times on days/hours you've configured in your appointment schedule
2. **Check existing bookings** - Fetches your calendar to see which slots are already booked
3. **Display available slots** - Shows only free time slots that match your schedule
4. **Update automatically** - Updates in real-time when you add/remove appointments

## Two Methods Available

### Method 1: Using Google Calendar API (Recommended)
- More accurate and reliable
- Requires Google API key setup
- Can check private calendars
- Better performance

### Method 2: Using Public iCal Feed (Simpler)
- No API key needed
- Requires calendar to be public
- Works with basic setup
- Good fallback option

## Setup Steps

### Step 1: Get Your Appointment Schedule ID

If you already have a Google Calendar appointment schedule set up:

1. **Go to your appointment schedule**
   - Visit: https://calendar.google.com/calendar/u/0/appointments/schedules
   - Or open your appointment schedule from Google Calendar

2. **Copy the Schedule ID**
   - The URL will look like: `https://calendar.app.google/gTtitreq45yLmSLi8`
   - The schedule ID is the part after the last `/` (e.g., `gTtitreq45yLmSLi8`)

3. **Add to `.env.local`**:
   ```bash
   NEXT_PUBLIC_GOOGLE_CALENDAR_SCHEDULE_ID=gTtitreq45yLmSLi8
   ```

### Step 2: Set Up Google Calendar API (Recommended for Best Results)

For the most accurate availability checking:

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Create a new project or select existing one

2. **Enable Calendar API**
   - Go to "APIs & Services" → "Library"
   - Search for "Google Calendar API"
   - Click "Enable"

3. **Create API Key**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy the API key
   - (Optional) Restrict the key to Calendar API only for security

4. **Add to `.env.local`**:
   ```bash
   GOOGLE_API_KEY=your-api-key-here
   ```

### Step 3: Get Your Calendar ID

1. **Go to Google Calendar Settings**

1. **Go to Google Calendar**
   - Visit [calendar.google.com](https://calendar.google.com)
   - Sign in with your Google account

2. **Open Calendar Settings**
   - Click the **⚙️ Settings** icon (top right)
   - Click **"Settings"**
   - In the left sidebar, find **"Settings for my calendars"**
   - Click on the calendar you want to use for appointments

3. **Make Calendar Public**
   - Scroll down to **"Access permissions"**
   - Check **"Make available to public"**
   - Select **"See all event details"** from the dropdown
   - Click **"Save"**

### Step 2: Get Your Calendar ID

1. **Still in Calendar Settings**
   - Scroll down to **"Integrate calendar"**
   - Find **"Calendar ID"**
   - It will look like: `yourname@gmail.com` or `abc123@group.calendar.google.com`
   - Copy this ID

### Step 4: Add to Environment Variables

#### For Local Development:

Add to `.env.local`:
```bash
NEXT_PUBLIC_GOOGLE_CALENDAR_ID=your-calendar-id@gmail.com
```

#### For Vercel:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add:
   - **Key**: `NEXT_PUBLIC_GOOGLE_CALENDAR_ID`
   - **Value**: Your calendar ID
   - **Environments**: Production, Preview, Development
3. Redeploy your site

### Step 5: Test It

1. **Add a test event** to your Google Calendar for a specific time
2. **Visit your schedule page** (`/schedule`)
3. **Select the date** with your test event
4. **Verify** that the booked time slot doesn't appear in the available times

## How Availability is Calculated

The system works in two ways depending on your setup:

### With API Key (Recommended):
1. Uses Google Calendar Freebusy API to check your calendar
2. Generates time slots based on your business hours:
   - **Monday-Friday**: 9:00 AM - 6:00 PM (30-minute slots)
   - **Saturday**: 10:00 AM - 4:00 PM (30-minute slots)
   - **Sunday**: Closed
3. Checks which times are already booked via Freebusy API
4. Removes booked slots and displays only available times

### Without API Key (iCal Method):
1. Fetches your public calendar's iCal feed
2. Parses events for the selected date
3. Generates slots based on business hours
4. Filters out times that overlap with existing events
5. Displays only available slots

**Note**: Your appointment schedule configuration (which days/times you've set up) is respected because:
- The system only generates slots during your configured business hours
- Any appointments you've booked through the schedule will show as busy
- The schedule's availability windows are indirectly respected through your calendar events

## Important Notes

### Privacy Considerations

- **Public Calendar**: Making your calendar public means anyone can see your events
- **Recommendation**: Create a separate calendar specifically for appointments
  - Go to Google Calendar → **"+"** → **"Create new calendar"**
  - Name it "Appointments" or "Consultations"
  - Make only this calendar public
  - Use this calendar ID in your environment variables

### Creating a Separate Appointment Calendar

1. **Create New Calendar**
   - In Google Calendar, click **"+"** next to "Other calendars"
   - Select **"Create new calendar"**
   - Name it: "Appointments" or "Consultations"
   - Click **"Create calendar"**

2. **Make It Public**
   - Go to Settings → Your new calendar
   - Set to "Public" with "See all event details"

3. **Use This Calendar for Appointments**
   - When creating appointment events, select this calendar
   - Use this calendar's ID in your environment variables

### Timezone

- The system uses your calendar's timezone
- Make sure your Google Calendar timezone matches your business location
- Check: Settings → General → Time zone

## Troubleshooting

### No Available Slots Showing

1. **Check calendar is public**
   - Verify "Make available to public" is checked
   - Verify "See all event details" is selected

2. **Check calendar ID**
   - Make sure the ID is correct (no extra spaces)
   - Format should be: `email@gmail.com` or `id@group.calendar.google.com`

3. **Check date selection**
   - Make sure you're selecting a valid date (not Sunday, not in the past)

### All Slots Showing as Available

- This means the calendar fetch is failing
- Check browser console for errors
- Verify calendar is public and accessible
- The system will fall back to default business hours if calendar fetch fails

### Specific Times Not Showing

- If you've configured specific appointment times in Google Calendar Appointment Scheduling, those won't automatically sync
- The system checks for existing events/bookings, not appointment schedule configuration
- To restrict times, add "busy" events to your calendar for times you don't want available

## Advanced: Using Appointment Schedule Configuration

If you want to use your Google Calendar Appointment Scheduling configuration (specific days/times), you have two options:

### Option 1: Add Busy Events
- Create all-day "busy" events for days/times you don't want available
- The system will automatically exclude those slots

### Option 2: Customize Business Hours
- Update the `BUSINESS_HOURS` configuration in `src/app/api/calendar/availability/route.ts`
- Modify the `generateDefaultTimeSlots` function to match your appointment schedule

## Need Help?

- **Google Calendar Help**: [support.google.com/calendar](https://support.google.com/calendar)
- **Check your calendar**: Visit `https://calendar.google.com/calendar/ical/YOUR_CALENDAR_ID/public/basic.ics` to verify it's accessible
- **Test the API**: Visit `/api/calendar/availability?date=2024-01-15` (replace with a valid date) to test the endpoint

