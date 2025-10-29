import User from '#models/user'
import { registerUserValidator, updateUserValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  /**
   * Registers new user
   */
  public async store({ request, response }: HttpContext) {
    // Validate data
    const data = await request.validateUsing(registerUserValidator)

    // Create user
    const user = await User.create(data)

    // Create session token
    const token = await User.accessTokens.create(user)

    // Return user & token
    return response.created({
      user: user,
      token: token.value!.release(),
    })
  }

  /**
   * Update user
   */
  public async update({ auth, request, response }: HttpContext) {
    // Validate data
    const data = await request.validateUsing(updateUserValidator)

    auth.user?.merge(data)
    await auth.user?.save()

    return response.ok({
      message: 'Profile updated successfully',
      user: auth.user,
    })
  }

  /**
   * Delete user
   */
  public async destroy({ auth, response }: HttpContext) {
    await auth.user?.delete()
    return response.ok({
      message: 'Your account has been deleted successfully',
    })
  }
}
