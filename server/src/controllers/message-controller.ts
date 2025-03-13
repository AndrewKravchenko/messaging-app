import { Request, Response, NextFunction } from 'express';
import { MessageService } from '../services/message-service';

export class MessageController {
  private messageService: MessageService;

  constructor(messageService: MessageService) {
    this.messageService = messageService;
  }

  getMessages = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const messages = await this.messageService.getMessages();
      res.json(messages);
    } catch (error) {
      next(error);
    }
  };

  createMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { text } = req.body;
      if (!text) {
        res.status(400).json({ error: 'Text is required' });
        return;
      }

      await this.messageService.addMessage(text);
      res.status(201).json({ success: true });
    } catch (error) {
      next(error);
    }
  };
}
