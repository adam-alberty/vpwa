import app from '@adonisjs/core/services/app'
import ws from '#services/ws'
import User from '#models/user'
import { Secret } from '@adonisjs/core/helpers'
import WsController from '#controllers/ws_controller'

app.ready(() => {
  // Client connects to websocket
  ws.boot().on('connection', async (socket) => {
    try {
      // Auth
      const token = await User.accessTokens.verify(new Secret(socket.handshake.auth.token))
      if (!token) throw new Error('Invalid token')

      socket.data.userId = token.tokenableId
      console.log(`[WS] ${socket.id} authed`)
    } catch (err) {
      console.error('[WS] Invalid token for socket', socket.id, err)
      return socket.disconnect()
    }

    /**
     * Create message
     */
    socket.on('message:create', (data, ack) => {
      WsController.createMessage({ socket, data })
        .then(ack)
        .catch(err => ack({ error: true, ...err }))
    })

    socket.on('status:change', (data, ack) => {
      WsController.changeStatus({ socket, data })
        .then(ack)
        .catch(err => ack({ error: true, ...err }))
    })

    // Join channel notification rooms
    socket.on('notification:join', (data) => WsController.joinChannelNotifRooms({ socket, data }))

    // Leave channel notification rooms
    socket.on('notification:leave', (data) => WsController.leaveChannelNotifRooms({ socket, data }))

    // Join channel room
    socket.on('channel:join', (data) => WsController.joinChannelRoom({ socket, data }))

    // Leave channel room
    socket.on('channel:leave', (data) => WsController.leaveChannelRoom({ socket, data }))

    // Forward is typing...
    socket.on(`@${socket.data.userId}:typing`, (data) =>
      WsController.userIsTyping({ socket, data })
    )

    socket.on('disconnect', (data) => WsController.disconnect({ socket, data }))

    WsController.connected({ socket })
    socket.emit('connected', { id: socket.id })
  })
})
