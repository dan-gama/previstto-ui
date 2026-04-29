export const parseDecimalValue = (val: string | number): number => {
  if (typeof val === 'number') return val;

  const normalizedValue = val
    .trim()
    .replace(/\./g, '')
    .replace(',', '.');

  return Number(normalizedValue);
};

export const parseCurrencyValue = (val: string | number): number => {
  if (typeof val === 'number') return val;

  const digits = val.replace(/\D/g, '');

  if (!digits) return Number.NaN;

  const signal = val.includes('-') ? -1 : 1;

  return signal * (Number(digits) / 100);
};
