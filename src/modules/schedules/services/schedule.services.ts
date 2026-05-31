import http from '@/shared/infrastructure/http/http'
import { ApiResponse } from '@/shared/infrastructure/interfaces/ApiResponse';
import { ScheduleItem } from '../models/schedule.model';

const module = 'schedules'

export const scheduleService = {
  // async create(payload: CreateCategoryCommand): Promise<void> {
  //   await http.post(module, payload);
  // },

  // async createSubCategory(payload: CreateCategoryCommand): Promise<void> {
  //   await http.post(`${module}/sub`, payload);
  // },

  // async update(id: string, payload: UpdateCategoryCommand): Promise<void> {
  //   await http.patch(`${module}/${id}`, payload);
  // },

  // async delete(id: string): Promise<void> {
  //   await http.delete(`${module}/${id}`);
  // },

  async findAll(): Promise<ScheduleItem[]> {
    const { data } = await http.get<ApiResponse<ScheduleItem[]>>(`${module}/grid`);
    return data.data;
  }
}
