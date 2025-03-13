import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { IMessage } from '@/types/message';

export const useWebSocket = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:5001');

    ws.onmessage = (event) => {
      const newMessage: IMessage = JSON.parse(event.data);

      queryClient.setQueryData<IMessage[]>(['messages'], (oldMessages = []) => {
        return [
          ...oldMessages,
          newMessage,
        ];
      });
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      ws.close();
    };
  }, [queryClient]);
};
