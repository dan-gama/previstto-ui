import { CreatePersonCommand, UpdatePersonCommand } from '../models/person.command';
import { PersonForm } from '../models/person.model';

export class PersonMapper {
  static toCreate(personForm: PersonForm): CreatePersonCommand {
    return personForm;
  }

  static toUpdate(personForm: PersonForm): UpdatePersonCommand {
    return personForm;
  }
}
