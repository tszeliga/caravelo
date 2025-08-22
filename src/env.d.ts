/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_DEV_TOOLS_ENABLED: string
  readonly VITE_CONSOLE_LOGS_ENABLED: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}