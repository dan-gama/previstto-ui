import http from '@/shared/infrastructure/http/http';
import { CreatePersonCommand, UpdatePersonCommand } from '../models/person.command';
import { PersonForm, PersonList } from '../models/person.model';
import { ApiResponse } from '@/shared/infrastructure/interfaces/ApiResponse';

const module = 'persons';

export const personService = {
  async create(payload: CreatePersonCommand): Promise<void> {
    await http.post(module, payload);
  },

  async update(id: string, payload: UpdatePersonCommand): Promise<void> {
    await http.patch(`${module}/${id}`, payload);
  },

  async delete(id: string): Promise<void> {
    await http.delete(`${module}/${id}`);
  },

  async findAll(): Promise<PersonList[]> {
    const { data } = await http.get<ApiResponse<PersonList[]>>(module);
    return data.data;
  },

  async findById(id: string): Promise<PersonForm | null> {
    const { data } = await http.get<ApiResponse<PersonForm>>(`${module}/${id}`)
    return data.data;
  },
}
