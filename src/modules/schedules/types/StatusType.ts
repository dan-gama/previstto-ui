export type StatusType = 'overdue' | 'pending' | 'paid' | 'canceled';

export const StatusTypeLabel: Record<StatusType, string> = {
  overdue: 'Vencido',
  pending: 'Pendente',
  paid: 'Pago',
  canceled: 'Cancelado',
}
