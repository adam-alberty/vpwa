import Message from '#models/message'
import ws from '#services/ws'
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

    const createdMessage = await Message.create({
      channelId,
      senderId: user.id,
      content: message.content,
    })
    const newMessage = await Message.query()
      .where('id', createdMessage.id)
      .preload('sender')
      .preload('mentionedUser')
      .firstOrFail() // returns a single object

    // send the message to clients in the channel
    ws.io.to(`channel:${channelId}`).emit('message:new', newMessage)

    return response.created('ok')
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
      .preload('sender')
      .preload('mentionedUser')
      .orderBy('created_at', 'asc')

    return response.ok({ messages })
  }
}
