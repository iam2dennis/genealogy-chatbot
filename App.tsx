import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Message, UserPreferences } from './types';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import InitialQuestions from './components/InitialQuestions';
import SuggestedPrompts from './components/SuggestedPrompts';
import { getGenealogyAnswer, initializeGenAI } from './services/geminiService';
import { LiahonaBooksLogo, RestartIcon } from './components/Icons';

const App: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [initError, setInitError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      initializeGenAI();
      setIsInitialized(true);
    } catch (error) {
      console.error("Initialization error:", error);
      const message = error instanceof Error ? error.message : "An unknown error occurred during initialization.";
      setInitError(`We couldn't connect to the AI service. Please check your connection or try refreshing the page.\n\nError: ${message}`);
    }
  }, []);


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
    
    await getGenealogyAnswer(text, preferences, onStreamUpdate, onStreamEnd);
  }, [preferences]);
  
  if (initError) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-slate-100 p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Initialization Failed</h1>
        <p className="whitespace-pre-wrap text-slate-700 max-w-md">{initError}</p>
      </div>
    );
  }

  if (!isInitialized) {
    return (
       <div className="flex flex-col h-screen items-center justify-center bg-slate-100">
         <LiahonaBooksLogo className="w-48 text-slate-400 animate-pulse" />
         <p className="text-slate-500 mt-4">Initializing AI Research Assistant...</p>
       </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-100 font-sans antialiased max-w-3xl mx-auto shadow-2xl rounded-lg">
      <header className="bg-white border-b border-slate-200 p-4 flex items-center justify-between z-10">
        <div className="flex items-center space-x-3">
            <div style={{ backgroundColor: '#FFFACD' }} className="p-2 rounded-lg shadow-sm">
              <LiahonaBooksLogo className="w-24 text-slate-800" />
            </div>
            <div>
                <h1 className="text-xl font-bold text-slate-800 leading-tight">
                    Genealogy Helper
                </h1>
                <p className="text-sm text-slate-500">Your AI Research Assistant</p>
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
        <InitialQuestions 
          onSubmit={handlePreferencesSubmit}
        />
      ) : (
        <main 
          ref={chatContainerRef} 
          className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d1d5db' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`}}
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
           {messages.length === 1 && preferences && !isLoading && (
            <SuggestedPrompts preferences={preferences} onSelect={handleSendMessage} />
          )}
        </main>
      )}

      {preferences && (
        <footer className="bg-white border-t border-slate-200 p-4 z-10">
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </footer>
      )}
    </div>
  );
};

export default App;