import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import Channel, { ChannelMemberRole, ChannelType } from '#models/channel'
import { createChannelValidator, joinChannelValidator } from '#validators/channel'
import ws from '#services/ws'
import { TransactionClientContract } from '@adonisjs/lucid/types/database'

export default class ChannelMembersController {
  public async get({ response, auth, params }: HttpContext) {
    const channelId = params.id as string
    const user = auth.user!

    const membership = await ChannelMembersController.getMembership(channelId, user.id)
    if (!membership) {
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

    const membership = await ChannelMembersController.getMembership(channel.id, user.id, tx)
    if (membership) { // Check if user is already a member
      await tx.rollback()
      return response.conflict({ message: 'You are already a member of this channel!' })
    }

    if (channel.type == ChannelType.PRIVATE) {
      await tx.rollback()
      return response.forbidden({ message: 'This channel is private. Ask for invite!' })
    }

    const role = {
      role: ChannelMemberRole.MEMBER,
    }
    await channel.related('members').attach(
      {
        [user.id]: role
      },
      tx
    )

    await tx.commit()

    ws.io.to(`channel/${channel.id}`).emit('member:joined', { ...user.serialize(), ...role })

    return response.created({
      message: `Joined channel successfully`,
      channel,
    })
  }

  public async leave({ response, auth, params }: HttpContext) {
    const user = auth.user!
    const channelId = params.id as string

    const tx = await db.transaction()

    const membership = await ChannelMembersController.getMembership(channelId, user.id, tx)
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

    ws.io.to(`channel/${channelId}`).emit('member:left', { id: user.id })

    return response.ok({
      channel: { id: channelId },
    })
  }

  // Returns membership if the user is a member of channel
  public static getMembership(channelId: string, userId: string, tx?: TransactionClientContract) {
    return (tx ?? db)
      .from('channel_members')
      .where('channel_id', channelId)
      .andWhere('user_id', userId)
      .first()
  }
}
