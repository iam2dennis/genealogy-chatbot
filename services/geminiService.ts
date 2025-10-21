import type { GoogleGenAI } from '@google/genai';
import { UserPreferences } from '../types';

const systemInstruction = `You are an expert genealogy research assistant chatbot. Your purpose is to answer questions about 'how to do genealogy' and provide information about top genealogy websites. 
- You MUST focus on these top 5 websites: FamilySearch.org, Ancestry.com, MyHeritage, Findmypast, and the US National Archives (archives.gov).
- When a user asks a general question, provide information that covers multiple relevant sites.
- You must be able to discuss both major and lesser-known online sources for genealogy records (e.g., state archives, historical societies, specific record collections like the Freedmen's Bureau).
- You are designed to be embedded in a Chrome Extension. Keep answers concise and well-formatted for a small screen. Use markdown for lists and emphasis.
- You will be given user preferences for a specific website and a desired answer format (detailed vs. step-by-step). You must tailor your response to these preferences.
- At the end of every response, you MUST include a section titled "--- Sources ---".
- In this section, list the primary websites or resources you used to formulate your answer, and provide a one-sentence explanation for why each source is relevant. For example: "FamilySearch.org: A primary source for vital records and user-submitted family trees."`;

// Declare a variable to hold the AI client instance.
let ai: GoogleGenAI | null = null;

// This function will dynamically import and initialize the AI client on the first call.
const getAiClient = async () => {
  if (!ai) {
    // Dynamically import the library only when it's first needed.
    // This prevents the library from running on startup and crashing the app.
    const { GoogleGenAI } = await import('@google/genai');
    ai = new GoogleGenAI({});
  }
  return ai;
};

export const getGenealogyAnswer = async (
  prompt: string,
  preferences: UserPreferences,
  onStreamUpdate: (chunk: string) => void,
  onStreamEnd: () => void,
): Promise<void> => {
  try {
    // Await the client initialization.
    const client = await getAiClient();

    let context_prompt = `The user wants to know about "${prompt}".`;
    if (preferences.website !== "Any Website") {
        context_prompt += `\nTheir question is specifically about the website: ${preferences.website}.`;
    }
    if (preferences.answerType === 'step-by-step') {
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
    
    for await (const chunk of responseStream) {
        onStreamUpdate(chunk.text);
    }

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    let errorMessage = "Failed to get response from the AI model.";
    if (error instanceof Error) {
       errorMessage = `An error occurred: ${error.message}`;
    }
     onStreamUpdate(`Sorry, there was an error. ${errorMessage}`);
  } finally {
    onStreamEnd();
  }
};
