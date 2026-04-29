import { CreditCardForm } from '../models/credit-card.model';
import { CreateCreditCardCommand, UpdateCreditCardCommand } from '../models/credit-card.command';

export class CreditCardMapper {
  static toCreate(creditCardForm: CreditCardForm): CreateCreditCardCommand {
    return creditCardForm;
  }

  static toUpdate(creditCardForm: CreditCardForm): UpdateCreditCardCommand {
    return creditCardForm;
  }
}
