import { SelectOptions } from '@/shared/dtos/select-options';
import http from '@/shared/infrastructure/http/http'
import { ApiResponse } from '@/shared/infrastructure/interfaces/ApiResponse';

const module = 'transactions'

export const transactionService = {
  async getTransactionSourceSelect(): Promise<SelectOptions[]> {
    const { data } = await http.get<ApiResponse<SelectOptions[]>>(`${module}/sources`)
    return data.data;
  }
}
