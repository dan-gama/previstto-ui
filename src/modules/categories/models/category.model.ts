import { CategoryType } from "@/shared/domain/types/CategoryType"
import { FinancialType } from "@/shared/domain/types/FinancialType"

export interface CategoryForm {
  id: string | null
  parentId: string | null
  type: CategoryType
  financialType: FinancialType
  name: string
  forecast: number
  active: boolean
  tags: string[]
}

export interface CategoryItem {
  id: string
  parentId: string | null
  type: CategoryType
  financialType: FinancialType
  name: string
  forecast: number
  active: boolean
  tags: string[]
}
