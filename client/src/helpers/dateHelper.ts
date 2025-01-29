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
