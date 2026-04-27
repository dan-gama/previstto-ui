import { BankAccountForm } from "./bank-account.model";

export interface CreateBankAccountCommand extends BankAccountForm { }

export interface UpdateBankAccountCommand {
  name: string | null,
  accountType: string | null,
  active: boolean
}
