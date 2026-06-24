import { SelectOptions } from '@/shared/dtos/select-options';
import { ApiResponse } from '@/shared/infrastructure/interfaces/ApiResponse';
import { CreateTransactionCommand, UpdateTransactionCommand } from '../models/transaction.command';
import { TransactionForm, TransactionItem } from '../models/transaction.model';
import http from '@/shared/infrastructure/http/http'

const module = 'transactions'

export const transactionService = {
  async getTransactionSourceSelect(): Promise<SelectOptions[]> {
    const { data } = await http.get<ApiResponse<SelectOptions[]>>(`${module}/sources`)
    return data.data;
  },

  async create(payload: CreateTransactionCommand): Promise<void> {
    await http.post(module, payload);
  },

  async update(id: string, payload: UpdateTransactionCommand): Promise<void> {
    await http.patch(`${module}/${id}`, payload);
  },

  async delete(id: string): Promise<void> {
    await http.delete(`${module}/${id}`);
  },

  async findAll(): Promise<TransactionItem[]> {
    const { data } = await http.get<ApiResponse<TransactionItem[]>>(`${module}`);
    return data.data;
  },

  async findById(id: string): Promise<TransactionForm> {
    const { data } = await http.get<ApiResponse<TransactionForm>>(`${module}/${id}`)
    return data.data;
  }
}
