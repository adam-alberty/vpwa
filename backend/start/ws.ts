import app from '@adonisjs/core/services/app'
import ws from '#services/ws'

app.ready(() => {
  ws.boot()

  // Client connects to websocket
  ws.io.on('connection', (socket) => {
    console.log('socket connected', socket.id)

    // listens to messages
    socket.on('channel:join', (channelId) => {
      socket.join(`channel:${channelId}`)
      ws.io.to(`channel:${channelId}`).emit('nice')
    })

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id)
    })
  })
})
