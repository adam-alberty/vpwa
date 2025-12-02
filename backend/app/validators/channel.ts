import { ChannelType } from '#models/channel'
import vine from '@vinejs/vine'

/**
 * Validates the channel creation action
 */
export const createChannelValidator = vine.compile(
  vine.object({
    name: vine
      .string()
      .trim()
      .transform((v) => v.replace(/\s+/g, '-')),
    type: vine.enum(Object.values(ChannelType)),
  })
)

export const joinChannelValidator = vine.compile(
  vine.object({
    name: vine.string().trim(),
  })
)
