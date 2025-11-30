import server from '@adonisjs/core/services/server'
import { Server, Socket } from 'socket.io'

export interface WsContext {
  socket: Socket
  data?: any
}

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

  public async userSockets(id: string, otherIo?: typeof Server) {
    const sockets = await (this.io ?? otherIo).fetchSockets()
    return sockets.filter((s) => s.id == id || s.data.userId == id) // userId = uuid
  }
}

export default new Ws()
