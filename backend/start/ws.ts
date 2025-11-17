import app from '@adonisjs/core/services/app'
import ws from '#services/ws'
import User, { UserStatus } from '#models/user'
import { Secret } from '@adonisjs/core/helpers'

app.ready(() => {
  const io = ws.boot()

  // Client connects to websocket
  io.on('connection', async (socket) => {
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

    // Join channel room
    socket.on('channel:join', (id) => {
      if (!socket.data.userId)
        return console.error(`[WS] Invalid token for room`)

      socket.join(`channel/${id}`)
      console.log(`[WS] ${socket.id} joined channel/${id}`)
    })

    // Leave channel room
    socket.on('channel:leave', (id) => {
      socket.leave(`channel/${id}`)
      console.log(`[WS] ${socket.id} left channel/${id}`)
    })

    console.log(`[WS] ${socket.id} connected`)
    socket.join(`@${socket.data.userId}`)
    socket.emit('connected', { id: socket.id })

    const userId = socket.data.userId
    if (userId) {
      ws.userSockets(userId).then(async sockets => {
        if (sockets.length == 1) { // Send status on first connection
          const user = await User.find(userId).catch(() => null)
          if (user && user.status != UserStatus.OFFLINE)
            io.emit(`user:${user.id}:status`, { status: user.status })
        }
      })
    }

    socket.on('disconnect', () => {
      socket.leave(`@${socket.data.userId}`)

      const disconnectUserId = socket.data.userId
      if (disconnectUserId) {
        ws.userSockets(disconnectUserId).then(async sockets => {
          if (!sockets.length) { // Handle offline on last disconnect
            const user = await User.find(disconnectUserId).catch(() => null)
            if (user && user.status != UserStatus.OFFLINE)
              io.emit(`user:${user.id}:status`, { status: UserStatus.OFFLINE })
          }
        })
      }

      console.log(`[WS] ${socket.id} disconnected`)
    })
  })
})
