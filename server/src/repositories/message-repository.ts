import { MessageModel, IMessage, IMessageInput } from '../models/message';

export class MessageRepository {
  async saveMessages(messages: IMessageInput[]): Promise<void> {
    await MessageModel.insertMany(messages);
  }

  async getAllMessages(): Promise<IMessage[]> {
    return MessageModel.find().sort({ createdAt: 1 }).lean();
  }
}
