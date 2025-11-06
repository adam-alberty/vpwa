import Channel, { ChannelMemberRole } from '#models/channel'
import { createChannelValidator } from '#validators/channel'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class ChannelsController {
  public async create({ request, response, auth }: HttpContext) {
    const user = auth.user!
    const data = await request.validateUsing(createChannelValidator)

    const tx = await db.transaction()
    const channel = await Channel.create(data, { client: tx })
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

  public async leave({ response, auth, params }: HttpContext) {
    const user = auth.user!
    const channelId = params.id as string

    const tx = await db.transaction()

    const membership = await tx
      .from('channel_members')
      .where('channel_id', channelId)
      .andWhere('user_id', user.id)
      .first()

    if (!membership) {
      throw new Error('You are not a member of this channel')
    }
    if (membership.role === ChannelMemberRole.ADMIN) {
      await tx.from('channels').where('id', channelId).delete()
    } else {
      await tx
        .from('channel_members')
        .where('channel_id', channelId)
        .andWhere('user_id', user.id)
        .delete()
    }

    await tx.commit()

    return response.ok({
      message: 'Channel left successfully',
    })
  }

  public async list({ response, auth }: HttpContext) {
    const user = auth.user!
    const channels = await user.related('channels').query().orderBy('name', 'asc')
    return response.ok({
      channels: channels,
    })
  }

  public async get({ response, params, auth }: HttpContext) {
    const user = auth.user!
    const channelId = params.id as string

    const channel = await db
      .query()
      .from('channels')
      .join('channel_members', 'channels.id', '=', 'channel_members.channel_id')
      .where('channel_members.user_id', user.id)
      .andWhere('channels.id', channelId)
      .first()

    if (!channel) {
      throw new Error('You are not a member of this channel')
    }

    return response.ok({
      channel,
    })
  }
}
