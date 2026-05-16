import { CategoryNodeType, FinancialType } from './category-node-type.type'

export interface CategoryForm {
  id: string | null
  parentId: string | null
  type: CategoryNodeType
  financialType: FinancialType,
  name: string
  forecast: number
  active: boolean
  tags: string[] | null
}

export interface CategoryItem {
  id: string
  parentId: string | null
  type: CategoryNodeType
  financialType: FinancialType,
  name: string
  forecast: number
  active: boolean
  tags: string[] | null
}
