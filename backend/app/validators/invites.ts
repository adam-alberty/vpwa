import { ChannelType } from '#models/channel'
import vine from '@vinejs/vine'

export const inviteUserValidator = vine.compile(
  vine.object({
    username: vine.string().trim().minLength(3),
  })
)
