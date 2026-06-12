export function formatDateInput(date: Date | string | null): string {
  if (!date) return '';

  //const dateObj = typeof date == 'string' ? new Date(date + "T00:00:00") : date;

  let dateObj: Date;
  if (typeof date === 'string') {
    const needsTimeZoneFix = date.length === 10 && !date.includes("T");
    dateObj = needsTimeZoneFix ? new Date(date + "T00:00:00") : new Date(date);
  } else {
    dateObj = date;
  }

  if (isNaN(dateObj.getTime())) return '';

  // Verifica se string original é UTC "Z"
  const isUTC = typeof date === 'string' && date.includes("Z");

  const day = String(isUTC ? dateObj.getUTCDate() : dateObj.getDate()).padStart(2, '0');
  const month = String(isUTC ? dateObj.getUTCMonth() + 1 : dateObj.getMonth() + 1).padStart(2, '0');
  const year = String(isUTC ? dateObj.getUTCFullYear() : dateObj.getFullYear());

  console.log(date);

  return `${day}${month}${year}`;
}
