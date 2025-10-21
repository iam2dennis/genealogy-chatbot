// The reference to "vite/client" was removed to resolve a "Cannot find type definition file" error.
// This is likely a project setup issue. Since the project doesn't use Vite-specific
// client APIs (like import.meta.env), this removal is safe.

// Added type definition for process.env.API_KEY to support its usage in geminiService.ts
// FIX: Augment the NodeJS namespace to avoid redeclaring the 'process' variable,
// which resolves the "Cannot redeclare block-scoped variable" error.
declare namespace NodeJS {
  interface ProcessEnv {
    API_KEY: string;
  }
}
