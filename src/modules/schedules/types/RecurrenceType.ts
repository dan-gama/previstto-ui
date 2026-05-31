export type RecurrenceType = 'monthly' | 'installment';

export const RecurrenceTypeLabel: Record<RecurrenceType, string> = {
  monthly: 'Mensal',
  installment: 'Parcelamento',
}
