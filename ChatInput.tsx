import React, { useState } from 'react';
import { SendIcon } from './Icons';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage(text);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ask a question..."
        disabled={isLoading}
        className="flex-1 p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:outline-none transition duration-200 disabled:bg-slate-100"
        autoComplete="off"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="p-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:bg-slate-400 disabled:cursor-not-allowed transition duration-200"
      >
        <SendIcon className="w-5 h-5" />
      </button>
    </form>
  );
};

export default ChatInput;