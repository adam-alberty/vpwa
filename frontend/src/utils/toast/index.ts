import { Notify } from 'quasar'

type Position = "top" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | "bottom" | "left" | "right" | "center"

export function success(msg, timeout = 5000, position: Position = 'top') {
  const message = msg?.message ?? msg ?? 'Success';
  Notify.create({
    message,
    color: 'positive',
    position,
    timeout,
    html: true,
  })
}

export function error(msg, timeout = 5000, position: Position = 'top') {
  var message = '';
  if (msg?.errors) {
    for (const err of msg.errors)
      message += `${err.message}<br>`;
  }
  else
    message = msg?.message ?? msg?.error ?? msg ?? 'Error';

  Notify.create({
    message,
    color: 'negative',
    position,
    timeout,
    html: true,
  })
}

export function info(msg, timeout = 5000, position: Position = 'top') {
  const message = msg?.message ?? msg ?? 'Info';
  Notify.create({
    message,
    color: 'gray',
    position,
    timeout,
    html: true,
  })
}
