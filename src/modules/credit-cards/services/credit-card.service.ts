import http from '@/shared/infrastructure/http/http'
import { ApiResponse } from '@/shared/infrastructure/interfaces/ApiResponse'
import { CreditCardForm, CreditCardList } from '../models/credit-card.model'
import { CreateCreditCardCommand, UpdateCreditCardCommand } from '../models/credit-card.command'

const module = 'credit-cards';

export const creditCardService = {
  async create(payload: CreateCreditCardCommand): Promise<void> {
    await http.post(module, payload);
  },

  async update(id: string, payload: UpdateCreditCardCommand): Promise<void> {
    await http.patch(`${module}/${id}`, payload);
  },

  async findAll(): Promise<CreditCardList[]> {
    const { data } = await http.get<ApiResponse<CreditCardList[]>>(module)
    return data.data;
  },

  async findById(id: string): Promise<CreditCardForm | null> {
    const { data } = await http.get<ApiResponse<CreditCardForm>>(`${module}/${id}`)
    return data.data;
  },
}
