import React, { useState } from 'react';
import { UserPreferences, WebsiteOption, AnswerTypeOption } from '../types';

interface InitialQuestionsProps {
  onSubmit: (preferences: UserPreferences) => void;
}

const InitialQuestions: React.FC<InitialQuestionsProps> = ({ onSubmit }) => {
  const [website, setWebsite] = useState<string>(WebsiteOption.ANY);
  const [answerType, setAnswerType] = useState<AnswerTypeOption>(AnswerTypeOption.DETAILED);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ website, answerType });
  };

  return (
    <div className="p-6 flex flex-col justify-center items-center h-full text-center bg-slate-50">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Welcome!</h2>
        <div className="text-slate-600 mb-8 space-y-4">
            <p>
                I'm here to help with your genealogy research! Ask me "how-to" questions, or for information about sources and popular websites.
            </p>
            <div className="text-sm bg-yellow-50 border-l-4 border-yellow-400 p-4 text-left text-yellow-800 rounded-r-md">
                <p><strong>Please Note:</strong> I cannot access personal family records, but I can guide you on how to find them.</p>
            </div>
            <p className="text-slate-500">
                To get started, please select your preferences below.
            </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-left">
            <label htmlFor="website" className="block text-sm font-medium text-slate-700 mb-2">
              Which website are you interested in?
            </label>
            <select
              id="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-slate-500 focus:outline-none transition duration-200"
            >
              {Object.values(WebsiteOption).map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="text-left">
             <label className="block text-sm font-medium text-slate-700 mb-2">
              How would you like your answers?
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setAnswerType(AnswerTypeOption.DETAILED)}
                className={`flex-1 p-3 border rounded-md text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 ${answerType === 'detailed' ? 'bg-slate-700 text-white border-slate-700 shadow-md' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
              >
                Detailed Answer
              </button>
              <button
                 type="button"
                 onClick={() => setAnswerType(AnswerTypeOption.STEP_BY_STEP)}
                 className={`flex-1 p-3 border rounded-md text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 ${answerType === 'step-by-step' ? 'bg-slate-700 text-white border-slate-700 shadow-md' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
              >
                Step-by-Step
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-slate-600 text-white rounded-md font-semibold hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition duration-200 shadow-lg shadow-slate-600/20"
          >
            Start Chatting
          </button>
        </form>
      </div>
    </div>
  );
};

export default InitialQuestions;
