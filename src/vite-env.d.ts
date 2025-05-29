/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPENAI_API_KEY: string;
  readonly VITE_MAX_DOCUMENT_SIZE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}