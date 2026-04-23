import http from '@/shared/infrastructure/http/http'
import { BankAccountList } from '../models/bank-account-list'
import { ApiResponse } from '@/shared/infrastructure/interfaces/ApiResponse'
import { BankAccountForm } from '../models/bank-account-form'
import { SelectOptions } from '@/shared/dtos/select-options'
import { BankDomain, AccountTypeDomain } from '../models/bank-account-domains'

const mock: BankAccountList[] = [
  {
    id: '001',
    name: 'C6',
    bankName: 'C6 Bank S.A.',
    accountTypeName: 'Pessoa Física',
    active: true,
  },
  {
    id: '002',
    name: 'Next',
    bankName: 'Next - Banco Digital',
    accountTypeName: 'Pessoa Física',
    active: true,
  },
  {
    id: '003',
    name: 'BB',
    bankName: 'Banco do Brasil',
    accountTypeName: 'Pessoa Física',
    active: true,
  },
]

export const bankAccountService = {
  async create(payload: BankAccountForm): Promise<void> {
    await http.post('bank-accounts', payload);
  },

  async findAll(): Promise<BankAccountList[]> {
    const { data } = await http.get<ApiResponse<BankAccountList[]>>('bank-accounts');
    return data.data;
  },

  async findById(id: string): Promise<BankAccountList | null> {
    const item = mock.find((x) => x.id === id) ?? null
    return Promise.resolve(item)
  },

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
