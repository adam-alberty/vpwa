import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class ChannelMembersController {
  public async get({ response, auth, params }: HttpContext) {
    const channelId = params.id as string
    const user = auth.user!

    const isMember = await db
      .from('channel_members')
      .where('channel_id', channelId)
      .andWhere('user_id', user.id)
      .first()

    if (!isMember) {
      return response.forbidden({ error: 'You are not a member of this channel' })
    }

    const members = await db
      .from('channel_members')
      .where('channel_id', channelId)
      .join('users', 'channel_members.user_id', '=', 'users.id')
      .orderBy('created_at', 'asc')
      .select(
        'users.id as id',
        'users.username as username',
        'users.first_name as firstName',
        'users.last_name as lastName',
        'users.email as email',
        'users.status as status',
        'channel_members.role as role'
      )

    return response.ok({ members })
  }
}
