import type { DomainModel } from '../models/domain.model'

const mockDomains: DomainModel[] = [
  {
    id: '1',
    type: 'CATEGORY',
    name: 'Alimentação',
    description: 'Categoria para gastos com alimentação',
    active: true,
  },
  {
    id: '2',
    type: 'BANK',
    name: 'Banco do Brasil',
    description: 'Instituição bancária',
    active: true,
  },
  {
    id: '3',
    type: 'CREDIT_CARD',
    name: 'Cartão Nubank',
    description: 'Cartão de crédito principal',
    active: true,
  },
]

export const domainService = {
  async findAll(): Promise<DomainModel[]> {
    return Promise.resolve([...mockDomains])
  },

  async findById(id: string): Promise<DomainModel | null> {
    const item = mockDomains.find((x) => x.id === id) ?? null
    return Promise.resolve(item)
  },

  async create(payload: Omit<DomainModel, 'id'>): Promise<DomainModel> {
    const item: DomainModel = {
      id: String(Date.now()),
      ...payload,
    }

    mockDomains.push(item)
    return Promise.resolve(item)
  },

  async update(id: string, payload: Omit<DomainModel, 'id'>): Promise<DomainModel | null> {
    const index = mockDomains.findIndex((x) => x.id === id)

    if (index === -1) {
      return Promise.resolve(null)
    }

    mockDomains[index] = {
      id,
      ...payload,
    }

    return Promise.resolve(mockDomains[index])
  },
}
