import { GoogleGenAI } from "@google/genai";
import { UserPreferences } from '../types';

let ai: GoogleGenAI;

export const initializeGenAI = () => {
  // This function is designed to thoroughly inspect the environment and find the API key.
  console.log("--- Environment Diagnostics ---");
  
  let apiKey: string | undefined = undefined;

  // 1. Standard check based on instructions
  if (typeof process !== 'undefined' && process.env) {
    console.log("`process.env` object found.");
    apiKey = process.env.API_KEY;
  } else {
    console.log("`process.env` is not available in this environment.");
  }

  // 2. If key not found, inspect the global scope (window) for clues
  if (!apiKey) {
    console.log("API key not found via `process.env`. Inspecting `window` object for alternatives.");
    try {
      // We are looking for anything that might contain secrets or environment variables.
      const potentialSources: string[] = [];
      for (const key in window) {
        if (key.toLowerCase().includes('env') || key.toLowerCase().includes('config') || key.toLowerCase().includes('api_key') || key.toLowerCase().includes('aistudio')) {
          potentialSources.push(key);
        }
      }
      if (potentialSources.length > 0) {
        console.log("Found potential API key sources on `window` object:", potentialSources);
        // Log the contents of these potential sources if they are simple objects
        potentialSources.forEach(key => {
           try {
             const prop = (window as any)[key];
             if (typeof prop === 'object' && prop !== null) {
                console.log(`Contents of window.${key}:`, Object.keys(prop));
             }
           } catch(e) {
             // ignore security errors for certain window properties
           }
        });
      } else {
        console.log("No obvious API key sources found on `window` object.");
      }
    } catch (e) {
      console.error("Error inspecting `window` object:", e);
    }
  }

  // 3. Attempt to initialize, which will throw a clear error if apiKey is still missing.
  // The diagnostics above are the important part for the next step.
  console.log("Attempting to initialize GoogleGenAI...");
  console.log("-----------------------------");
  
  // This will use the apiKey found (or undefined) and throw the expected error if it's missing.
  ai = new GoogleGenAI({ apiKey });
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