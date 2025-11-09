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
    let channel = await Channel.query({ client: tx })
      .where('name', data.name)
      .first()

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

  public async join({ request, response, auth }: HttpContext) {
    const user = auth.user!
    const data = await request.validateUsing(joinChannelValidator)
    data.name = data.name.replace(/\s+/g, '-')

    const tx = await db.transaction()

    // Get channel
    const channel = await Channel.query({ client: tx })
      .where('name', data.name)
      .first()

    if (!channel) {
      await tx.rollback()
      throw new Error(`Channel "${data.name}" not found!`)
    }

    const membership = await tx
      .from('channel_members')
      .where('channel_id', channel.id)
      .andWhere('user_id', user.id)
      .first()

    if (membership) { // Check if user is already a member
      await tx.rollback()
      return response.conflict({ message: 'You are already a member of this channel!' })
    }

    if (channel.type == ChannelType.PRIVATE) {
      await tx.rollback()
      return response.forbidden({ message: 'This channel is private. Ask for invite!' })
    }

    await channel.related('members').attach(
      {
        [user.id]: {
          role: ChannelMemberRole.ADMIN,
        },
      },
      tx
    )

    await tx.commit()

    // TODO return to FE
    return response.created({
      message: `Joined channel successfully`,
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
      channel: { id: channelId },
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
