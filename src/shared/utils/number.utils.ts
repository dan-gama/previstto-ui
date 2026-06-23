/**
 * Converte o campo para o padrão typescript
 *
 * @param val: Valor do campo numérico decimal
 * @returns
 */
export const parseDecimalValue = (val: string | number): number => {
  if (typeof val === 'number') return val;

  const normalizedValue = val
    .trim()
    .replace(/\./g, '')
    .replace(',', '.');

  return Number(normalizedValue);
};
