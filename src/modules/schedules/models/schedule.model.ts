import { CategoryType } from '@/shared/domain/types/CategoryType';
import { FinancialType } from '@/shared/domain/types/FinancialType';
import { RecurrenceType } from '../types/RecurrenceType';
import { Installment } from '@/shared/domain/interfaces/Installment';
import { StatusType } from '../types/StatusType';

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
  type: string;
  description: string;
  subCategoryName: string
  categoryName: string;
  tag: string;
  dueDate: Date;
  amount: number;
  recurrence: string;
  status: string;
  overdue: boolean;
  active: boolean;
}
