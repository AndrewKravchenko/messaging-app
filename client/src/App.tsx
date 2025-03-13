import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchMessages, sendMessage } from '@/api/messages';
import { useWebSocket } from '@/hooks/useWebSocket';
import { IMessage, IMessageInput } from '@/types/message';

function App() {
  const [text, setText] = useState('');

  const { data: messages = [], isLoading, error } = useQuery<IMessage[]>({
    queryKey: ['messages'],
    queryFn: fetchMessages,
    staleTime: Infinity,
  });

  const mutation = useMutation<void, Error, IMessageInput>({
    mutationFn: sendMessage,
  });

  useWebSocket();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    mutation.mutate({ text });
    setText('');
  };

  return (
    <div className="chat-container">
      <h1>Live Chat</h1>

      {isLoading && <p>Loading messages...</p>}
      {error && <p>Error loading messages</p>}

      <ul className="messages">
        {messages.map((message) => (
          <li key={message._id}>{message.text}</li>
        ))}
      </ul>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit" disabled={mutation.isPending}>Send</button>
      </form>
    </div>
  );
}

export default App;
