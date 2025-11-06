import Message from '#models/message'
import { createMessageValidator } from '#validators/message'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class MessagesController {
  // Create message in the channel
  public async create({ request, response, auth, params }: HttpContext) {
    const channelId = params.id as string
    const user = auth.user!
    const message = await request.validateUsing(createMessageValidator)

    const isMember = await db
      .from('channel_members')
      .where('channel_id', channelId)
      .andWhere('user_id', user.id)
      .first()

    if (!isMember) {
      return response.forbidden({ error: 'You are not a member of this channel' })
    }
    await Message.create({ channelId, senderId: user.id, content: message.content })
    return response.created(message)
  }

  // Get messages
  public async list({ response, auth, params }: HttpContext) {
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

    const messages = await Message.query()
      .where('channel_id', channelId)
      .orderBy('created_at', 'asc')
      .preload('sender')

    return response.ok({ messages })
  }
}
