import http from '@/shared/infrastructure/http/http'
import { CategoryItem } from '../models/category.model'
import { ApiResponse } from '@/shared/infrastructure/interfaces/ApiResponse';
import { CreateCategoryCommand, UpdateCategoryCommand } from '../models/category.command';
import { CategorySelect } from '@/shared/domain/interfaces/CategorySelect';

const module = 'categories'

export const categoryService = {
  async create(payload: CreateCategoryCommand): Promise<void> {
    await http.post(module, payload);
  },

  async createSubCategory(payload: CreateCategoryCommand): Promise<void> {
    await http.post(`${module}/sub`, payload);
  },

  async update(id: string, payload: UpdateCategoryCommand): Promise<void> {
    await http.patch(`${module}/${id}`, payload);
  },

  async delete(id: string): Promise<void> {
    await http.delete(`${module}/${id}`);
  },

  async findAll(): Promise<CategoryItem[]> {
    const { data } = await http.get<ApiResponse<CategoryItem[]>>(module);
    return data.data;
  },

  async getSelect(typeFinancial: string): Promise<CategorySelect[]> {
    const { data } = await http.get<ApiResponse<CategorySelect[]>>(`${module}/select?typeFinancial=${typeFinancial}`);
    return data.data;
  }
}
