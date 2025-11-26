import User, { UserStatus } from '#models/user'
import ws from '#services/ws'
import { registerUserValidator, updateUserValidator, changeStatus } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  /**
   * Registers new user
   */
  public async register({ request, response }: HttpContext) {
    // Validate data
    try {
      const data = await request.validateUsing(registerUserValidator)

      const user = await User.create(data)

      // const token = await auth.use('api').createToken(user)

      return response.created({
        user: user,
        // token: token.value?.release()
      })
    }
    catch (err) {
      if (err?.code == 23505)
        return response.conflict({ message: 'This user already exists' })
      return response.badRequest({ message: 'Something went wrong, request was likely invalid' })
    }
  }

  public async changeStatus({ auth, request, response }: HttpContext) {
    const { status } = await request.validateUsing(changeStatus)

    const user = auth.user!
    user.status = status as UserStatus
    await user.save()

    ws.io.emit(`user:${user.id}:status`, { status: user.status })

    return response.ok({
      message: 'Status updated successfully',
      user: {
        // id: user.id,
        status: user.status,
      },
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
  public async delete({ auth, response }: HttpContext) {
    await auth.user?.delete()
    return response.ok({ message: 'Your account has been deleted successfully' })
  }
}
