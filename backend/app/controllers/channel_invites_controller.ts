import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import Channel, { ChannelMemberRole, ChannelType } from '#models/channel'
import User from '#models/user'
import ws from '#services/ws'
import ChannelInvite from '#models/channel_invite'
import ChannelMembersController from './channel_members_controller.js'
import BanVote from '#models/ban_vote'
import { inviteUserValidator } from '#validators/invites'

export default class ChannelInvitesController {
  // Get users invites for the channel
  public async list({ response, params, auth }: HttpContext) {
    // const channelId = params.id as string
    const user = auth.user!

    // const membership = await ChannelMembersController.getMembership(channelId, user.id)
    // if (!membership) {
    //   return response.forbidden({ message: 'You are not a member of this channel' })
    // }

    const invites = await ChannelInvite.query()
      // .where('channelId', channelId)
      .andWhere('userId', user.id)
      .preload('channel', (query) => {
        query.select(['id', 'name', 'type'])
      })
      .orderBy('created_at', 'desc')

    const serialized = invites.map((invite) => ({
      id: invite.id,
      channelId: invite.channelId,
      name: invite.channel.name,
      type: invite.channel.type,
    }))

    return response.ok({ invites: serialized })
  }

  // Invite user to the channel
  public async invite({ request, response, auth, params }: HttpContext) {
    const currentUser = auth.user!
    const channelId = params.id as string
    const data = await request.validateUsing(inviteUserValidator)

    const tx = await db.transaction()
    try {
      // Validation checks...
      const myMembership = await ChannelMembersController.getMembership(channelId, currentUser.id, tx)
      if (!myMembership) {
        await tx.rollback()
        return response.forbidden({ message: 'You are not in this channel' })
      }

      const user = await User.findBy('username', data.username, { client: tx }) // User to invite
      if (!user) {
        await tx.rollback()
        return response.notFound({ message: 'User to invite not found' })
      }

      const userId = user.id
      if (userId == currentUser.id) {
        await tx.rollback()
        return response.badRequest({ message: 'You cannot invite yourself' })
      }

      const targetMembership = await ChannelMembersController.getMembership(channelId, userId, tx)
      if (targetMembership) {
        await tx.rollback()
        return response.conflict({ message: 'User is already in the channel, no need to invite' })
      }

      const channel = await Channel.find(channelId, { client: tx })
      if (!channel) {
        await tx.rollback()
        return response.notFound({ message: 'Channel not found' })
      }

      const existingInvite = await ChannelInvite.query({ client: tx })
        .where('channelId', channelId)
        .andWhere('userId', userId)
        .first()

      if (existingInvite) {
        await tx.rollback()
        return response.conflict({ message: 'User is already invited' })
      }

      const isAdmin = myMembership.role == ChannelMemberRole.ADMIN
      if (isAdmin) { // Admin can always invite
        const invite = await ChannelInvite.create({ channelId, userId }, { client: tx })

        ws.to(`@${userId}`).emit('invite:new', {
          id: invite.id,
          channelId,
          name: channel.name,
          type: channel.type,
        })

        await tx.commit()
        return response.created({
          message: 'User invited successfully',
          invite: {
            id: invite.id,
            // channelId,
            // name: channel.name,
            // type: channel.type,
          },
        })
      }

      const isPrivate = channel.type == ChannelType.PRIVATE
      if (isPrivate) {
        await tx.rollback()
        return response.forbidden({ message: 'You are not allowed to invite in private channel' })
      }
      // public

      const banned = await BanVote.isBanned(channelId, userId, tx)
      if (banned) {
        await tx.rollback()
        return response.forbidden({ message: 'You are not allowed to invite this user' })
      }

      const invite = await ChannelInvite.create({ channelId, userId }, { client: tx })

      ws.to(`@${userId}`).emit('invite:new', {
        id: invite.id,
        channelId,
        name: channel.name,
        type: channel.type,
      })

      await tx.commit()
      return response.created({
        message: 'User invited successfully',
        invite: {
          id: invite.id,
          // channelId,
          // name: channel.name,
          // type: channel.type,
        },
      })
    }
    catch (err) {
      console.error(err)
      await tx.rollback()
      return response.internalServerError({ message: 'Failed to process invite action' })
    }
  }

  // The user accepts invite
  public async acceptInvite({ request, response, auth, params }: HttpContext) {
    const user = auth.user!
    const channelId = params.id as string

    const tx = await db.transaction()

    const invite = await ChannelInvite.query({ client: tx })
      .where('channelId', channelId)
      .andWhere('userId', user.id)
      .first()

    if (!invite) {
      await tx.rollback()
      return response.notFound({ message: 'Invite not found' })
    }

    // Remove all bans of this user
    await BanVote.query({ client: tx })
      .where('channelId', channelId)
      .andWhere('bannedId', user.id)
      .delete()

    const channel = await Channel.find(channelId, { client: tx })
    if (!channel) {
      await tx.rollback()
      return response.notFound({ message: 'Channel not found' })
    }

    // Add user to channel
    const role = {
      role: ChannelMemberRole.MEMBER,
    }
    await channel.related('members').attach(
      {
        [user.id]: role
      },
      tx
    )

    await invite.delete()
    await tx.commit()

    ws.to(`channel/${channel.id}`).emit('member:joined', { ...user.serialize(), ...role })

    return response.created({
      message: `Accepted invite to channel successfully`,
      channel,
      invite: { id: invite.id },
    })
  }

  // The user rejects invite
  public async rejectInvite({ request, response, auth, params }: HttpContext) {
    const user = auth.user!
    const channelId = params.id as string

    const invite = await ChannelInvite.query()
      .where('channelId', channelId)
      .andWhere('userId', user.id)
      .first()

    if (!invite) {
      return response.notFound({ message: 'Invite not found' })
    }

    await invite.delete()
    return response.ok({ message: 'Invite rejected successfully', invite: { id: invite.id } })
  }
}
