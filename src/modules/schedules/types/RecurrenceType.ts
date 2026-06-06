export type RecurrenceType = 'monthly' | 'installment' | 'none';

export const RecurrenceTypeLabel: Record<RecurrenceType, string> = {
  monthly: 'Mensal',
  installment: 'Parcelado',
  none: 'Nenhum'
}
