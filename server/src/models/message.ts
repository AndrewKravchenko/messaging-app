import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  text: string;
  createdAt: Date;
}
export type IMessageInput = Pick<IMessage, 'text' | 'createdAt'>;

const MessageSchema = new Schema<IMessage>({
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const MessageModel = mongoose.model<IMessage>('Message', MessageSchema);
