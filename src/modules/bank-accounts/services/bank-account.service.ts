import http from '@/shared/infrastructure/http/http'
import { BankAccountList, BankAccountForm } from '../models/bank-account.model'
import { ApiResponse } from '@/shared/infrastructure/interfaces/ApiResponse'
import { CreateBankAccountCommand, UpdateBankAccountCommand } from '../models/bank-account.command'
import { SelectOptions } from '@/shared/dtos/select-options';

const module = 'bank-accounts';

export const bankAccountService = {
  async create(payload: CreateBankAccountCommand): Promise<void> {
    await http.post(module, payload);
  },

  async update(id: string, payload: UpdateBankAccountCommand): Promise<void> {
    await http.patch(`${module}/${id}`, payload);
  },

  async findAll(): Promise<BankAccountList[]> {
    const { data } = await http.get<ApiResponse<BankAccountList[]>>(module);
    return data.data;
  },

  async findById(id: string): Promise<BankAccountForm | null> {
    const { data } = await http.get<ApiResponse<BankAccountForm>>(`${module}/${id}`)
    return data.data;
  },

  async delete(id: string): Promise<void> {
    await http.delete(`${module}/${id}`);
  },

  async getSelect(): Promise<SelectOptions[]> {
    const { data } = await http.get<ApiResponse<SelectOptions[]>>(`${module}/select`);
    return data.data;
  }
}
