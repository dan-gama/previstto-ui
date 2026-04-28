import http from '@/shared/infrastructure/http/http'
import { ApiResponse } from '@/shared/infrastructure/interfaces/ApiResponse'
import { CreditCardForm, CreditCardList } from '../models/credit-card.model'
import { CreateCreditCardCommand, UpdateCreditCardCommand } from '../models/credit-card.command'

export const creditCardService = {
  async create(payload: CreateCreditCardCommand): Promise<void> {
    await http.post('credit-cards', payload);
  },

  async update(id: string, payload: UpdateCreditCardCommand): Promise<void> {
    await http.patch(`credit-cards/${id}`, payload);
  },

  async findAll(): Promise<CreditCardList[]> {
    const { data } = await http.get<ApiResponse<CreditCardList[]>>('credit-cards')
    return data.data;
  },

  async findById(id: string): Promise<CreditCardForm | null> {
    const { data } = await http.get<ApiResponse<CreditCardForm>>(`credit-cards/${id}`)
    return data.data;
  },
}
