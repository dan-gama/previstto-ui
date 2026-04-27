import http from '@/shared/infrastructure/http/http'
import { BankAccountList, BankAccountForm } from '../models/bank-account.model'
import { ApiResponse } from '@/shared/infrastructure/interfaces/ApiResponse'
import { CreateBankAccountCommand, UpdateBankAccountCommand } from '../models/bank-account.command'

export const bankAccountService = {
  async create(payload: CreateBankAccountCommand): Promise<void> {
    await http.post('bank-accounts', payload);
  },

  async update(id: string, payload: UpdateBankAccountCommand): Promise<void> {
    await http.patch(`bank-accounts/${id}`, payload);
  },

  async findAll(): Promise<BankAccountList[]> {
    const { data } = await http.get<ApiResponse<BankAccountList[]>>('bank-accounts');
    return data.data;
  },

  async findById(id: string): Promise<BankAccountForm | null> {
    const { data } = await http.get<ApiResponse<BankAccountForm>>(`bank-accounts/${id}`)
    return data.data;
  },
}
