import vine from '@vinejs/vine'
import { UserStatus } from '#models/user'

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

export const changeStatus = vine.compile(
  vine.object({
    status: vine.enum([UserStatus.ONLINE, UserStatus.OFFLINE, UserStatus.DND]),
  })
)

/**
 * Validates the user's update action
 */
export const updateUserValidator = vine.compile(
  vine.object({
    username: vine.string().trim().minLength(3),
    email: vine.string().trim(),
    firstName: vine.string().trim(),
    lastName: vine.string().trim(),
    password: vine.string().minLength(8),
  })
)
