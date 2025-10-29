import vine from '@vinejs/vine'

/**
 * Validates the user's registration action
 */
export const registerUserValidator = vine.compile(
  vine.object({
    username: vine.string().trim().minLength(3),
    email: vine.string().trim(),
    firstName: vine.string().trim(),
    lastName: vine.string().trim(),
    password: vine.string().minLength(8),
  })
)
