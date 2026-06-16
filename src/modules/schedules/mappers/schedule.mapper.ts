import { parseInputToDate } from "@/shared/utils/date.utils";
import { CreateScheduleCommand, UpdateScheduleCommand } from "../models/schedule.command";
import { ScheduleForm } from "../models/schedule.model";

export class ScheduleMapper {
  static toCreate(form: ScheduleForm): CreateScheduleCommand {
    const sourceId = (form.type === 'expense') ? form.creditBank : form.category;
    const destinationId = (form.type === 'expense') ? form.category : form.creditBank;

    return {
      active: form.active,
      amount: form.amount,
      sourceId: sourceId ?? '',
      destinationId: destinationId ?? '',
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
    const sourceId = (form.type === 'expense') ? form.creditBank : form.category;
    const destinationId = (form.type === 'expense') ? form.category : form.creditBank;

    return {
      active: form.active,
      amount: form.amount,
      sourceId: sourceId ?? '',
      destinationId: destinationId ?? '',
      description: form.description,
      installments: form.installment,
      person: form.person,
      startingOn: parseInputToDate(form.startingOn),
      tag: form.tag,
    }
  }
}
