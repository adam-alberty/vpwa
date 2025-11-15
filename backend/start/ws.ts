import app from '@adonisjs/core/services/app'
import ws from '#services/ws'
import User, { UserStatus } from '#models/user'
import { Secret } from '@adonisjs/core/helpers'

function userSockets(io: typeof ws.io, userId: string) {
  return io.fetchSockets().then(sockets => sockets.filter(s => s.data.userId == userId))
}

app.ready(() => {
  const io = ws.boot()

  // Client connects to websocket
  io.on('connection', async (socket) => {
    console.log('[WS] Connected', socket.id)

    try { // Auth
      const token = await User.accessTokens.verify(new Secret(socket.handshake.auth.token))
      if (!token)
        throw new Error('Invalid token')

      socket.data.userId = token.tokenableId
      console.log(`[WS] ${socket.id} authed`)
    } catch (err) {
      console.error('[WS] Invalid token for socket', socket.id, err)
      return socket.disconnect()
    }

    const userId = socket.data.userId
    if (userId) {
      const sockets = await userSockets(io, userId)
      if (sockets.length == 1) { // Send status on first connection
        const user = await User.find(userId).catch(() => null)
        if (user && user.status != UserStatus.OFFLINE)
          io.emit(`user:${user.id}:status`, { status: user.status })
      }
    }

    // Join channel room
    socket.on('channel:join', (id) => {
      if (!socket.data.userId)
        return

      socket.join(`channel/${id}`)
      console.log(`[WS] ${socket.id} joined channel/${id}`)
    })

    // Leave channel room
    socket.on('channel:leave', (id) => {
      socket.leave(`channel/${id}`)
      console.log(`[WS] ${socket.id} left channel/${id}`)
    })

    socket.on('disconnect', async () => {
      console.log('[WS] User disconnected:', socket.id)

      const userId = socket.data.userId
      if (userId) {
        const sockets = await userSockets(io, userId)
        if (!sockets.length) { // Handle offline on last disconnect
          const user = await User.find(userId).catch(() => null)
          if (user && user.status != UserStatus.OFFLINE)
            io.emit(`user:${user.id}:status`, { status: UserStatus.OFFLINE })
        }
      }
    })
  })
})
