import vine from '@vinejs/vine'

/**
 * Validates the user's login action
 */
export const loginUservalidator = vine.compile(
  vine.object({
    email: vine.string().trim(),
    password: vine.string().minLength(8),
  })
)
