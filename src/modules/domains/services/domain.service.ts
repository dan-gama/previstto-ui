import http from '@/shared/infrastructure/http/http'
import { ApiResponse } from '@/shared/infrastructure/interfaces/ApiResponse'
import { SelectOptions } from '@/shared/dtos/select-options'
import { BankDomain, AccountTypeDomain } from '../models/domain.model'

export const domainService = {
  async getBanks(): Promise<SelectOptions[]> {
    const { data } = await http.get<ApiResponse<BankDomain[]>>('domains/banks');
    return data.data.map(d => ({
      value: d.id,
      label: `${d.code}-${d.name}`
    }));
  },

  async getAccountTypes(): Promise<SelectOptions[]> {
    const { data } = await http.get<ApiResponse<AccountTypeDomain[]>>('domains/account-types');
    return data.data.map(d => ({
      value: d.id,
      label: `${d.code}-${d.name}`
    }));
  }
}
