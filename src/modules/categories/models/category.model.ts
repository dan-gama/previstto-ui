import { CategoryNodeType } from './category-node-type.type'


export interface CategoryForm {
  id: string | null
  parentId: string | null
  type: CategoryNodeType
  name: string
  forecast: number
  active: boolean
  tags: string[]
}

export interface CategoryItem {
  id: string
  parentId: string | null
  type: CategoryNodeType
  name: string
  forecast: number
  active: boolean
  tags: string[]
}
