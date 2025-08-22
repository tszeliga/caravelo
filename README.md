# Caravelo Flight Quota Management

Vue 3 + TypeScript application for managing flight subscription quotas.

## Environment Configuration

This project uses environment variables for configuration. Copy `.env.example` to `.env.local` for local development:

```bash
cp .env.example .env.local
```

### Environment Files

- `.env.example` - Template with all available variables
- `.env.local` - Local development overrides (not committed)
- `.env.production` - Production defaults (committed)
- `.env.production.local` - Production overrides (not committed)

### Available Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | API base URL | `https://httpstat.us` |
| `VITE_DEV_TOOLS_ENABLED` | Enable development tools | `true` |
| `VITE_CONSOLE_LOGS_ENABLED` | Enable console logging | `true` |

> **Note:** Quota limits (0-3) are defined as constants in `src/constants/quota.ts`, not environment variables.

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Type checking
npm run type-check

# Build for production
npm run build
```

## Architecture

- **Constants**: Business rules and configuration in `src/constants/`
- **Components**: Reusable Vue components in `src/components/`
- **Stores**: Pinia state management in `src/stores/`
- **Services**: API clients and utilities in `src/services/`
- **Types**: TypeScript interfaces in `src/types/`