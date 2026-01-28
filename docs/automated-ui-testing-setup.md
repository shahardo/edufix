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
- Node.js 16+
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

#### package.json (Testing Scripts)
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --coverage --watchAll=false"
  }
}
```



#### jest.config.js
```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.json'
    }]
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.(ts|tsx|js|jsx)',
    '<rootDir>/src/**/*.(test|spec).(ts|tsx|js|jsx)'
  ],
  collectCoverageFrom: [
    'src/**/*.(ts|tsx)',
    '!src/main.tsx',
    '!src/vite-env.d.ts',
    '!src/**/*.d.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
};
```

#### src/setupTests.ts
```typescript
import '@testing-library/jest-dom';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
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
global.localStorage = localStorageMock;

// Mock window.location
delete (window as any).location;
window.location = {
  ...window.location,
  href: 'http://localhost:5173',
  pathname: '/',
  search: '',
  hash: '',
};

// Mock fetch
global.fetch = jest.fn();

// Mock React Router
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({
    pathname: '/',
    search: '',
    hash: '',
    state: null,
  }),
}));
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
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';
import { UserProvider } from '../../contexts/UserContext';

const renderHeader = (user: any = null) => {
  return render(
    <BrowserRouter>
      <UserProvider>
        <Header title="Test Dashboard" user={user} />
      </UserProvider>
    </BrowserRouter>
  );
};

describe('Header Component', () => {
  it('renders EduFix logo', () => {
    renderHeader();
    expect(screen.getByText('EduFix')).toBeInTheDocument();
  });

  it('shows user menu when authenticated', () => {
    const mockUser = {
      id: 1,
      username: 'student1',
      full_name: 'John Doe',
      role: 'student'
    };

    renderHeader(mockUser);
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
it('fetches dashboard data', async () => {
  // Mock API response
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve(mockDashboardData)
  });

  render(<StudentDashboard />);

  await waitFor(() => {
    expect(screen.getByText('Welcome back!')).toBeInTheDocument();
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
export const mockUsers = {
  student: {
    id: 1,
    username: 'student1',
    full_name: 'John Student',
    role: 'student'
  },
  teacher: {
    id: 2,
    username: 'teacher1',
    full_name: 'Jane Teacher',
    role: 'teacher'
  }
};

export const mockDashboardData = {
  active_classes_count: 4,
  completed_tasks_count: 23,
  average_grade: 87,
  current_streak: 5
};
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

This automated testing setup provides comprehensive coverage for the EduFix UI, ensuring reliable and maintainable code quality throughout development.
