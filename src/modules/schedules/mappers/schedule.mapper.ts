import { CreateScheduleCommand, UpdateScheduleCommand } from "../models/schedule.command";
import { ScheduleForm } from "../models/schedule.model";

export class ScheduleMapper {
  static toCreate(form: ScheduleForm): CreateScheduleCommand {

    return {
      active: form.active,
      amount: form.amount,
      bankAccount: form.bankAccount,
      category: form.category?.value as string,
      description: form.description,
      installments: form.installment,
      person: form.person,
      recurrence: form.recurrence,
      startingOn: form.startingOn,
      tag: form.tag,
      type: form.type
    }
  }

  static toUpdate(form: ScheduleForm): UpdateScheduleCommand {
    return {
      active: form.active,
      amount: form.amount,
      bankAccount: form.bankAccount,
      category: form.category?.value as string,
      description: form.description,
      installments: form.installment,
      person: form.person,
      startingOn: form.startingOn,
      tag: form.tag,
    }
  }
}
