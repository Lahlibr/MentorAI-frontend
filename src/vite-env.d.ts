/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  // You can add more VITE_... variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
