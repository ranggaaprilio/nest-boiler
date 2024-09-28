import { Logger } from '@nestjs/common'
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Socket, Server } from 'socket.io'
import { instrument } from '@socket.io/admin-ui'

@WebSocketGateway(81, { transports: ['websocket'], cors: true })
export class WebsocketsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(WebsocketsGateway.name)

  @WebSocketServer() io: Server
  private clients: Set<Socket> = new Set()

  afterInit() {
    this.logger.log('Initialized socket')
    instrument(this.io, {
      auth: false,
      mode: 'development',
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleConnection(client: Socket, ...args: never[]) {
    const { sockets } = this.io.sockets

    this.logger.log(`Client id: ${client.id} connected`)
    this.logger.debug(`Number of connected clients: ${sockets.size}`)
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliend id:${client.id} disconnected`)
  }

  @SubscribeMessage('ping')
  handleMessage(client: Socket, data: any) {
    this.logger.log(`Message received from client id: ${client.id}`)
    this.logger.debug(`Payload: ${data}`)
    return {
      event: 'pong',
      data,
    }
  }
}
