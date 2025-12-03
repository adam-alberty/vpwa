import vine from '@vinejs/vine'
import { UserStatus } from '#models/user'

/**
 * Validates the user's login action
 */
export const loginUserValidator = vine.compile(
  vine.object({
    email: vine.string().trim().minLength(1).maxLength(254),
    password: vine.string().minLength(8).maxLength(256),
  })
)

/**
 * Validates the user's registration action
 */
export const registerUserValidator = vine.compile(
  vine.object({
    username: vine
      .string()
      .trim()
      .minLength(3)
      .maxLength(32)
      .regex(/^[a-zA-Z0-9._-]+$/),
    email: vine.string().trim().minLength(1).maxLength(254),
    firstName: vine.string().trim().minLength(1).maxLength(128),
    lastName: vine.string().trim().minLength(1).maxLength(128),
    password: vine.string().minLength(8).maxLength(256),
  })
)

export const changeStatus = vine.compile(
  vine.object({
    status: vine.enum([UserStatus.ONLINE, UserStatus.OFFLINE, UserStatus.DND]),
  })
)

/**
 * Validates the user's update action
 */
// export const updateUserValidator = vine.compile(
//   vine.object({
//     username: vine.string().trim().minLength(3),
//     email: vine.string().trim(),
//     firstName: vine.string().trim(),
//     lastName: vine.string().trim(),
//     password: vine.string().minLength(8),
//   })
// )
