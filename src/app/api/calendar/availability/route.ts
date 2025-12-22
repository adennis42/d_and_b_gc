import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/calendar/availability
 * Fetches available time slots from Google Calendar for a given date range
 * Uses appointment schedule configuration and checks for existing bookings
 * 
 * Query parameters:
 * - date: Date in YYYY-MM-DD format
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const scheduleId = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_SCHEDULE_ID;
    const calendarId = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID;
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!date) {
      return NextResponse.json(
        { error: "Date parameter is required" },
        { status: 400 }
      );
    }

    // Parse the date
    const selectedDate = new Date(date + "T00:00:00");
    if (isNaN(selectedDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    // If we have both schedule ID and API key, try to use Google Calendar Freebusy API
    if (scheduleId && calendarId && apiKey) {
      try {
        const availableSlots = await fetchAvailabilityFromSchedule(
          calendarId,
          scheduleId,
          selectedDate,
          apiKey
        );
        return NextResponse.json({
          availableSlots,
          source: "appointment-schedule-api",
        });
      } catch (error) {
        console.error("Error fetching from appointment schedule API:", error);
        // Fall back to iCal method
      }
    }

    // Use iCal feed method (works with public calendars, no API key needed)
    if (calendarId) {
      try {
        const busySlots = await fetchBusyTimes(calendarId, selectedDate);
        const allSlots = generateDefaultTimeSlots(selectedDate);
        const availableSlots = filterAvailableSlots(allSlots, busySlots, selectedDate);
        
        return NextResponse.json({
          availableSlots,
          source: "google-calendar-ical",
        });
      } catch (error) {
        console.error("Error fetching from Google Calendar iCal:", error);
      }
    }

    // Fallback to default business hours
    return NextResponse.json({
      availableSlots: generateDefaultTimeSlots(selectedDate),
      source: "default",
    });
  } catch (error) {
    console.error("Availability API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch availability" },
      { status: 500 }
    );
  }
}

/**
 * Fetch availability using Google Calendar Freebusy API
 * This method checks your calendar for busy times and returns available slots
 */
async function fetchAvailabilityFromSchedule(
  calendarId: string,
  scheduleId: string,
  date: Date,
  apiKey: string
): Promise<string[]> {
  // Calculate time range for the selected date (start and end of day in UTC)
  const timezone = "America/New_York"; // Update if needed
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  // Format dates for API (RFC3339 format)
  const timeMin = startOfDay.toISOString();
  const timeMax = endOfDay.toISOString();

  // Use Freebusy API to check busy times
  const freebusyUrl = `https://www.googleapis.com/calendar/v3/freeBusy?key=${apiKey}`;
  
  const response = await fetch(freebusyUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      timeMin,
      timeMax,
      items: [{ id: calendarId }],
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Freebusy API error: ${response.status} - ${errorData}`);
  }

  const data = await response.json();
  const busyPeriods = data.calendars?.[calendarId]?.busy || [];

  // Generate all possible slots for the day based on business hours
  const allSlots = generateDefaultTimeSlots(date);
  
  // Convert busy periods to time slots and filter them out
  const busySlots: string[] = [];
  for (const period of busyPeriods) {
    const start = new Date(period.start);
    const end = new Date(period.end);
    const slots = generateTimeSlotsBetween(start, end);
    busySlots.push(...slots);
  }

  // Filter out busy slots
  return filterAvailableSlots(allSlots, busySlots, date);
}

/**
 * Generate default time slots based on business hours
 */
function generateDefaultTimeSlots(date: Date): string[] {
  const dayOfWeek = date.getDay();
  let hours: { start: number; end: number } | null = null;

  if (dayOfWeek === 0) {
    // Sunday - closed
    return [];
  } else if (dayOfWeek === 6) {
    // Saturday
    hours = { start: 10, end: 16 };
  } else {
    // Monday - Friday
    hours = { start: 9, end: 18 };
  }

  if (!hours) return [];

  const slots: string[] = [];
  const startMinutes = hours.start * 60;
  const endMinutes = hours.end * 60;
  const slotDuration = 30; // 30 minutes

  for (let minutes = startMinutes; minutes < endMinutes; minutes += slotDuration) {
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
 * Fetch busy times from Google Calendar using iCal feed
 * This is a simpler approach that doesn't require API authentication
 */
async function fetchBusyTimes(calendarId: string, date: Date): Promise<string[]> {
  try {
    // Get the start and end of the day in the calendar's timezone
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    
    // Format calendar ID for iCal URL (encode if needed)
    const encodedCalendarId = encodeURIComponent(calendarId);
    
    // Fetch iCal feed (public calendars only)
    // Note: This requires the calendar to be publicly accessible
    const icalUrl = `https://calendar.google.com/calendar/ical/${encodedCalendarId}/public/basic.ics`;
    
    const response = await fetch(icalUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch calendar: ${response.status}`);
    }

    const icalData = await response.text();
    
    // Parse iCal data to find events on this date
    const busySlots: string[] = [];
    const eventRegex = /BEGIN:VEVENT[\s\S]*?END:VEVENT/g;
    const events = icalData.match(eventRegex) || [];

    for (const event of events) {
      const dtstartMatch = event.match(/DTSTART[;:](\d{8}T\d{6})/);
      const dtendMatch = event.match(/DTEND[;:](\d{8}T\d{6})/);
      
      if (dtstartMatch && dtendMatch) {
        const startStr = dtstartMatch[1];
        const endStr = dtendMatch[1];
        
        // Check if event is on the selected date
        if (startStr.startsWith(`${year}${month}${day}`)) {
          // Extract time and add to busy slots
          const startTime = parseICalTime(startStr);
          const endTime = parseICalTime(endStr);
          
          // Generate busy time slots
          const slots = generateTimeSlotsBetween(startTime, endTime);
          busySlots.push(...slots);
        }
      }
    }

    return busySlots;
  } catch (error) {
    console.error("Error fetching busy times:", error);
    return [];
  }
}

/**
 * Parse iCal time string (YYYYMMDDTHHMMSS) to Date
 */
function parseICalTime(timeStr: string): Date {
  const year = parseInt(timeStr.substring(0, 4));
  const month = parseInt(timeStr.substring(4, 6)) - 1;
  const day = parseInt(timeStr.substring(6, 8));
  const hour = parseInt(timeStr.substring(9, 11));
  const minute = parseInt(timeStr.substring(11, 13));
  
  return new Date(year, month, day, hour, minute);
}

/**
 * Generate time slots between start and end time
 */
function generateTimeSlotsBetween(start: Date, end: Date): string[] {
  const slots: string[] = [];
  const current = new Date(start);
  
  while (current < end) {
    const hours = current.getHours();
    const mins = current.getMinutes();
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    const displayMins = mins === 0 ? "00" : mins.toString().padStart(2, "0");
    slots.push(`${displayHours}:${displayMins} ${period}`);
    
    // Add 30 minutes
    current.setMinutes(current.getMinutes() + 30);
  }
  
  return slots;
}

/**
 * Filter out busy slots from available slots
 */
function filterAvailableSlots(
  allSlots: string[],
  busySlots: string[],
  date: Date
): string[] {
  return allSlots.filter((slot) => {
    // Check if this slot overlaps with any busy slot
    return !busySlots.some((busySlot) => {
      // Simple overlap check - if slots match exactly or are close
      return slot === busySlot || areSlotsOverlapping(slot, busySlot);
    });
  });
}

/**
 * Check if two time slots overlap
 */
function areSlotsOverlapping(slot1: string, slot2: string): boolean {
  // Simple check - if they're the same, they overlap
  // For more accurate checking, we'd need to parse times and check ranges
  return slot1 === slot2;
}

