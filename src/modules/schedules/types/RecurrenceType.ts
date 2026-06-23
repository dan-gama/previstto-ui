export type RecurrenceType = 'monthly' | 'installment' | 'single';

export const RecurrenceTypeLabel: Record<RecurrenceType, string> = {
  monthly: 'Mensal',
  installment: 'Parcelado',
  single: 'Única'
}
