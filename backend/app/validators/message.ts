import vine from '@vinejs/vine'

/**
 * Validates the user's message creation action
 */
export const createMessageValidator = vine.compile(
  vine.object({
    content: vine.string().trim().minLength(1),
  })
)
