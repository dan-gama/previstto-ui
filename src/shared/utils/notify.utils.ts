import { Dialog, Notify } from 'quasar';

export const notify = {
  success(message: string): void {
    Notify.create({
      type: 'positive',
      message,
      position: 'bottom',
      timeout: 2500,
    })
  },

  error(message: string): void {
    Notify.create({
      type: 'negative',
      message,
      position: 'bottom',
      timeout: 3500,
    })
  },

  warning(message: string): void {
    Notify.create({
      type: 'warning',
      message,
      position: 'bottom',
      timeout: 3000,
    })
  },

  info(message: string): void {
    Notify.create({
      type: 'info',
      message,
      position: 'bottom',
      timeout: 2500,
    })
  },

  dialogError(message: string): void {
    Dialog.create({
      title: 'Atenção',
      message,
      ok: 'Fechar',
    });
  }
}
