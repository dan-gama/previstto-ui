import { FinancialType } from '@/shared/domain/types/FinancialType';
import { RecurrenceType } from '../types/RecurrenceType';
import { Installment } from '@/shared/domain/interfaces/Installment';

// Interface estrita para os objetos do Quasar Select
export interface CategoryOption {
  label: string        // Usado internamente pelo Quasar para busca textual completa
  pureLabel: string    // Apenas o nome limpo (ex: "Smartphones")
  value: string | number
  disable?: boolean
  isSub: boolean
  parentName?: string  // Nome da categoria pai (ex: "Eletrônicos")
  tags: Array<string>
}

export interface ScheduleForm {
  id: string | null;
  type: FinancialType;
  description: string;
  recurrence: RecurrenceType;
  startingOn: string | null;
  amount: number;
  bankAccount: string | null;
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
