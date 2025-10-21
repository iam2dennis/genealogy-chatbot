import { GoogleGenAI } from "@google/genai";
import { UserPreferences } from '../types';

let ai: GoogleGenAI;

export const initializeGenAI = () => {
  // Add diagnostic logging to help debug the API key issue.
  console.log("--- Gemini Service Initialization ---");
  
  // Check for the 'process' object
  if (typeof process === 'undefined') {
    console.error("`process` object is not defined. This is expected in some browser environments if not polyfilled.");
  } else {
    console.log("`process` object is defined.");
    
    // Check for 'process.env'
    if (typeof process.env === 'undefined') {
      console.error("`process.env` is not defined.");
    } else {
      console.log("`process.env` object is defined.");
      console.log("Keys in `process.env`:", Object.keys(process.env));
      
      // Check for the API_KEY specifically
      const apiKey = process.env.API_KEY;
      if (apiKey) {
        console.log("API_KEY found in `process.env`.");
        console.log(`API_KEY length: ${apiKey.length}.`);
      } else {
        console.error("API_KEY is NOT found in `process.env`.");
      }
    }
  }
  console.log("-------------------------------------");


  // The API key is injected by the environment.
  // The GoogleGenAI constructor will read `process.env.API_KEY` and throw
  // its own error if the key is not available, which is handled in App.tsx.
  ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
};


const systemInstruction = `You are an expert genealogy research assistant chatbot. Your purpose is to answer questions about 'how to do genealogy' and provide information about top genealogy websites. 
- You MUST focus on these top 5 websites: FamilySearch.org, Ancestry.com, MyHeritage, Findmypast, and the US National Archives (archives.gov).
- When a user asks a general question, provide information that covers multiple relevant sites.
- You must be able to discuss both major and lesser-known online sources for genealogy records (e.g., state archives, historical societies, specific record collections like the Freedmen's Bureau).
- You are designed to be embedded in a Chrome Extension. Keep answers concise and well-formatted for a small screen. Use markdown for lists and emphasis.
- You will be given user preferences for a specific website and a desired answer format (detailed vs. step-by-step). You must tailor your response to these preferences.
- At the end of every response, you MUST include a section titled "--- Sources ---".
- In this section, list the primary websites or resources you used to formulate your answer, and provide a one-sentence explanation for why each source is relevant. For example: "FamilySearch.org: A primary source for vital records and user-submitted family trees."`;

export const getGenealogyAnswer = async (
  prompt: string,
  preferences: UserPreferences,
  onStreamUpdate: (chunk: string) => void,
  onStreamEnd: () => void,
): Promise<void> => {
  try {
    if (!ai) {
      throw new Error("Gemini AI client has not been initialized. Please call initializeGenAI() first.");
    }
    
    let context_prompt = `The user wants to know about "${prompt}".`;
    if (preferences.website !== "Any Website") {
        context_prompt += `\nTheir question is specifically about the website: ${preferences.website}.`;
    }
    if (preferences.answerType === 'step-by-step') {
        context_prompt += `\nPlease provide the answer as step-by-step instructions. The instructions should be clear, numbered, and easy to follow.`;
    } else {
        context_prompt += `\nPlease provide a detailed, comprehensive answer.`;
    }

    const responseStream = await ai.models.generateContentStream({
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
       errorMessage = error.message;
    }
     onStreamUpdate(`Sorry, there was an error. ${errorMessage}`);
  } finally {
    onStreamEnd();
  }
};