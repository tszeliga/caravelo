interface AppConfig {
  api: {
    baseUrl: string
  }
}

export const appConfig: AppConfig = {
  api: {
    baseUrl: 'https://tools-httpstatus.pickup-services.com'
  }
}

export function validateConfig(): boolean {
  const required = [appConfig.api.baseUrl]
  const missing = required.filter(value => !value)

  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing)
    return false
  }

  return true
}
