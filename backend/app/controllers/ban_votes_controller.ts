import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import Channel, { ChannelMemberRole, ChannelType } from '#models/channel'
import User from '#models/user'
import BanVote from '#models/ban_vote'
import ws from '#services/ws'
import ChannelMembersController from './channel_members_controller.js'
import is from '@adonisjs/core/helpers/is'

export default class BanVotesController {
  // Apply kick/ban to a userId in channelId
  public async kickMember({ request, response, params, auth }: HttpContext) {
    const currentUser = auth.user! // Kicker...
    const userId = params.userId as string // The one to kick
    const channelId = params.id as string

    if (userId == currentUser.id) {
      return response.badRequest({ message: 'You cannot kick yourself' })
    }

    const tx = await db.transaction()
    try {
      // Validation checks...
      const myMembership = await ChannelMembersController.getMembership(channelId, currentUser.id, tx)
      if (!myMembership) {
        await tx.rollback()
        return response.forbidden({ message: 'You are not in this channel' })
      }

      const targetMembership = await ChannelMembersController.getMembership(channelId, userId, tx)
      if (!targetMembership) {
        await tx.rollback()
        return response.badRequest({ message: 'Cant kick the user that is not in the channel' })
      }

      const channel = await Channel.find(channelId, { client: tx })
      if (!channel) {
        await tx.rollback()
        return response.notFound({ message: 'Channel not found' })
      }

      const isAdmin = myMembership.role == ChannelMemberRole.ADMIN
      const isPrivate = channel.type == ChannelType.PRIVATE
      if (isPrivate) {
        if (isAdmin) {
          await ChannelMembersController.deleteMembership(channelId, userId, tx)

          ws.to(`channel/${channelId}`).emit('member:left', { id: userId })
          ws.to(`@${userId}`).emit('channel:removed', { message: 'You have been kicked by admin', channel: { id: channelId } })

          await tx.commit()
          return response.ok({ message: 'User removed from private channel (admin action)' })
        }

        await tx.rollback()
        return response.forbidden({ message: 'You are not allowed to kick users in private channel' })
      }

      // Add the vote
      await BanVote.create(
        {
          channelId,
          voterId: currentUser.id,
          bannedId: userId,
        },
        { client: tx }
      )

      // If admin, do instant ban
      if (isAdmin) {
        await ChannelMembersController.deleteMembership(channelId, userId, tx)

        ws.to(`channel/${channelId}`).emit('member:left', { id: userId })
        ws.to(`@${userId}`).emit('channel:removed', { message: 'You have been kicked by admin', channel: { id: channelId } })

        await tx.commit()
        return response.ok({ message: 'User kicked by admin', user: { id: userId } })
      }

      // For regular user, check if sufficient bans and remove
      const banned = await BanVote.isBanned(channelId, userId, tx)
      if (banned) {
        await ChannelMembersController.deleteMembership(channelId, userId, tx)

        ws.to(`channel/${channelId}`).emit('member:left', { id: userId })
        ws.to(`@${userId}`).emit('channel:removed', { message: 'You have been voted to be kicked', channel: { id: channelId } })

        await tx.commit()
        return response.ok({ message: 'User kicked by majority',
          user: {
            id: userId,
            voteCount: +banned || 0
          }
        })
      }

      await tx.commit()
      return response.ok({ message: 'Ban vote recorded' })
    }
    catch (err) {
      console.error(err)
      await tx.rollback()
      return response.internalServerError({ message: 'Failed to process kick action' })
    }
  }
}
