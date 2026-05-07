import http from '@/shared/infrastructure/http/http'
import { CategoryItem } from '../models/category.model'
import { ApiResponse } from '@/shared/infrastructure/interfaces/ApiResponse';
import { CreateCategoryCommand } from '../models/category.command';

const module = 'categories'

export const categoryService = {
  async create(payload: CreateCategoryCommand): Promise<void> {
    await http.post(module, payload);
  },

  async findAll(): Promise<CategoryItem[]> {
    const { data } = await http.get<ApiResponse<CategoryItem[]>>(module);
    return data.data;
  }
}
