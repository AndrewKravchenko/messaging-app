import { MessageRepository } from '../repositories/message-repository';
import { Storage } from './storage';
import { IMessageInput } from '../models/message';

export class MessageService {
  private repository: MessageRepository;
  private storage: Storage;
  private buffer: IMessageInput[] = [];
  private isBufferLoaded = false;
  private flushTimeout: NodeJS.Timeout | null = null;

  constructor(repository: MessageRepository) {
    this.repository = repository;
    this.storage = new Storage('message-buffer.json');
  }

  private async restoreBufferIfNeeded(): Promise<void> {
    if (this.isBufferLoaded) return;

    await this.storage.init();
    const savedBuffer = await this.storage.get<IMessageInput[]>('messageBuffer');

    if (savedBuffer && savedBuffer.length > 0) {
      console.log(`🔄 Restored ${savedBuffer.length} messages from buffer.`);
      await this.repository.saveMessages(savedBuffer);
      await this.storage.remove('messageBuffer');
    }

    this.isBufferLoaded = true;
  }

  async getMessages() {
    await this.restoreBufferIfNeeded();
    return this.repository.getAllMessages();
  }

  async addMessage(text: string): Promise<void> {
    const newMessage: IMessageInput = { text, createdAt: new Date() };
    this.buffer.push(newMessage);
    await this.storage.set('messageBuffer', this.buffer);

    if (this.buffer.length >= 10) {
      await this.flushBuffer();
      return
    }

    if (!this.flushTimeout) {
      this.flushTimeout = setTimeout(() => this.flushBuffer(), 1000);
    }
  }

  private async flushBuffer(): Promise<void> {
    if (this.buffer.length === 0) return;

    if (this.flushTimeout) {
      clearTimeout(this.flushTimeout);
      this.flushTimeout = null;
    }

    await this.repository.saveMessages(this.buffer);
    this.buffer = [];
    await this.storage.remove('messageBuffer');
  }
}
