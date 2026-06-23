import { FinancialType } from '@/shared/domain/types/FinancialType';
import { RecurrenceType } from '../types/RecurrenceType';
import { Installment } from '@/shared/domain/interfaces/Installment';
import { CategoryOption } from '@/shared/domain/interfaces/CategorySelect';

export interface ScheduleForm {
  id: string | null;
  type: FinancialType;
  description: string;
  recurrence: RecurrenceType;
  startingOn: string | null;
  amount: number;
  creditBank: string | null;
  category: string | null;
  tag: string | null;
  person: string | null;
  installment: Installment | null;
  active: boolean;
}

export interface ScheduleItem {
  id: string;
  type: string;
  description: string;
  subCategoryName: string | null;
  categoryName: CategoryOption;
  tag: string | null;
  startingOn: Date;
  amount: number;
  recurrence: string;
  active: boolean;
}
