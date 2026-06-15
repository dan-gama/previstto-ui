import http from '@/shared/infrastructure/http/http'
import { ApiResponse } from '@/shared/infrastructure/interfaces/ApiResponse';
import { ScheduleForm, ScheduleItem } from '../models/schedule.model';
import { CreateScheduleCommand, UpdateScheduleCommand } from '../models/schedule.command';
import { SelectOptions } from '@/shared/dtos/select-options';
import { TransactionSourceSelect } from '@/shared/domain/interfaces/TransactionSourceSelect';

const module = 'schedules'

export const scheduleService = {
  async create(payload: CreateScheduleCommand): Promise<void> {
    await http.post(module, payload);
  },

  async update(id: string, payload: UpdateScheduleCommand): Promise<void> {
    await http.patch(`${module}/${id}`, payload);
  },

  async delete(id: string): Promise<void> {
    await http.delete(`${module}/${id}`);
  },

  async findAll(): Promise<ScheduleItem[]> {
    const { data } = await http.get<ApiResponse<ScheduleItem[]>>(`${module}/grid`);
    return data.data;
  },

  async findById(id: string): Promise<ScheduleForm> {
    const { data } = await http.get<ApiResponse<ScheduleForm>>(`${module}/${id}`)
    return data.data;
  }
}
