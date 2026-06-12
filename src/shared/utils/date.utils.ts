/*
  date: Recebe a data no formate Date (yyyy-MM-dd)
*/
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
/*
  dateStr: Receber a data no formato ddMMyyyy
*/
export function parseInputToDate(dateStr: string | null): Date | null {
  if (!dateStr) return null;

  // Remove barras, traços ou espaços para padronizar apenas com números
  const cleanStr = dateStr.replace(/\D/g, '');

  if (cleanStr.length !== 8) return null;

  const day = parseInt(cleanStr.substring(0, 2), 10);
  const month = parseInt(cleanStr.substring(2, 4), 10) - 1;
  const year = parseInt(cleanStr.substring(4, 8), 10);

  const dateObj = new Date(year, month, day);

  return isNaN(dateObj.getTime()) ? null : dateObj;
}
