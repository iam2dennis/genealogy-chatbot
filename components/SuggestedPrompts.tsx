import React from 'react';
import { UserPreferences, WebsiteOption } from '../types';

interface SuggestedPromptsProps {
  preferences: UserPreferences;
  onSelect: (prompt: string) => void;
}

const getSuggestions = (preferences: UserPreferences): string[] => {
    const { website } = preferences;

    const generalSuggestions = [
        `What are the best free resources on ${website === WebsiteOption.ANY ? "the internet" : website}?`,
        `How do I find birth records for an ancestor?`,
        `Explain the difference between a primary and secondary source in genealogy.`,
    ];

    if (website === WebsiteOption.FAMILY_SEARCH) {
        return [
            `How do I get started with the Family Tree on FamilySearch.org?`,
            `Explain how to search the catalog on FamilySearch.org.`,
            `What are "Record Hints" on FamilySearch.org?`,
        ];
    }
    
    if (website === WebsiteOption.ANCESTRY) {
         return [
            `How do I use ThruLines® on Ancestry.com?`,
            `What is AncestryDNA and how can it help my research?`,
            `Can you explain how to build a family tree on Ancestry.com?`,
        ];
    }
    
     if (website === WebsiteOption.MY_HERITAGE) {
         return [
            `How do I use the 'Theory of Family Relativity' on MyHeritage?`,
            `What are the benefits of the MyHeritage DNA test?`,
            `Can you explain how to use Photo Discoveries™?`,
        ];
    }

    if (website === WebsiteOption.US_NATIONAL_ARCHIVES) {
         return [
            `How do I find military records at the US National Archives?`,
            `Can you explain how to search the National Archives Catalog online?`,
            `What kind of immigration records are available at archives.gov?`,
        ];
    }

    return generalSuggestions;
};

const SuggestedPrompts: React.FC<SuggestedPromptsProps> = ({ preferences, onSelect }) => {
  const suggestions = getSuggestions(preferences);

  return (
    <div className="flex flex-col items-start gap-2 animate-fade-in">
        <p className="text-sm font-medium text-slate-600 px-2">Or, try one of these questions:</p>
      {suggestions.map((prompt, index) => (
        <button
          key={index}
          onClick={() => onSelect(prompt)}
          className="w-full text-left text-sm p-3 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
        >
          {prompt}
        </button>
      ))}
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
  );
};

export default SuggestedPrompts;