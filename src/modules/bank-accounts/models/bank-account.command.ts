import { BankAccountForm } from './bank-account.model';

export type CreateBankAccountCommand = BankAccountForm

export interface UpdateBankAccountCommand {
  name: string | null,
  accountType: string | null,
  active: boolean
}
