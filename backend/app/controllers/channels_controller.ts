import Channel, { ChannelMemberRole, ChannelType } from '#models/channel'
import { createChannelValidator, joinChannelValidator } from '#validators/channel'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class ChannelsController {
  public async create({ request, response, auth }: HttpContext) {
    const user = auth.user!
    const data = await request.validateUsing(createChannelValidator)
    data.name = data.name.replace(/\s+/g, '-')

    // Check if already exists
    const tx = await db.transaction()

    let channel = await Channel.findBy('name', data.name, { client: tx })
    if (channel) {
      await tx.rollback()
      return response.conflict({
        message: 'Channel with this name already exists!',

        channel: {
          id: channel.id,
          type: channel.type,
        },
      })
    }

    channel = await Channel.create(data, { client: tx })
    await channel.related('members').attach(
      {
        [user.id]: {
          role: ChannelMemberRole.ADMIN,
        },
      },
      tx
    )
    await tx.commit()

    return response.created({
      channel,
    })
  }

  public async list({ response, auth }: HttpContext) {
    const user = auth.user!
    const channels = await user.related('channels').query().orderBy('name', 'asc')
    return response.ok({
      channels,
    })
  }

  public async get({ response, params, auth }: HttpContext) {
    const user = auth.user!
    const channelId = params.id as string

    // Channel + membership
    const channel = await Channel.query()
      .where('id', channelId)
      .preload('members', (membersQuery) => {
        membersQuery
          .where('users.id', user.id)
          .pivotColumns(['role', 'joined_at'])
      })
      .first()

    if (!channel || channel.members?.length == 0) {
      return response.forbidden({ message: 'You are not a member of this channel' })
    }

    const membership = channel.members[0].$extras
    return response.ok({
      channel: {
        id: channel.id,
        name: channel.name,
        type: channel.type,
        createdAt: channel.createdAt,
      },
      membership: {
        userId: user.id,
        role: membership.role,
        joinedAt: membership.joined_at,
      }
    })
  }
}
