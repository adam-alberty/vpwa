import type { HttpContext } from '@adonisjs/core/http'

export default class ChannelsController {
  public async create({ request, response, auth }: HttpContext) {
    const data = request.only(['email', 'password'])

    // return response.created(user)
  }

  public async leave({ request, response, auth }: HttpContext) {
    const data = request.only(['email', 'password'])

    // return response.created(user)
  }
}
