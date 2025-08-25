# Caravelo Flight Quota Management

> Vue 3 + TypeScript application implementing a modal-based quota management interface for airline back office operations.

**✅ Recently Completed:**

- ✅ Core quota adjustment form with validation
- ✅ Business rule enforcement (0-3 quota limits)
- ✅ Context-sensitive reason selection
- ✅ Comprehensive unit test coverage (94 tests passing)
- ✅ TypeScript strict mode with full type safety
- ✅ Modern Vue 3 Composition API architecture
- ✅ Notification system with smooth animations
- ✅ Error handling and user feedback
- ✅ API service layer with comprehensive documentation
- ✅ Store management with Pinia integration

## 🏗️ Architecture & Project Structure

This project follows a **feature-based modular architecture** with clean separation of concerns:

```
src/
├── app/                    # Application bootstrap
│   ├── main.ts             # Vue app entry point
│   ├── App.vue             # Root component
│   └── plugins/            # Vue plugins (Vuetify)
├── features/               # Feature modules (domain-driven)
│   ├── quota-management/   # 🎯 CORE FEATURE - Quota management system
│   │   ├── components/     # UI components
│   │   │   └── ManageQuotaModal/   # Main quota management modal
│   │   │       └── ManageQuotaModal.vue
│   │   ├── composables/    # Business logic (Vue composables)
│   │   │   ├── useQuotaCalculations.ts  # Quota validation logic
│   │   │   ├── useQuotaManagement.ts    # Form state management
│   │   │   ├── useQuotaModal.ts         # Modal state management
│   │   │   └── useQuotaSubmission.ts    # API submission handling
│   │   ├── constants/      # Business rules & reason codes
│   │   │   ├── quota.ts    # MIN_QUOTA=0, MAX_QUOTA=3
│   │   │   └── reasons.ts  # Predefined reason options
│   │   ├── services/       # API integration layer
│   │   │   └── managementApi.ts         # Quota API service
│   │   ├── types/          # TypeScript definitions
│   │   └── __tests__/      # Unit tests (Vitest + Vue Test Utils)
│   ├── subscriber-management/  # Subscriber data management
│   │   ├── components/     # Subscriber UI components
│   │   │   ├── SubscriberCard.vue       # Individual subscriber display
│   │   │   └── SubscribersList.vue      # Subscribers list
│   │   ├── stores/         # Pinia state management
│   │   │   └── subscribers.ts           # Subscriber store
│   │   └── types/          # Subscriber type definitions
│   └── back-office/        # Host platform integration
├── shared/                 # Cross-feature utilities
│   ├── components/         # Reusable UI components
│   │   ├── NumberStepper/  # Custom number input component
│   │   ├── NotificationBar.vue          # Global notification system
│   │   ├── Modal.vue                    # Base modal component
│   │   └── ErrorAlert/     # Error display components
│   ├── services/api/       # HTTP client & base services
│   ├── stores/             # Global state management
│   │   └── notifications.ts             # Notification store
│   ├── constants/          # Global constants
│   ├── types/              # Shared TypeScript interfaces
│   └── composables/        # Shared composables
└── router/                 # Vue Router (future expansion)
```

### 🎨 Design Patterns & Architecture Decisions

**Vue 3 Modern Patterns:**

- **Composition API**: All components use `<script setup>` syntax
- **Composables**: Business logic extracted into reusable composables
- **Reactivity**: Vue 3 reactivity system with `ref()` and `computed()`
- **TypeScript Integration**: Full type safety with generic composables

**State Management:**

- **Pinia**: Modern Vue state management for global state
- **Local State**: Component-specific state in composables
- **Store Modules**: Feature-specific stores (notifications, subscribers)

**Component Architecture:**

- **Feature Modules**: Self-contained domains with clear boundaries
- **Clean Architecture**: Components → Composables → Services → API
- **Separation of Concerns**: UI logic separate from business logic
- **Type Safety**: Strict TypeScript with comprehensive interfaces

**Error Handling & UX:**

- **Global Notifications**: Centralized user feedback system
- **Form Validation**: Real-time validation with user-friendly messages
- **Loading States**: Consistent loading indicators and states
- **Error Recovery**: Graceful error handling with retry mechanisms

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

### Current Test Coverage: 94 Tests Passing ✅

**Unit Tests** (Vitest + Vue Test Utils):

**Core Quota Management (60 tests):**

- ✅ `useQuotaManagement.test.ts` (27 tests) - Form state management & validation
- ✅ `useQuotaCalculations.test.ts` (20 tests) - Business logic validation
- ✅ `useQuotaSubmission.test.ts` (5 tests) - API integration logic
- ✅ `useQuotaModal.test.ts` (8 tests) - Modal state management

**Shared Components (34 tests):**

- ✅ `useNumberStepper.test.ts` (34 tests) - Number stepper component logic

**Testing Commands:**

```bash
# Unit Tests
npm test                      # Run all unit tests
npm run test:watch           # Watch mode for development
npm run test:coverage        # Generate HTML coverage report
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
| **Linting**     | ESLint     | 9.33.0  | Code quality enforcement             |
| **Formatting**  | Prettier   | 3.6.2   | Code formatting consistency          |
