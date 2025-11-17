import Message from '#models/message'
import { UserStatus } from '#models/user'
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
      return response.forbidden({ message: 'You are not a member of this channel' })
    }

    const createdMessage = await Message.create({
      channelId,
      senderId: user.id,
      content: message.content,
    })
    const newMessage = await Message.query()
      .where('id', createdMessage.id)
      .preload('sender')
      .firstOrFail()

    // send the message to clients in the channel
    // console.log('Emitting to channel/' + channelId)
    ws.to(`channel/${channelId}`).emit('message:new', newMessage)

    return response.created({ message: "Sent successfully" })
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
      return response.forbidden({ message: 'You are not a member of this channel' })
    }

    var messages = await Message.query()
      .where('channel_id', channelId)
      .preload('sender', (senderQuery) => {
        senderQuery
          .select([
            'id',
            'username',
            'first_name',
            'last_name',
            'status',
            'email',
          ])
          .withAggregate('channels', (memberQuery) => {
            memberQuery
              .where('channel_members.channel_id', channelId)
              .count('*')
              .as('is_member')
          })
      })
      .orderBy('created_at', 'asc')

    const serialized = messages.map((m) => {
      const msg = m.serialize()
      msg.sender.status ??= UserStatus.OFFLINE

      if (m.sender.$extras.is_member == 0) {
        msg.sender.status = null
      }
      return msg
    })
    return response.ok({ messages: serialized })
  }
}
