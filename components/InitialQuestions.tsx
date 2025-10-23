import React, { useState } from 'react';
import { UserPreferences, WebsiteOption, AnswerTypeOption } from '../types';
import { ResearchIcon } from './Icons';

interface InitialQuestionsProps {
  onSubmit: (preferences: UserPreferences) => void;
}

const InitialQuestions: React.FC<InitialQuestionsProps> = ({ onSubmit }) => {
  const [website, setWebsite] = useState<string>(WebsiteOption.ANY);
  const [otherWebsite, setOtherWebsite] = useState<string>('');
  const [answerType, setAnswerType] = useState<AnswerTypeOption>(AnswerTypeOption.DETAILED);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalWebsite = website === WebsiteOption.OTHER ? otherWebsite : website;
    if (!finalWebsite.trim()) return; // Prevent submission if "Other" is selected but empty
    onSubmit({ website: finalWebsite, answerType });
  };
  
  const handleWebsiteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setWebsite(selectedValue);
    if (selectedValue !== WebsiteOption.OTHER) {
      setOtherWebsite('');
    }
  };

  return (
    <div className="p-6 flex flex-col justify-center items-center h-full text-center bg-slate-50 overflow-y-auto">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-slate-200">
        <ResearchIcon className="w-16 h-16 mx-auto text-slate-400 mb-4" />
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome!</h2>
        <p className="text-slate-600 mb-6">
            I'm here to help with your genealogy research. To get started, please select your preferences below.
        </p>

        <div className="text-sm bg-yellow-50 border-l-4 border-yellow-400 p-4 text-left text-yellow-800 rounded-r-md mb-8">
            <p><strong>Please Note:</strong> I cannot access personal family records, but I can guide you on how to find them.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
            <div className="text-left">
              <label htmlFor="website" className="block text-sm font-medium text-slate-700 mb-2">
                Which website are you interested in?
              </label>
              <select
                id="website"
                value={website}
                onChange={handleWebsiteChange}
                className="w-full p-3 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-slate-500 focus:outline-none transition duration-200 bg-white"
              >
                {Object.values(WebsiteOption).map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {website === WebsiteOption.OTHER && (
              <div className="text-left mt-4 animate-fade-in">
                <label htmlFor="other-website" className="block text-sm font-medium text-slate-700 mb-2">
                  Please specify the website:
                </label>
                <input
                  type="text"
                  id="other-website"
                  value={otherWebsite}
                  onChange={(e) => setOtherWebsite(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-slate-500 focus:outline-none transition duration-200"
                  placeholder="e.g., newspapers.com"
                  required
                />
              </div>
            )}

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
              className="w-full p-3 bg-slate-600 text-white rounded-md font-semibold hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition duration-200 shadow-lg shadow-slate-600/20 disabled:bg-slate-400 disabled:cursor-not-allowed"
              disabled={website === WebsiteOption.OTHER && !otherWebsite.trim()}
            >
              Start Chatting
            </button>
        </form>
         <style>{`
            @keyframes fade-in {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in {
                animation: fade-in 0.5s ease-out forwards;
            }
        `}</style>
      </div>
    </div>
  );
};

export default InitialQuestions;