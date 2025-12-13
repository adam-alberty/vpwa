import User, { UserStatus } from '#models/user'
import ws from '#services/ws'
import { registerUserValidator, loginUserValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  /**
   * Creates user session
   */
  public async login({ request }: HttpContext) {
    const data = await request.validateUsing(loginUserValidator)
    const user = await User.verifyCredentials(data.email, data.password)
    if (!user.status) {
      user.status = UserStatus.ONLINE
      await user.save()
    }

    const token = await User.accessTokens.create(user)
    return {
      token: token.value?.release(),
    }
  }

  /**
   * Gets user from the session token
   */
  public async me({ auth }: HttpContext) {
    return {
      user: auth.user!,
    }
  }

  /**
   * Registers new user
   */
  public async register({ request, response }: HttpContext) {
    const data = await request.validateUsing(registerUserValidator)
    try {
      await User.create(data)
      return response.created({ success: true })
    } catch (err) {
      if (err?.code == 23505) return response.conflict({ message: 'This user already exists' })
      return response.badRequest({ message: 'Something went wrong, request was likely invalid' })
    }
  }

  /**
   * Destroys session
   */
  public async logout({ auth, response }: HttpContext) {
    const invalidated = await auth.use('api').invalidateToken()
    if (!invalidated)
      return response.badRequest({ message: 'Cannot invalidate token' })

    ws.userSockets(auth.user!.id).then((sockets) => sockets.forEach(s => s.disconnect())) // Disconnect all sockets
    return response.ok({ message: 'You have been logged out successfully' })
  }

  /**
   * Deletes user
   */
  public async delete({ auth, response }: HttpContext) {
    await auth.user?.delete()
    return response.ok({ message: 'Your account has been deleted successfully' })
  }
}
