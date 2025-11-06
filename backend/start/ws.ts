import { Server } from 'socket.io'
import app from '@adonisjs/core/services/app'
import server from '@adonisjs/core/services/server'

app.ready(() => {
  const io = new Server(server.getNodeServer())

  // Client connects to websocket
  io.on('connection', (socket) => {
    console.log('socket connected', socket.id)

    // listens to messages
    socket.on('join', (msg) => {
      io.emit('chat message', msg)
    })

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id)
    })
  })
})
