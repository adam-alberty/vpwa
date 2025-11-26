import app from '@adonisjs/core/services/app'
import ws from '#services/ws'
import User from '#models/user'
import { Secret } from '@adonisjs/core/helpers'
import WsController from '#controllers/ws_controller'

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
    socket.on('channel:join', data => WsController.joinChannelRoom({ socket, data }))

    // Leave channel room
    socket.on('channel:leave', data => WsController.leaveChannelRoom({ socket, data }))

    // Forward is typing...
    socket.on(`@${socket.data.userId}:typing`, data => WsController.userIsTyping({ socket, data }))

    socket.on('disconnect', data => WsController.disconnect({ socket, data }))

    WsController.connected({ socket })
    socket.emit('connected', { id: socket.id })
  })
})
