/// <reference types="vite/client" />

// Add types for the aistudio object used for API key selection
interface AiStudio {
  hasSelectedApiKey(): Promise<boolean>;
  openSelectKey(): Promise<void>;
}

declare global {
  interface Window {
    aistudio?: AiStudio;
  }
}

// Keep the NodeJS types for process.env.API_KEY, which is expected to be
// polyfilled by the environment after a key is selected.
declare namespace NodeJS {
  interface ProcessEnv {
    API_KEY: string;
  }
}

// FIX: Add export {} to treat this file as a module and allow global augmentation.
export {};
