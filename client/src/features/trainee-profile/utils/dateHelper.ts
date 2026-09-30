const TIME_ZONE = 'Europe/Amsterdam';
/**
 * Function to format date value.
 *
 * @param {Date | string | null | undefined} date date value selected.
 */
export const formatDate = (date: Date | string | null | undefined) => {
  if (!date) {
    return '';
  }
  const formattedDate = new Date(date);

  if (isNaN(formattedDate.getTime())) {
    return date.toString();
  }
  return formattedDate.toISOString().split('T')[0];
};

// Created once, as formatDateForDisplay runs for every date on every render.
const displayDateFormat = new Intl.DateTimeFormat('nl-NL', {
  timeZone: TIME_ZONE,
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

/**
 * Function to format date value for display.
 * It uses the Dutch locale and the Europe/Amsterdam time zone.
 * Displays the date in the format DD-MM-YYYY.
 * @param {Date | string | null | undefined} date date value selected.
 */
export const formatDateForDisplay = (date: Date | string | null | undefined) => {
  if (!date) {
    return '';
  }
  try {
    return displayDateFormat.format(new Date(date));
  } catch (error) {
    console.error(error);
    return '';
  }
};

// Like displayDateFormat, with the time in hours and minutes.
const displayDateTimeFormat = new Intl.DateTimeFormat('nl-NL', {
  timeZone: TIME_ZONE,
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

/** Formats a moment in time for display as DD-MM-YYYY, HH:mm, in Amsterdam time. */
export const formatDateTimeForDisplay = (date: Date) => {
  return displayDateTimeFormat.format(date);
};

/**
 * Today's calendar date at midnight UTC, the same form as the dates read from the API.
 * `new Date()` would turn into yesterday's date between midnight and 01:00 or 02:00 in Amsterdam.
 */
export const today = () => {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
};

/**
 * Formats a date as the YYYY-MM-DD string the API expects for a date without a time.
 */
export const toISODateString = (date: Date) => {
  return date.toISOString().split('T')[0];
};
