export const parseDecimalValue = (val: string | number): number => {
  if (typeof val === 'number') return val;

  const normalizedValue = val
    .trim()
    .replace(/\./g, '')
    .replace(',', '.');

  return Number(normalizedValue);
};
