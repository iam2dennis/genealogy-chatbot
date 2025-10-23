import React, { useState, forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import { SendIcon } from './Icons';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

const ChatInput = forwardRef<HTMLTextAreaElement, ChatInputProps>(({ onSendMessage, isLoading }, ref) => {
  const [text, setText] = useState('');
  const localRef = useRef<HTMLTextAreaElement>(null);

  // Expose the local ref to the parent component
  useImperativeHandle(ref, () => localRef.current!, []);
  
  // Auto-resize the textarea
  useEffect(() => {
    if (localRef.current) {
      localRef.current.style.height = 'auto'; // Reset height
      localRef.current.style.height = `${localRef.current.scrollHeight}px`;
    }
  }, [text]);


  const handleSubmit = () => {
    if (text.trim()) {
      onSendMessage(text);
      setText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="flex items-start space-x-2">
      <textarea
        ref={localRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask a question..."
        disabled={isLoading}
        className="flex-1 p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:outline-none transition duration-200 disabled:bg-slate-100 resize-none overflow-y-hidden"
        rows={1}
        autoComplete="off"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="p-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:bg-slate-400 disabled:cursor-not-allowed transition duration-200 self-end"
      >
        <SendIcon className="w-5 h-5" />
      </button>
    </form>
  );
});

export default ChatInput;