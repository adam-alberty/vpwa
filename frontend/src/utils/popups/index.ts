import { Dialog } from 'quasar'

export function confirm(message: string, title = 'Confirm', okText = 'Yes', cancelText = 'Cancel') {
  return Dialog.create({
    title,
    message,
    ok: { label: okText, color: 'primary' },
    cancel: { label: cancelText, color: 'primary', flat: true },
  })
}

export function confirmDanger(message: string, title = 'Confirm', okText = 'Yes', cancelText = 'Cancel') {
  return Dialog.create({
    title,
    message,
    ok: { label: okText, color: 'negative' },
    cancel: { label: cancelText, color: 'primary', flat: true  },
  })
}

export function alert(message: string, title = 'Alert', okText = 'Ok') {
  return Dialog.create({
    title,
    message,
    persistent: true,
    ok: { label: okText, color: 'primary', flat: true  },
  })
}
