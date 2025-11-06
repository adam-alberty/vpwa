import Message from '#models/message'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class ChannelMembersController {
  // Get messages
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
      .query()
      .from('channel_members')
      .where('channel_id', channelId)
      .join('users', 'channel_members.user_id', '=', 'users.id')
      .orderBy('created_at', 'asc')
      .select('username', 'role', 'status', 'user_id')

    return response.ok({ members })
  }
}
