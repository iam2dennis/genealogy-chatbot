import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Message, UserPreferences } from './types';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import InitialQuestions from './components/InitialQuestions';
import { getGenealogyAnswer } from './services/geminiService';
import { LiahonaBooksLogo, RestartIcon } from './components/Icons';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  // For production deployment, we assume the API key is set as an environment variable.
  const hasApiKey = true;

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  
  const handleRestart = () => {
    setMessages([]);
    setPreferences(null);
  };
  
  const handlePreferencesSubmit = (submittedPreferences: UserPreferences) => {
    setPreferences(submittedPreferences);
    let websiteText = submittedPreferences.website === 'Any Website' ? 'genealogy in general' : `for ${submittedPreferences.website}`;
    let answerTypeText = submittedPreferences.answerType === 'detailed' ? 'detailed answers' : 'step-by-step instructions';
    
    setMessages([
      {
        role: 'model',
        text: `Great! I'm ready to help you with ${answerTypeText} about ${websiteText}. What's your first question?`,
      },
    ]);
  };
  
  const handleApiKeyError = () => {
    // In a production environment, this indicates the environment variable is invalid.
    // We'll show an error but can't prompt for a new key.
    setMessages(prev => [...prev, { role: 'model', text: 'There was a critical error with the API configuration. Please contact the site administrator.' }]);
    setIsLoading(false);
  };

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim() || !preferences) return;

    const userMessage: Message = { role: 'user', text };
    setMessages(prev => [...prev, userMessage, { role: 'model', text: '' }]);
    setIsLoading(true);

    const onStreamUpdate = (chunk: string) => {
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage.role === 'model') {
          lastMessage.text += chunk;
        }
        return newMessages;
      });
    };

    const onStreamEnd = () => {
      setIsLoading(false);
    };

    await getGenealogyAnswer(text, preferences, onStreamUpdate, onStreamEnd, handleApiKeyError);
  }, [preferences]);

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans antialiased max-w-3xl mx-auto">
      <header className="bg-white border-b border-slate-200 p-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-4">
            <div style={{ backgroundColor: '#FFFACD' }} className="p-1 rounded-lg">
              <LiahonaBooksLogo className="w-28 text-slate-800" />
            </div>
            <div>
                <h1 className="text-lg font-bold text-slate-800 leading-tight">
                    What Is YOUR<br />Genealogy Question?
                </h1>
                <p className="text-sm text-slate-500">Your Genealogy Helper</p>
            </div>
        </div>
         {preferences && (
          <button 
            onClick={handleRestart}
            className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
            aria-label="Start Over"
          >
              <RestartIcon className="w-5 h-5" />
          </button>
        )}
      </header>
      
      {!preferences ? (
        <InitialQuestions onSubmit={handlePreferencesSubmit} />
      ) : (
        <main 
          ref={chatContainerRef} 
          className="flex-1 overflow-y-auto p-4 space-y-4"
          aria-live="polite"
          aria-atomic="false"
        >
          {messages.map((msg, index) => (
            <ChatMessage 
              key={index} 
              message={msg} 
              isStreaming={isLoading && index === messages.length - 1} 
            />
          ))}
        </main>
      )}

      {hasApiKey && preferences && (
        <footer className="bg-white border-t border-slate-200 p-4">
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </footer>
      )}
    </div>
  );
};

export default App;
