import { FinancialType } from "@/shared/domain/types/FinancialType";
import { RecurrenceType } from "../types/RecurrenceType";
import { Installment } from "@/shared/domain/interfaces/Installment";

export type CreateScheduleCommand = {
  type: FinancialType;
  description: string;
  recurrence: RecurrenceType;
  startingOn: Date | null;
  amount: number;
  bankAccount: string | null;
  category: string;
  tag: string | null;
  person: string | null;
  installments: Installment | null;
  active: boolean;
}

export type UpdateScheduleCommand = {
  description: string;
  startingOn: Date | null;
  amount: number;
  bankAccount: string | null;
  category: string;
  tag: string | null;
  person: string | null;
  installments: Installment | null;
  active: boolean;
}
