import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Message, UserPreferences } from './types';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import InitialQuestions from './components/InitialQuestions';
import SuggestedPrompts from './components/SuggestedPrompts';
import { LiahonaBooksLogo, RestartIcon } from './components/Icons';

const systemInstruction = `You are an expert genealogy research assistant chatbot. Your purpose is to answer questions about 'how to do genealogy' and provide information about top genealogy websites. 
- You MUST focus on these top 5 websites: FamilySearch.org, Ancestry.com, MyHeritage, Findmypast, and the US National Archives (archives.gov).
- When a user asks a general question, provide information that covers multiple relevant sites.
- You must be able to discuss both major and lesser-known online sources for genealogy records (e.g., state archives, historical societies, specific record collections like the Freedmen's Bureau).
- You are designed to be embedded in a Chrome Extension. Keep answers concise and well-formatted for a small screen. Use markdown for lists and emphasis.
- You will be given user preferences for a specific website and a desired answer format (detailed vs. step-by-step). You must tailor your response to these preferences.
- At the end of every response, you MUST include a section titled "--- Sources ---".
- In this section, list the primary websites or resources you used to formulate your answer, and provide a one-sentence explanation for why each source is relevant. For example: "FamilySearch.org: A primary source for vital records and user-submitted family trees."`;


const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isAiClientReady, setIsAiClientReady] = useState<boolean>(false);
  const [initError, setInitError] = useState<string | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const aiClientRef = useRef<GoogleGenAI | null>(null);

  useEffect(() => {
    // Add a small delay to allow the host environment to initialize fully.
    const timer = setTimeout(() => {
      try {
        const client = new GoogleGenAI({});
        aiClientRef.current = client;
        setIsAiClientReady(true);
      } catch (error) {
        console.error("Fatal Error: Could not initialize Google AI Client.", error);
        setInitError("Error: Could not connect to the AI service. Please try reloading.");
      }
    }, 100); // 100ms delay

    return () => clearTimeout(timer); // Cleanup timer on unmount
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

  const getGenealogyAnswer = useCallback(async (
    prompt: string,
    prefs: UserPreferences,
  ) => {
    if (!aiClientRef.current) {
      throw new Error("AI Client is not ready. Please wait a moment and try again.");
    }
    try {
      const client = aiClientRef.current;

      let context_prompt = `The user wants to know about "${prompt}".`;
      if (prefs.website !== "Any Website") {
          context_prompt += `\nTheir question is specifically about the website: ${prefs.website}.`;
      }
      if (prefs.answerType === 'step-by-step') {
          context_prompt += `\nPlease provide the answer as step-by-step instructions. The instructions should be clear, numbered, and easy to follow.`;
      } else {
          context_prompt += `\nPlease provide a detailed, comprehensive answer.`;
      }

      const responseStream = await client.models.generateContentStream({
          model: 'gemini-2.5-flash',
          contents: context_prompt,
          config: {
              systemInstruction: systemInstruction,
              temperature: 0.5,
              topP: 0.95,
              topK: 64,
          },
      });
      
      return responseStream;

    } catch (error) {
      console.error("Error calling Gemini API:", error);
      let errorMessage = "Failed to get response from the AI model.";
      if (error instanceof Error) {
        errorMessage = `An error occurred: ${error.message}`;
      }
      throw new Error(`Sorry, there was an error. ${errorMessage}`);
    }
  }, []);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim() || !preferences) return;

    const userMessage: Message = { role: 'user', text };
    setMessages(prev => [...prev, userMessage, { role: 'model', text: '' }]);
    setIsLoading(true);

    try {
      const stream = await getGenealogyAnswer(text, preferences);
      for await (const chunk of stream) {
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage.role === 'model') {
            lastMessage.text += chunk.text;
          }
          return newMessages;
        });
      }
    } catch (error) {
       setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage.role === 'model') {
            lastMessage.text = error instanceof Error ? error.message : String(error);
          }
          return newMessages;
        });
    } finally {
      setIsLoading(false);
    }
  }, [preferences, getGenealogyAnswer]);

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
          isAiClientReady={isAiClientReady}
          initError={initError}
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