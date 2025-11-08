import { Notify } from 'quasar'

type Position = "top" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | "bottom" | "left" | "right" | "center"

export function success(message, timeout = 5000, position: Position = 'top') {
  Notify.create({
    message: message ?? message?.message ?? 'Success',
    color: 'positive',
    position,
    timeout,
  })
}

export function error(message, timeout = 5000, position: Position = 'top') {
  Notify.create({
    message: message ?? message?.message ?? 'Error',
    color: 'negative',
    position,
    timeout,
  })
}
