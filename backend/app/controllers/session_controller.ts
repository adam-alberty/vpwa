import User from '#models/user'
import { loginUservalidator } from '#validators/session'
import type { HttpContext } from '@adonisjs/core/http'

export default class SessionController {
  // Log in
  public async store({ request }: HttpContext) {
    const data = await request.validateUsing(loginUservalidator)
    const user = await User.verifyCredentials(data.email, data.password)
    const token = await User.accessTokens.create(user)
    return {
      user: user,
      token: token.value!.release(),
    }
  }

  // Log out
  public async destroy({ auth, response }: HttpContext) {
    await auth.use('api').invalidateToken()
    return response.ok({ message: 'Logged out' })
  }
}
