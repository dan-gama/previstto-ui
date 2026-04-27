import { CreateBankAccountCommand, UpdateBankAccountCommand } from '../models/bank-account.command';
import { BankAccountForm } from '../models/bank-account.model';

export class BankAccountMapper {
  static toCreate(bankAccountForm: BankAccountForm): CreateBankAccountCommand {
    return bankAccountForm;
  }

  static toUpdate(bankAccountForm: BankAccountForm): UpdateBankAccountCommand {
    return {
      name: bankAccountForm.name,
      accountType: bankAccountForm.accountType,
      active: bankAccountForm.active
    }
  }
}
