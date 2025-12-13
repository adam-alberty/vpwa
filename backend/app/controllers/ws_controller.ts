import ws from '#services/ws'
import User, { UserStatus } from '#models/user'
import { WsContext } from '#services/ws'
import ChannelMembersController from './channel_members_controller.js'
import { createMessageValidator } from '#validators/message'
import { changeStatus } from '#validators/user'
import Message from '#models/message'
import db from '@adonisjs/lucid/services/db'
import { messages } from '@vinejs/vine/defaults'

class WsController {
  public connected({ socket }: WsContext) {
    socket.join(`@${socket.data.userId}`)

    const userId = socket.data.userId
    if (userId) {
      ws.userSockets(userId).then(async (sockets) => {
        if (sockets.length == 1) {
          // Send status on first connection
          const user = await User.find(userId).catch(() => null)
          if (user && user.status != UserStatus.OFFLINE)
            ws.io.emit(`user:${user.id}:status`, { status: user.status })
        }
      })
    }

    console.log(`[WS] ${socket.id} connected`)
  }

  public joinChannelRoom({ socket, data /*channelId*/ }: WsContext) {
    const membership = ChannelMembersController.getMembership(data, socket.data.userId)
    if (!membership) {
      return console.error(`[WS] Invalid token for this channel room`)
    }

    socket.join(`channel/${data}`)
    console.log(`[WS] ${socket.id} joined channel/${data}`)
  }

  public leaveChannelRoom({ socket, data /*channelId*/ }: WsContext) {
    socket.leave(`channel/${data}`)
    console.log(`[WS] ${socket.id} left channel/${data}`)
  }

  public joinChannelNotifRooms({ socket, data /*channelId*/ }: WsContext) {
    const membership = ChannelMembersController.getMembership(data, socket.data.userId)
    if (!membership) {
      return console.error(`[WS] Invalid token for this channel notification room`)
    }

    socket.join(`channel/${data}/notification`)
    // console.log(`[WS] ${socket.id} joined channel/${data}/notification`)
  }

  public leaveChannelNotifRooms({ socket, data /*channelId*/ }: WsContext) {
    socket.leave(`channel/${data}/notification`)
    // console.log(`[WS] ${socket.id} left channel/${data}/notification`)
  }

  public userIsTyping({ socket, data }: WsContext) {
    socket.broadcast.to(`channel/${data.channelId}`).emit(`@${socket.data.userId}:typing`, data?.typing?.trim())
  }

  public disconnect({ socket }: WsContext) {
    socket.leave(`@${socket.data.userId}`)

    const disconnectUserId = socket.data.userId
    if (disconnectUserId) {
      ws.userSockets(disconnectUserId).then(async (sockets) => {
        if (!sockets.length) {
          // Handle offline on last disconnect
          const user = await User.find(disconnectUserId).catch(() => null)
          if (user && user.status != UserStatus.OFFLINE)
            ws.io.emit(`user:${user.id}:status`, { status: UserStatus.OFFLINE })
        }
      })
    }

    console.log(`[WS] ${socket.id} disconnected`)
  }

  /**
   * Creates message in the channel
   */
  public async createMessage({ socket, data }: WsContext) {
    const channelId = data.channelId as string
    const userId = socket.data.userId

    const message = await createMessageValidator.validate(data)
    const membership = ChannelMembersController.getMembership(channelId, userId)
    if (!membership) {
      throw { message: 'You are not a member of this channel' }
    }

    const createdMessage = await Message.create({
      channelId,
      senderId: userId,
      content: message.content,
    })
    const newMessage = await Message.query()
      .where('id', createdMessage.id)
      .preload('sender')
      .firstOrFail()

    // send other to clients in the channel
    socket.broadcast.to(`channel/${channelId}`).emit('message:new', newMessage)

    const msgContent = newMessage.content
    socket.broadcast.to(`channel/${channelId}/notification`).emit('message:notification:new', {
      content: msgContent.length > 64 ? msgContent.substring(0, 64) + '...' : msgContent,
      sender: { username: newMessage.sender.username },
      mentions: [...message.content.matchAll(/@([a-zA-Z0-9._-]+)/g)]
    })

    return { message: 'Sent successfully', newMessage }
  }

  /**
   * Changes user's status
   */
  public async changeStatus({ socket, data }: WsContext) {
    const { status } = await changeStatus.validate(data)

    const user = await User.findOrFail(socket.data.userId)
    user.status = status
    await user.save()

    socket.broadcast.emit(`user:${socket.data.userId}:status`, { status })

    return { message: 'Status updated', user: { status } }
  }
}

export default new WsController()
