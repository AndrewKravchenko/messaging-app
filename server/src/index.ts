import app from './app';
import { connectDB } from './config/db';
import { WebSocketService } from './services/websocket-service';
import { config } from './config/env';

const startServer = async () => {
  await connectDB();

  app.listen(config.PORT, () => {
    console.log(`🚀 Server running on http://localhost:${config.PORT}`);
  });

  WebSocketService.getInstance();
};

startServer();
