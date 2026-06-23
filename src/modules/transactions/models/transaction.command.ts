import { FinancialType } from "@/shared/domain/types/FinancialType";
import { StatusType } from "@/modules/schedules/types/StatusType";

export type CreateTransactionCommand = {
  type: FinancialType;
  sourceId: string;
  destinationId: string;
  tag: string | null;
  transactionDate: Date | null;
  dueDate: Date | null;
  paymentDate: Date | null;
  status: StatusType;
  description: string
  installment: number | null;
  amount: number;
  person: string | null;
}

export type UpdateScheduleCommand = {
  type: FinancialType;
  sourceId: string;
  destinationId: string;
  tag: string | null;
  transactionDate: Date | null;
  dueDate: Date | null;
  paymentDate: Date | null;
  status: StatusType;
  description: string;
  installment: number | null;
  amount: number;
  person: string | null;
}
