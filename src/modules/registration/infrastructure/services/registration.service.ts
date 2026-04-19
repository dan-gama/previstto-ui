import { AxiosInstance } from 'axios';
import http from 'src/shared/infrastructure/http/https';
import { ApiResponse } from 'src/shared/infrastructure/interfaces/ApiResponse';

export class RegisterService {
  private readonly api: AxiosInstance

  constructor() {
    this.api = http;
    this.api.defaults.baseURL = 'http://localhost:3000/users';
  }

  async checkProfile(profile: string): Promise<boolean> {
    try {
      const response = await this.api.get<ApiResponse<boolean>>(`/check-profilse/${ profile }`, { showErrorNotify: true });
      const result = response.data;

      return result.data;

    } catch (error) {
      console.error('Erro ao verificar o perfil: ', error);
      throw new Error('Não foi possível verificar se a conta já existe.');
    }
  }
}
