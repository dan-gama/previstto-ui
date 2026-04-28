export interface CreditCardForm {
  name: string,
  brand: string,
  digits: number,
  bank: string | null,
  limit: number | null,
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
