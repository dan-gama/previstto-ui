export type ValidationRule = (val: any) => boolean | string;

export const SharedRules = {
  required: (msg = 'Campo obrigatório'): ValidationRule =>
    (val: unknown) => (val !== null && val !== undefined && val !== '') || msg,

  email: (msg = 'E-mail inválido'): ValidationRule =>
    (val: string) => /.+@.+\..+/.test(val) || msg,

  dateIfNotEmpty: (msg = 'Data inválida'): ValidationRule =>
    (val: string | null | undefined) => {
      // 1. Se estiver vazio, passa (use 'required' separadamente se for obrigatório)
      if (!val || val.trim() === '') return true;

      // 2. Verifica o formato DD/MM/YYYY via Regex (garante que não aceite apenas "2")
      const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
      const match = val.match(regex);
      if (!match) return msg;

      // 3. Validação lógica (Dias, Meses e Anos Bissextos)
      const day = parseInt(match[1], 10);
      const month = parseInt(match[2], 10);
      const year = parseInt(match[3], 10);

      // O mês no JS Date começa em 0 (Janeiro = 0)
      const date = new Date(year, month - 1, day);

      // Se o JS "corrigir" a data (ex: 31/04 vira 01/05), a data é inválida
      const isValid = date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day;

      // 4. Opcional: Impedir datas no futuro ou anos irreais (ex: antes de 1900)
      const currentYear = new Date().getFullYear();
      if (year < 1900 || year > currentYear + 10) return 'Ano inválido';

      return isValid || msg;
    },
  ageMin: (minAge = 18, msg = 'É necessário ter pelo menos 18 anos'): ValidationRule =>
    (val: string) => {
    // Se o campo estiver vazio, não valida aqui.

    // Converte a string no formato DD/MM/YYYY em números
    const [day, month, year] = val.split('/').map(Number);

    const birthDate = new Date(year, month - 1, day);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    // Calcula a diferença entre os meses
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Ajusta a idade se a pessoa ainda não fez aniversário no ano atual
    if (
      monthDiff < 0 || // ainda não chegou no mês do aniversário
      (monthDiff === 0 && today.getDate() < birthDate.getDate()) // chegou no mês, mas não no dia
    ) {
      age--;
    }

    // Caso contrário, retorna a mensagem de erro
    return age >= minAge || msg;
  }
}
