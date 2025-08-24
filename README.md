# Caravelo Flight Quota Management

> Vue 3 + TypeScript application implementing a modal-based quota management interface for airline back office operations.

### Current Status: 🚧 Development Phase (~80% Complete)

**✅ Implemented:**

- ✅ Core quota adjustment form with validation
- ✅ Business rule enforcement (0-3 quota limits)
- ✅ Context-sensitive reason selection
- ✅ Comprehensive unit test coverage
- ✅ TypeScript strict mode with full type safety
- ✅ Modern Vue 3 Composition API architecture

## 🏗️ Architecture & Project Structure

This project follows a **feature-based modular architecture** with clean separation of concerns:

```
src/
├── app/                    # Application bootstrap
│   ├── main.ts             # Vue app entry point
│   ├── App.vue             # Root component
│   └── plugins/            # Vue plugins (Vuetify)
├── features/               # Feature modules (domain-driven)
│   ├── quota-management/   # 🎯 CORE FEATURE - PRD implementation
│   │   ├── components/     # UI components
│   │   │   ├── QuotaManageForm/    # Main quota form
│   │   │   │   ├── QuotaManageForm.vue
│   │   │   │   └── composables/useQuotaManagement.ts
│   │   │   └── SimpleQuotaModal/   # Modal wrapper
│   │   ├── composables/    # Business logic (Vue composables)
│   │   ├── constants/      # Business rules & reason codes
│   │   │   ├── quota.ts    # MIN_QUOTA=0, MAX_QUOTA=3
│   │   │   └── reasons.ts  # Predefined reason options
│   │   ├── services/       # API integration layer
│   │   ├── types/          # TypeScript definitions
│   │   └── __tests__/      # Unit tests (Vitest + Vue Test Utils)
│   ├── subscriber-management/  # Related feature
│   └── back-office/        # Host platform integration
├── shared/                 # Cross-feature utilities
│   ├── components/         # Reusable UI components
│   ├── services/api/       # HTTP client & base services
│   ├── constants/          # Global constants
│   ├── types/              # Shared TypeScript interfaces
│   └── utils/              # Helper functions & configuration
└── router/                 # Vue Router (future expansion)
```

### 🎨 Design Patterns

- **Composition API**: Modern Vue 3 patterns with `<script setup>`
- **Business Logic Separation**: Composables handle all business logic
- **Feature Modules**: Each domain has its own self-contained module
- **Clean Architecture**: Components → Composables → Services → API
- **Type Safety**: Strict TypeScript with no `any` types

## 🔗 API Integration & Mocked Data

### Current API Setup (Development)

**⚠️ Using Test API Endpoints:**

```typescript
// src/shared/constants/api.ts
export const API_ENDPOINTS = {
  QUOTA: {
    ADJUST: '/200' // Points to httpstat.us test service
  }
}
```

**Mock Data Sources:**

1. **API Endpoints**: Using `https://httpstat.us` for testing HTTP responses
2. **Business Rules**: Hard-coded constants in `src/features/quota-management/constants/`
3. **Reason Codes**: Predefined options
4. **Subscriber Data**: Currently mocked in components (needs backend integration)

**API Service Layer** (`src/features/quota-management/services/managementApi.ts`):

```typescript
class QuotaService {
  async adjustQuota(
    adjustment: QuotaAdjustment
  ): Promise<QuotaAdjustmentResponse>
  // Currently hits test endpoint, ready for production API integration
}
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Modern browser with ES6 support

### Installation & Setup

```bash
# 1. Clone and install dependencies
git clone <repository-url>
cd caravelo
npm install

# 2. Environment setup (optional - has sensible defaults)
cp .env.example .env.local
# Edit .env.local if needed

# 3. Start development server
npm run dev
# 🚀 App runs on http://localhost:3000

# 4. Verify setup with tests
npm test
```

### 🛠️ Development Workflow

```bash
# Development
npm run dev                    # Start dev server with HMR
npm run dev --host            # Expose on network for testing

# Code Quality
npm run type-check            # TypeScript validation
npm run lint                  # ESLint checking
npm run format                # Prettier code formatting

# Testing
npm test                      # Run unit tests
npm run test:watch            # Interactive test mode
npm run test:coverage         # Generate coverage report

# Build
npm run build                 # Production build
npm run preview              # Preview production build
```

## 🧪 Testing Strategy

### Current Test Coverage

**Unit Tests** (Vitest + Vue Test Utils):

- ✅ `useQuotaManagement.test.ts` - Form state management
- ✅ `useQuotaCalculations.test.ts` - Business logic validation
- ✅ `useQuotaSubmission.test.ts` - API integration logic
- ✅ `useQuotaForm.test.ts` - Quota form integration logic

**E2E Tests** (Playwright):

- ✅ `quota-management.spec.ts` - Complete quota management workflow
  - Opens subscriber modal
  - Adjusts quota values using NumberStepper
  - Selects adjustment reasons
  - Submits changes and verifies success
  - Tests form validation
  - Tests quota limits and cancellation

**Test Patterns:**

```typescript
// Unit test structure
describe('useQuotaManagement', () => {
  it('validates quota limits correctly', () => {
    // Test MIN_QUOTA=0, MAX_QUOTA=3 enforcement
  })

  it('shows context-sensitive reason options', () => {
    // Test different reasons for add vs subtract operations
  })
})

// E2E test structure
describe('Quota Management E2E', () => {
  test('should complete full quota management workflow', async ({ page }) => {
    // Navigate → Click "Edit flights" → Adjust quota → Select reason → Submit
  })
})
```

**Testing Commands:**

```bash
# Unit Tests
npm test                      # Run all unit tests
npm run test:watch           # Watch mode for development
npm run test:coverage        # Generate HTML coverage report

# E2E Tests
npm run test:e2e             # Run E2E tests
npm run test:e2e:ui          # Run E2E tests with UI
npm run test:e2e:debug       # Debug E2E tests
```

## 🔧 Configuration & Environment

### Environment Variables

| Variable            | Description  | Default               | Required |
| ------------------- | ------------ | --------------------- | -------- |
| `VITE_API_BASE_URL` | API base URL | `https://httpstat.us` | Yes      |

### TypeScript Configuration

**Strict Mode Enabled:**

- `"strict": true`
- `"noUnusedLocals": true`
- `"noUnusedParameters": true`
- `"noImplicitReturns": true`

**Path Aliases** (for clean imports):

```typescript
// Available import shortcuts
import { QuotaForm } from '@quota/components/QuotaManageForm'
import { httpClient } from '@shared/services/api/httpClient'
import { BackOffice } from '@back-office/views/BackOffice'
```

## 🔧 Technology Stack

| Category        | Technology | Version | Purpose                              |
| --------------- | ---------- | ------- | ------------------------------------ |
| **Framework**   | Vue.js     | 3.5.18  | Reactive frontend framework          |
| **Language**    | TypeScript | 5.9.2   | Type safety and developer experience |
| **UI Library**  | Vuetify    | 3.9.5   | Material Design components           |
| **Build Tool**  | Vite       | 5.4.19  | Fast development and building        |
| **HTTP Client** | Axios      | 1.11.0  | API communication                    |
| **State Mgmt**  | Pinia      | 2.3.1   | Centralized state (future use)       |
| **Testing**     | Vitest     | 3.2.4   | Fast unit testing                    |
| **E2E Testing** | Playwright | 1.55.0  | End-to-end testing framework         |
| **Linting**     | ESLint     | 9.33.0  | Code quality enforcement             |
| **Formatting**  | Prettier   | 3.6.2   | Code formatting consistency          |
