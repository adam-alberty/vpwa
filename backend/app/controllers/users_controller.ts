import User from '#models/user'
import { registerUserValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  // Registers user
  public async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(registerUserValidator)
    const user = await User.create(data)
    const token = await User.accessTokens.create(user)
    return response.created({
      user: user,
      token: token.value!.release(),
    })
  }
}
