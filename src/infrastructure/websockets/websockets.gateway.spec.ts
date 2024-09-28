import { Test } from '@nestjs/testing'
import { WebsocketsGateway } from './websockets.gateway'
import { INestApplication } from '@nestjs/common'
import { Socket, io } from 'socket.io-client'
import { ConfigModule, ConfigService } from '@nestjs/config'

describe('WebsocketsGateway', () => {
  let gateway: WebsocketsGateway
  let app: INestApplication
  let ioClient: Socket
  let configService: ConfigService

  async function createNestApp(...gateways: typeof WebsocketsGateway[]): Promise<INestApplication> {
    const testingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }), // Tambahkan ConfigModule
      ],
      providers: gateways,
    }).compile()

    return testingModule.createNestApplication()
  }

  beforeAll(async () => {
    // Instantiate the app
    app = await createNestApp(WebsocketsGateway)
    configService = app.get<ConfigService>(ConfigService)
    // Get the gateway instance from the app instance
    gateway = app.get<WebsocketsGateway>(WebsocketsGateway)
    // Create a new client that will interact with the gateway
    const Base_WS_URL = configService.get<string>('BASE_WS_URL')
    ioClient = io(Base_WS_URL, {
      autoConnect: false,
      transports: ['websocket', 'polling'],
    })
    // Start the app
    await app.listen(3001)
  })

  afterAll(async () => {
    // Close the app
    ioClient.close()
    await app.close()
  })

  it('should be defined', () => {
    expect(gateway).toBeDefined()
  })

  it('should emit "pong" on "ping"', async () => {
    ioClient.connect()
    ioClient.emit('ping', 'Hello world!')
    await new Promise<void>(resolve => {
      ioClient.on('connect', () => {
        expect(ioClient.connected).toBe(true)
      })
      ioClient.on('pong', data => {
        expect(data).toBe('Hello world!')
        resolve()
      })
    })
    ioClient.disconnect()
  })
})
