const TIME_ZONE = 'Europe/Amsterdam';
/**
 * Function to format date value.
 *
 * @param {Date | undefined} date date value selected.
 */
export const formatDate = (date: Date | undefined) => {
  if (!date) return '';
  const formattedDate = new Date(date);

  if (isNaN(formattedDate.getTime())) {
    return date.toString();
  }
  return formattedDate.toISOString().split('T')[0];
};

/**
 * Function to format date value for display.
 * It uses the Dutch locale and the Europe/Amsterdam time zone.
 * Displays the date in the format DD-MM-YYYY.
 * @param {string | undefined} date date value selected.
 */
export const formatDateForDisplay = (date: Date | undefined) => {
  if (!date) return '';
  try {
    const formattedDate = new Intl.DateTimeFormat('nl-NL', {
      timeZone: TIME_ZONE,
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(date));
    return formattedDate;
  } catch (error) {
    console.error(error);
    return '';
  }
};
