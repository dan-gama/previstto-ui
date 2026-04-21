import http from '@/shared/infrastructure/http/http'
import { BankAccountList } from '../models/bank-account-list'
import { ApiResponse } from '@/shared/infrastructure/interfaces/ApiResponse'

const mock: BankAccountList[] = [
  {
    id: '001',
    name: 'C6',
    bankName: 'C6 Bank S.A.',
    accountTypeName : 'Pessoa Física',
    active: true,
  },
  {
    id: '002',
    name: 'Next',
    bankName: 'Next - Banco Digital',
    accountTypeName : 'Pessoa Física',
    active: true,
  },
  {
    id: '003',
    name: 'BB',
    bankName: 'Banco do Brasil',
    accountTypeName : 'Pessoa Física',
    active: true,
  },
]

export const bankAccountService = {
  async findAll(): Promise<BankAccountList[]> {
    const { data } = await http.get<ApiResponse<BankAccountList[]>>('bank-accounts');
    return data.data;
  },

  async findById(id: string): Promise<BankAccountList | null> {
    const item = mock.find((x) => x.id === id) ?? null
    return Promise.resolve(item)
  },

  // async create(payload: Omit<BankAccount, 'id'>): Promise<BankAccount> {
  //   const item: BankAccount = {
  //     id: String(Date.now()),
  //     ...payload,
  //   }

  //   mock.push(item)
  //   return Promise.resolve(item)
  // },

  // async update(id: string, payload: Omit<DomainModel, 'id'>): Promise<DomainModel | null> {
  //   const index = mockDomains.findIndex((x) => x.id === id)

  //   if (index === -1) {
  //     return Promise.resolve(null)
  //   }

  //   mockDomains[index] = {
  //     id,
  //     ...payload,
  //   }

  //   return Promise.resolve(mockDomains[index])
  // },
}
