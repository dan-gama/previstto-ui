import { parseInputToDate } from "@/shared/utils/date.utils";
import { CreateScheduleCommand, UpdateScheduleCommand } from "../models/schedule.command";
import { ScheduleForm } from "../models/schedule.model";

export class ScheduleMapper {
  static toCreate(form: ScheduleForm): CreateScheduleCommand {
    return {
      active: form.active,
      amount: form.amount,
      bankAccount: form.bankAccount,
      category: form.category as string,
      description: form.description,
      installments: form.installment,
      person: form.person,
      recurrence: form.recurrence,
      startingOn: parseInputToDate(form.startingOn),
      tag: form.tag,
      type: form.type
    }
  }

  static toUpdate(form: ScheduleForm): UpdateScheduleCommand {
    console.log(form.category);

    return {
      active: form.active,
      amount: form.amount,
      bankAccount: form.bankAccount,
      category: form.category as string,
      description: form.description,
      installments: form.installment,
      person: form.person,
      startingOn: parseInputToDate(form.startingOn),
      tag: form.tag,
    }
  }
}
