import { CategoryNodeType } from './category-node-type.type';
import { CategoryForm } from './category.model';

export type CreateCategoryCommand = {
  name: string;
  parentId: string | null,
  type: CategoryNodeType,
  forecast: number,
  active: boolean,
  tags: string[] | null,
}
export type UpdateCategoryCommand = CategoryForm
