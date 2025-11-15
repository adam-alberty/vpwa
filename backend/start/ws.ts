import app from '@adonisjs/core/services/app'
import ws from '#services/ws'

app.ready(() => {
  ws.boot()

  // Client connects to websocket
  ws.io.on('connection', (socket) => {
    console.log('[WS] connected', socket.id)

    // Join channel room
    socket.on('channel:join', (id) => {
      socket.join(`channel/${id}`)
      console.log(`[WS] ${socket.id} joined channel/${id}`)
    })

    // Leave channel room
    socket.on('channel:leave', (id) => {
      socket.leave(`channel/${id}`)
      console.log(`[WS] ${socket.id} left channel/${id}`)
    })

    socket.on('disconnect', () => {
      console.log('[WS] User disconnected:', socket.id)
    })
  })
})
