import Message from '#models/message'
import { UserStatus } from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import ChannelMembersController from './channel_members_controller.js'
import db from '@adonisjs/lucid/services/db'

export default class MessagesController {
  /**
   * Gets messages in the channel
   */
  public async list({ request, response, auth, params }: HttpContext) {
    const channelId = params.id as string
    const user = auth.user!

    const membership = ChannelMembersController.getMembership(channelId, user.id)
    if (!membership) {
      return response.forbidden({ message: 'You are not a member of this channel' })
    }

    const page = request.input('page', 1)
    const limit = request.input('limit', 20)

    var messagePages = await Message.query()
      .where('channel_id', channelId)
      .preload('sender', (senderQuery) => {
        senderQuery
          .select(
            'id',
            'username',
            'first_name',
            'last_name',
            'email',
            db.raw(`
              CASE WHEN EXISTS (
                  SELECT 1
                  FROM auth_access_tokens
                  WHERE tokenable_id = users.id
                    AND expires_at > NOW()
                )
                THEN status
                ELSE '${UserStatus.OFFLINE}'
              END as status
            `)
          )
          .withAggregate('channels', (memberQuery) => {
            memberQuery.where('channel_members.channel_id', channelId).count('*').as('is_member')
          })
      })
      .orderBy('created_at', 'desc')
      .paginate(page, limit)

    const messagePage = messagePages.all()
    const messages = []

    for (let i = messagePage.length - 1; i >= 0; i--) {
      const m = messagePage[i]
      const msg = m.serialize()
      msg.sender.status ??= UserStatus.OFFLINE

      if (m.sender.$extras.is_member == 0) {
        msg.sender.status = null
      }
      messages.push(msg)
    }

    const meta = {
      currentPage: messagePages.currentPage,
      nextPage: messagePages.hasMorePages ? messagePages.currentPage + 1 : null,
    }
    return response.ok({ messages, meta })
  }
}
