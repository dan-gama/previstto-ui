import { CategoryType } from "@/shared/domain/types/CategoryType";
import { FinancialType } from "@/shared/domain/types/FinancialType";
import { RecurrenceType } from "../types/RecurrenceType";
import { Installment } from "@/shared/domain/interfaces/Installment";
import { StatusType } from "../types/StatusType";

export interface ScheduleForm {
  id: string | null;
  financialType: FinancialType;
  description: string;
  value: number;
  categories: CategoryType;
  tag: string;
  person: string;
  dueDate: Date;
  recurrenceType: RecurrenceType;
  installment: Installment;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ScheduleItem {
  id: string;
  financialType: FinancialType;
  description: string;
  category: string;
  subCategory: string | null;
  value: number;
  dueDate: Date;
  recurrenceType: RecurrenceType;
  status: StatusType;
  overdue: boolean;
}
