import { CategoryType } from '@/shared/domain/types/CategoryType';
import { FinancialType } from '@/shared/domain/types/FinancialType';

export type CreateCategoryCommand = {
  name: string;
  parentId: string | null,
  type: CategoryType,
  financialType: FinancialType,
  forecast: number,
  active: boolean,
  tags: string[],
}
export type UpdateCategoryCommand = {
  name: string,
  forecast: number,
  active: boolean,
  tags: string[],
}
