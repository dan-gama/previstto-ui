import { CategoryNodeType, FinancialType } from './category-node-type.type';

export type CreateCategoryCommand = {
  name: string;
  parentId: string | null,
  type: CategoryNodeType,
  financialType: FinancialType,
  forecast: number,
  active: boolean,
  tags: string[] | null,
}
export type UpdateCategoryCommand = {
  name: string,
  forecast: number,
  active: boolean,
  tags: string[] | null,
}
