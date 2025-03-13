import { WebSocketServer, WebSocket } from 'ws';
import { MessageModel, IMessage } from '../models/message';
import { config } from '../config/env';

export class WebSocketService {
  private static instance: WebSocketService;
  private wss: WebSocketServer;

  private constructor() {
    this.wss = new WebSocketServer({ port: config.WS_PORT });
    this.setupListeners();
  }

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  private setupListeners() {
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('Client connected');

      ws.on('close', () => {
        console.log('Client disconnected');
      });
    });

    this.listenToDBChanges();

    process.on('SIGINT', () => {
      console.log('Shutting down WebSocket server...');
      this.wss.clients.forEach(client => client.close());
      process.exit();
    });
  }

  private listenToDBChanges() {
    const changeStream = MessageModel.watch([], { fullDocument: 'updateLookup' });

    changeStream.on('change', (change) => {
      if (change.operationType === 'insert') {
        const newMessage: IMessage = change.fullDocument;
        this.broadcast(JSON.stringify(newMessage));
      }
    });

    console.log('📡 WebSocket listening for database changes...');
  }

  private broadcast(data: string) {
    this.wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  }
}
