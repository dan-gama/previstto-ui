export interface CreditCardForm {
  name: string | null,
  brand: string | null,
  digits: number | null,
  bank: string | null,
  limit: number,
  description: string | null,
  active: boolean
}

export interface CreditCardList {
  id: string;
  name: string,
  brandName: string,
  digits: number,
  active: boolean
}
