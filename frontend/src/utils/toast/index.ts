import { Notify } from 'quasar'

type Position = "top" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | "bottom" | "left" | "right" | "center"

export function success(message, timeout = 5000, position: Position = 'top') {
  Notify.create({
    message: message ?? message?.message ?? 'Success',
    color: 'positive',
    position,
    timeout,
    html: true,
  })
}

export function error(message, timeout = 5000, position: Position = 'top') {
  Notify.create({
    message: message ?? message?.message ?? 'Error',
    color: 'negative',
    position,
    timeout,
    html: true,
  })
}

export function info(message, timeout = 5000, position: Position = 'top') {
  Notify.create({
    message: message ?? message?.message ?? 'Info',
    color: 'gray',
    position,
    timeout,
    html: true,
  })
}
