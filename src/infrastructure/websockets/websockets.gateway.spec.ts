import { Test, TestingModule } from '@nestjs/testing';
import { WebsocketsGateway } from './websockets.gateway';
import { INestApplication } from "@nestjs/common";
import { Socket, io } from "socket.io-client";

describe('WebsocketsGateway', () => {
  let gateway: WebsocketsGateway;
  let app: INestApplication;
  let ioClient: Socket;

  async function createNestApp(...gateways: any): Promise<INestApplication> {
    const testingModule = await Test.createTestingModule({
      providers: gateways,
    }).compile();
    return testingModule.createNestApplication();
  }

  beforeAll(async () => {
    // Instantiate the app
    app = await createNestApp(WebsocketsGateway);
    // Get the gateway instance from the app instance
    gateway = app.get<WebsocketsGateway>(WebsocketsGateway);
    // Create a new client that will interact with the gateway
    ioClient = io("http://localhost:3001", {
      autoConnect: false,
      transports: ["websocket", "polling"],
    });
    // Start the app
    app.listen(3001);
  });

  afterAll(async () => {
    // Close the app
    ioClient.close();
    await app.close();
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

   it('should emit "pong" on "ping"', async () => {
     ioClient.connect();
     ioClient.emit("ping", "Hello world!");
     await new Promise<void>((resolve) => {
       ioClient.on("connect", () => {
         console.log("connected");
       });
       ioClient.on("pong", (data) => {
         expect(data).toBe("Hello world!");
         resolve();
       });
     });
     ioClient.disconnect();
   });
});
