import express from 'express';
import { MessageController } from '../controllers/message-controller';
import { MessageService } from '../services/message-service';
import { MessageRepository } from '../repositories/message-repository';

const router = express.Router();
const messageService = new MessageService(new MessageRepository());
const messageController = new MessageController(messageService);

router.get('/', messageController.getMessages);
router.post('/', messageController.createMessage);

export default router;
