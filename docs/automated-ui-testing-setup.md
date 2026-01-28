# Automated UI Testing Setup Guide

## Overview
This guide provides comprehensive setup and usage instructions for automated UI testing in the EduFix React application using Jest, React Testing Library, and Playwright for end-to-end testing.

## Testing Stack

### Unit & Integration Testing
- **Jest**: Test runner and assertion library
- **React Testing Library**: React component testing utilities
- **@testing-library/jest-dom**: Custom Jest matchers for DOM testing
- **User Event**: Simulates real user interactions

### End-to-End Testing (Future)
- **Playwright**: Cross-browser E2E testing framework

## Prerequisites

### System Requirements
- Node.js 18+
- npm or yarn
- Running backend server on `http://localhost:8000`
- Running frontend dev server on `http://localhost:5173`

### Demo Data
```json
{
  "students": [
    { "username": "student1", "password": "pass123", "role": "student" }
  ],
  "teachers": [
    { "username": "teacher1", "password": "pass123", "role": "teacher" }
  ],
  "managers": [
    { "username": "manager", "password": "pass123", "role": "manager" }
  ]
}
```

## 1. Installation & Setup

### Dependencies Installation
```bash
cd frontend/app

# Install testing dependencies
npm install --save-dev \
  @testing-library/jest-dom \
  @testing-library/react \
  @testing-library/user-event \
  @types/jest \
  jest \
  jest-environment-jsdom \
  jsdom \
  ts-jest \
  identity-obj-proxy
```

### Configuration Files

#### package.json (Testing Scripts and Jest Configuration)
```json
{
  "scripts": {
    "test": "node ./node_modules/jest/bin/jest.js",
    "test:watch": "node ./node_modules/jest/bin/jest.js --watch",
    "test:coverage": "node ./node_modules/jest/bin/jest.js --coverage",
    "test:ci": "node ./node_modules/jest/bin/jest.js --coverage --watchAll=false"
  },
  "jest": {
    "testEnvironment": "jsdom",
    "setupFilesAfterEnv": ["<rootDir>/src/setupTests.ts"],
    "moduleNameMapper": {
      "\\.(css|less|scss|sass)$": "identity-obj-proxy"
    },
    "transform": {
      "^.+\\.(ts|tsx)$": ["ts-jest", {
        "tsconfig": "<rootDir>/tsconfig.json"
      }]
    },
    "testMatch": [
      "<rootDir>/src/**/__tests__/**/*.(ts|tsx|js|jsx)",
      "<rootDir>/src/**/*.(test|spec).(ts|tsx|js|jsx)"
    ],
    "collectCoverageFrom": [
      "src/**/*.(ts|tsx)",
      "!src/main.tsx",
      "!src/vite-env.d.ts",
      "!src/**/*.d.ts"
    ],
    "coverageThreshold": {
      "global": {
        "branches": 70,
        "functions": 70,
        "lines": 70,
        "statements": 70
      }
    }
  }
}
```

#### src/setupTests.ts
```typescript
/// <reference types="jest" />

import '@testing-library/jest-dom';

// Polyfill TextEncoder for jsdom if not available
if (typeof globalThis.TextEncoder === 'undefined') {
  // Simple TextEncoder polyfill for jsdom
  (globalThis as any).TextEncoder = class TextEncoder {
    encode(input: string): Uint8Array {
      const utf8 = unescape(encodeURIComponent(input));
      const result = new Uint8Array(utf8.length);
      for (let i = 0; i < utf8.length; i++) {
        result[i] = utf8.charCodeAt(i);
      }
      return result;
    }
  };

  (globalThis as any).TextDecoder = class TextDecoder {
    decode(input: Uint8Array): string {
      const utf8 = String.fromCharCode(...Array.from(input));
      return decodeURIComponent(escape(utf8));
    }
  };
}

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
(globalThis as any).localStorage = localStorageMock;

// Mock window.location
delete (window as any).location;
(window as any).location = {
  href: 'http://localhost:5173',
  pathname: '/',
  search: '',
  hash: '',
  origin: 'http://localhost:5173',
  protocol: 'http:',
  host: 'localhost:5173',
  hostname: 'localhost',
  port: '5173',
  assign: jest.fn(),
  reload: jest.fn(),
  replace: jest.fn(),
};

// Mock fetch
(globalThis as any).fetch = jest.fn();
```

#### src/__mocks__/react-router-dom.ts
```typescript
// Mock for react-router-dom
import React from 'react';
const mockNavigate = jest.fn();

export const useNavigate = () => mockNavigate;
export const BrowserRouter = ({ children }: { children: React.ReactNode }) =>
  React.createElement('div', { 'data-testid': 'browser-router' }, children);
export const Routes = ({ children }: { children: React.ReactNode }) => children;
export const Route = () => null;
export const Link = ({ children, ...props }: any) =>
  React.createElement('a', props, children);
export const useLocation = () => ({
  pathname: '/',
  search: '',
  hash: '',
  state: null,
});
export const useParams = () => ({});
export const Navigate = () => null;

// Re-export the mock navigate function for tests
export { mockNavigate };
```

#### tsconfig.json (Add Jest Types)
```json
{
  "compilerOptions": {
    "types": ["vite/client", "@types/jest"]
  }
}
```

## 2. Writing Unit Tests

### Component Test Structure
```
src/
  components/
    shared/
      Header/
        Header.tsx
        Header.test.tsx
        __tests__/
          Header.integration.test.tsx
```

### Basic Component Test Example
```typescript
// src/components/shared/Header.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from './Header';
import { UserProvider, useUser } from '../../contexts/UserContext';

// Mock the UserContext
jest.mock('../../contexts/UserContext', () => ({
  UserProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="user-provider">{children}</div>,
  useUser: jest.fn(),
}));

// Mock react-router-dom completely
jest.mock('react-router-dom');

// Create a simple wrapper component for testing
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <div data-testid="test-wrapper">{children}</div>
);

const renderHeader = (title: string, user: any = null) => {
  return render(
    <TestWrapper>
      <UserProvider>
        <Header title={title} user={user} />
      </UserProvider>
    </TestWrapper>
  );
};

describe('Header Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Set up default mock for useUser
    (useUser as jest.Mock).mockReturnValue({
      user: null,
      logout: jest.fn(),
      setUser: jest.fn(),
      isLoading: false,
    });
  });

  it('renders EduFix logo and title', () => {
    renderHeader('Student Dashboard');
    expect(screen.getByText('EduFix')).toBeInTheDocument();
    expect(screen.getByText('Student Dashboard')).toBeInTheDocument();
  });

  it('renders language selector', () => {
    renderHeader('Student Dashboard');
    expect(screen.getByText('EN')).toBeInTheDocument();
  });

  it('renders user menu when user is provided', () => {
    const mockUser = {
      id: 1,
      username: 'student1',
      full_name: 'John Doe',
      email: 'john.doe@example.com',
      language: 'en',
      role: 'student',
    };

    renderHeader('Student Dashboard', mockUser);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
```

### Testing User Interactions
```typescript
it('toggles user dropdown menu', async () => {
  const user = userEvent.setup();
  const mockUser = { /* user data */ };

  renderHeader(mockUser);

  const userButton = screen.getByText('John Doe');
  await user.click(userButton);

  expect(screen.getByText('Logout')).toBeInTheDocument();
});
```

### Testing API Calls
```typescript
import { mockApiResponses, createMockFetchResponse } from '../test-utils/testData';

it('fetches and displays student dashboard data', async () => {
  // Mock API response using test utilities
  (global.fetch as jest.Mock).mockResolvedValueOnce(
    createMockFetchResponse(mockApiResponses.studentDashboard)
  );

  render(<StudentDashboard />);

  await waitFor(() => {
    expect(screen.getByText('4')).toBeInTheDocument(); // active_classes_count
    expect(screen.getByText('23')).toBeInTheDocument(); // completed_tasks_count
  });
});

it('handles API error gracefully', async () => {
  // Mock failed API response
  (global.fetch as jest.Mock).mockResolvedValueOnce(
    createMockFetchResponse(null, false)
  );

  render(<StudentDashboard />);

  await waitFor(() => {
    expect(screen.getByText(/error|failed/i)).toBeInTheDocument();
  });
});
```

## 3. Integration Testing

### Testing Component Interactions
```typescript
// Test Header + Footer interaction
describe('Header and Footer Integration', () => {
  it('maintains consistent user state', () => {
    const mockUser = { /* user data */ };

    render(
      <BrowserRouter>
        <UserProvider>
          <Header title="Dashboard" user={mockUser} />
          <Footer user={mockUser} />
        </UserProvider>
      </BrowserRouter>
    );

    // Test that both components show user info consistently
    expect(screen.getAllByText('John Doe')).toHaveLength(2);
  });
});
```

### Testing Context Providers
```typescript
describe('UserContext Integration', () => {
  it('provides user data to child components', () => {
    const mockUser = { /* user data */ };

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    // Test component receives user data
    expect(screen.getByText(mockUser.full_name)).toBeInTheDocument();
  });
});
```

## 4. End-to-End Testing (Future Setup)

### Playwright Setup
```bash
# Install Playwright
npm install --save-dev @playwright/test

# Install browsers
npx playwright install
```

### E2E Test Example
```typescript
// e2e/login.spec.ts
import { test, expect } from '@playwright/test';

test('student login flow', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Fill login form
  await page.fill('[name="username"]', 'student1');
  await page.fill('[name="password"]', 'pass123');
  await page.click('button[type="submit"]');

  // Verify redirect
  await expect(page).toHaveURL(/\/student/);
  await expect(page.locator('text=Student Dashboard')).toBeVisible();
});
```

## 5. Running Tests

### Unit Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Run specific test file
npm test Header.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="renders logo"
```

### Integration Tests
```bash
# Run all integration tests
npm test -- --testPathPattern=integration

# Run with verbose output
npm test -- --verbose
```

### E2E Tests (Future)
```bash
# Run E2E tests
npx playwright test

# Run in headed mode (visible browser)
npx playwright test --headed

# Run specific test
npx playwright test login.spec.ts
```

## 6. Test Organization

### File Naming Conventions
```
ComponentName.test.tsx          # Unit tests
ComponentName.spec.tsx          # Integration tests
__tests__/ComponentName.test.tsx # Alternative structure
e2e/login.spec.ts              # E2E tests
```

### Test Categories
- **Unit Tests**: Individual component/function testing
- **Integration Tests**: Component interaction testing
- **E2E Tests**: Complete user workflow testing

### Test Data Management
```typescript
// src/test-utils/testData.ts
import type { User } from '../types/api';

export const mockUsers = {
  student: {
    id: 1,
    username: 'student1',
    full_name: 'John Student',
    role: 'student' as const,
    email: 'john.student@edufix.com'
  },
  teacher: {
    id: 2,
    username: 'teacher1',
    full_name: 'Jane Teacher',
    role: 'teacher' as const,
    email: 'jane.teacher@edufix.com'
  },
  manager: {
    id: 3,
    username: 'manager',
    full_name: 'Bob Manager',
    role: 'manager' as const,
    email: 'bob.manager@edufix.com'
  }
};

export const mockApiResponses = {
  studentDashboard: {
    active_classes_count: 4,
    completed_tasks_count: 23,
    average_grade: 87,
    current_streak: 5,
    classes: [
      {
        id: 1,
        name: 'Chemistry 101',
        teacher_name: 'Dr. Smith',
        grade: 85
      },
      {
        id: 2,
        name: 'Physics 101',
        teacher_name: 'Prof. Johnson',
        grade: 90
      }
    ],
    recent_activity: [
      {
        id: 1,
        description: 'Completed Chemistry quiz',
        timestamp: '2024-01-15T10:30:00Z',
        details: 'Score: 88%'
      },
      {
        id: 2,
        description: 'Submitted Physics homework',
        timestamp: '2024-01-14T15:45:00Z',
        details: 'On time submission'
      }
    ],
    upcoming_assignments: [
      {
        id: 1,
        title: 'Biology Lab Report',
        course_name: 'Biology 101',
        due_date: '2024-01-20T23:59:00Z'
      },
      {
        id: 2,
        title: 'Math Problem Set',
        course_name: 'Calculus I',
        due_date: '2024-01-18T23:59:00Z'
      }
    ]
  },

  teacherDashboard: {
    total_students: 26,
    completion_rate: 92,
    average_mastery_score: 78,
    active_students_today: 24,
    classes: [
      { id: 1, name: 'Chemistry 10B', studentCount: 26 },
      { id: 2, name: 'Physics 10A', studentCount: 24 }
    ]
  },

  managerDashboard: {
    total_teachers: 8,
    total_students: 245,
    total_classes: 12,
    total_lessons: 156,
    teachers: [
      {
        id: 1,
        full_name: 'Dr. Smith',
        email: 'smith@edufix.com',
        class_count: 3,
        student_count: 78
      }
    ]
  }
};

export const mockLocalStorageData = {
  token: 'mock-jwt-token-12345',
  user: JSON.stringify(mockUsers.student)
};

export const createMockFetchResponse = (data: any, ok = true) => ({
  ok,
  json: () => Promise.resolve(data),
  text: () => Promise.resolve(JSON.stringify(data)),
  status: ok ? 200 : 500,
  statusText: ok ? 'OK' : 'Internal Server Error'
});
```

## 7. CI/CD Integration

### GitHub Actions Example
```yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:ci
      - run: npm run build
```

### Coverage Reporting
```bash
# Upload coverage to Codecov
npm install --save-dev codecov
codecov
```

## 8. Best Practices

### Test Writing Guidelines
- **Descriptive test names**: `it('shows error message when login fails')`
- **Arrange-Act-Assert pattern**: Setup → Action → Assertion
- **Avoid implementation details**: Test behavior, not implementation
- **Mock external dependencies**: API calls, router, localStorage
- **Test user interactions**: Use user-event over fireEvent

### Code Coverage Goals
- **Statements**: 70%
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%

### Performance Considerations
- **Fast test execution**: < 10 seconds for unit tests
- **Parallel execution**: Run tests in parallel
- **Selective testing**: Only run affected tests in CI

## 9. Debugging Tests

### Common Issues
```typescript
// Fix async tests
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});

// Debug test failures
screen.debug(); // Print DOM structure
console.log(prettyDOM(element)); // Print specific element
```

### Test Debugging Commands
```bash
# Run tests with debug info
npm test -- --verbose

# Run single failing test
npm test -- --testNamePattern="failing test name"

# Update snapshots
npm test -- --updateSnapshot
```

## 10. Maintenance

### Regular Tasks
- **Update test dependencies**: Monthly dependency updates
- **Review test coverage**: Ensure coverage goals are met
- **Update test data**: Keep mock data in sync with API changes
- **Clean up obsolete tests**: Remove tests for deleted features

### Test Health Metrics
- **Test execution time**: < 5 minutes for full suite
- **Flaky test rate**: < 1% of tests
- **Coverage maintenance**: No significant drops
- **CI build success rate**: > 95%

## Additional Resources

- **Quick Start Guide**: See `TESTING.md` in the frontend/app directory for a concise testing quick start guide
- **React Testing Library**: https://testing-library.com/docs/react-testing-library/intro/
- **Jest Documentation**: https://jestjs.io/docs/getting-started
- **Playwright** (E2E): https://playwright.dev/

This automated testing setup provides comprehensive coverage for the EduFix UI, ensuring reliable and maintainable code quality throughout development.
