import User, { UserStatus } from '#models/user'
import ws from '#services/ws'
import { registerUserValidator, loginUserValidator, changeStatus } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  // Create session
  public async login({ request }: HttpContext) {
    const data = await request.validateUsing(loginUserValidator)
    const user = await User.verifyCredentials(data.email, data.password)
    if (!user.status) {
      user.status = UserStatus.ONLINE
      await user.save()
    }

    const token = await User.accessTokens.create(user)
    return {
      user: user,
      token: token.value?.release(),
    }
  }

  // Get user from the session token
  public async me({ auth }: HttpContext) {
    return {
      user: auth.user!,
    }
  }

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

  // Destroy session
  public async logout({ auth, response }: HttpContext) {
    await auth.use('api').invalidateToken()

    return response.ok({ message: 'Logged out' })
  }

  /**
   * Delete user
   */
  public async delete({ auth, response }: HttpContext) {
    await auth.user?.delete()
    return response.ok({ message: 'Your account has been deleted successfully' })
  }
}
