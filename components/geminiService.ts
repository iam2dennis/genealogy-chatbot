// FIX: Commented out to prevent type resolution error, likely due to environment setup.
// /// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
