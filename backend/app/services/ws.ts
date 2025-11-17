import server from '@adonisjs/core/services/server'
import { Server } from 'socket.io'

class Ws {
  public io!: Server
  private booted = false

  public boot() {
    if (this.booted) {
      return this.io
    }
    this.booted = true
    this.io = new Server(server.getNodeServer())
    return this.io
  }

  public to(room: string | string[]) {
    return this.io.to(room)
  }

  public userSockets(id: string, otherIo?: typeof Server) {
    return (this.io ?? otherIo).fetchSockets().then(sockets => sockets.filter(s => s.id == id || s.data.userId == id)) // userId = uuid
  }
}

export default new Ws()
