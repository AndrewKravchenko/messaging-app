import { IMessage, IMessageInput } from "@/types/message";

const API_URL = 'http://localhost:5000/messages';

export const fetchMessages = async (): Promise<IMessage[]> => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch messages');
  }
  return response.json();
};

export const sendMessage = async (message: IMessageInput): Promise<void> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message),
  });
  if (!response.ok) {
    throw new Error('Failed to send message');
  }
};
