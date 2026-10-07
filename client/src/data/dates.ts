const TIME_ZONE = 'Europe/Amsterdam';

// The date as the YYYY-MM-DD string the API expects for a date without a time.
export const toISODateString = (date: Date) => {
  return date.toISOString().split('T')[0];
};

// The date as YYYY-MM-DD, or the input as text when it is not a valid date.
export const formatDate = (date: Date | string | null | undefined) => {
  if (!date) {
    return '';
  }
  const formattedDate = new Date(date);

  if (isNaN(formattedDate.getTime())) {
    return date.toString();
  }
  return toISODateString(formattedDate);
};

// Created once, as formatDateForDisplay runs for every date on every render.
const displayDateFormat = new Intl.DateTimeFormat('nl-NL', {
  timeZone: TIME_ZONE,
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

// The date as DD-MM-YYYY in Amsterdam time, or empty when it is missing or invalid.
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

// A moment in time as DD-MM-YYYY, HH:mm, in Amsterdam time.
export const formatDateTimeForDisplay = (date: Date) => {
  return displayDateTimeFormat.format(date);
};

// Today at midnight UTC, like the API's dates. `new Date()` is still yesterday just after midnight in Amsterdam.
export const today = () => {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
};
