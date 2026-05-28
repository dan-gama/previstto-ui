export type StatusType = 'pending' | 'paid' | 'canceled';

export const StatusTypeLabel: Record<StatusType, string> = {
  pending: 'Pendente',
  paid: 'Pago',
  canceled: 'Cancelado',
}
