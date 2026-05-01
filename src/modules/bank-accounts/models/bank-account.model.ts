export interface BankAccountForm {
  bank: string | null;
  accountType: string | null;
  name: string | null;
  balance: number;
  active: boolean;
}

export interface BankAccountList {
  id: string;
  name: string;
  bankName: string;
  accountTypeName: string;
  active: boolean;
}
