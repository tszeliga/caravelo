interface AppConfig {
  api: {
    baseUrl: string
  }
  features: {
    devToolsEnabled: boolean
    consoleLogsEnabled: boolean
  }
}

export const appConfig: AppConfig = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL
  },
  features: {
    devToolsEnabled: import.meta.env.VITE_DEV_TOOLS_ENABLED === 'true',
    consoleLogsEnabled: import.meta.env.VITE_CONSOLE_LOGS_ENABLED === 'true'
  }
}

export const isDevelopment = import.meta.env.DEV
export const isProduction = import.meta.env.PROD

export function validateConfig(): boolean {
  const required = [
    appConfig.api.baseUrl
  ]
  
  const missing = required.filter(value => !value)
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing)
    return false
  }
  
  return true
}