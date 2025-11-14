import User from '#models/user'
import ws from '#services/ws'
import { loginUservalidator } from '#validators/session'
import type { HttpContext } from '@adonisjs/core/http'
import { UserStatus } from '#models/user'

export default class SessionController {
  // Create session
  public async login({ request }: HttpContext) {
    const data = await request.validateUsing(loginUservalidator)
    const user = await User.verifyCredentials(data.email, data.password)
    if (!user.status) { // Null initially
      user.status = UserStatus.ONLINE
      await user.save()
    }
    if (user.status != UserStatus.OFFLINE)
      ws.io.emit(`user:${user.id}:status`, { status: user.status })

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

  // Destroy session
  public async delete({ auth, response }: HttpContext) {
    const user = auth.user!
    if (user.status != UserStatus.OFFLINE)
      ws.io.emit(`user:${user.id}:status`, { status: UserStatus.OFFLINE })
    await auth.use('api').invalidateToken()

    return response.ok({ message: 'Logged out' })
  }
}
