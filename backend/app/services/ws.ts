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
}

export default new Ws()
