import ws from '#services/ws'
import User, { UserStatus } from '#models/user'
import { WsContext } from '#services/ws'

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
    if (!socket.data.userId) return console.error(`[WS] Invalid token for room`)

    socket.join(`channel/${data}`)
    console.log(`[WS] ${socket.id} joined channel/${data}`)
  }

  public leaveChannelRoom({ socket, data /*channelId*/ }: WsContext) {
    socket.leave(`channel/${data}`)
    console.log(`[WS] ${socket.id} left channel/${data}`)
  }

  public userIsTyping({ socket, data }: WsContext) {
    ws.to(`channel/${data.channelId}`).emit(`@${socket.data.userId}:typing`, data?.typing?.trim())
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
}

export default new WsController()
