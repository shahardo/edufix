# EduFix UI Testing Quick Start

## 🚀 Getting Started with Automated Testing

This guide helps you set up and run automated tests for the EduFix React frontend.

## Prerequisites

- ✅ Node.js 16+
- ✅ Backend running on `http://localhost:8000`
- ✅ Frontend dev server on `http://localhost:5173`

## Quick Setup (Windows)

1. **Install Dependencies**
   ```bash
   cd frontend/app
   npm install
   ```

2. **Run Tests**
   ```bash
   # Run all tests (choose your preferred script)
   npm test
   npm run test:watch
   npm run test:coverage

   # Or use the provided scripts:
   .\scripts\test-runner.bat
   .\scripts\test-runner.ps1
   ```

## Configuration Files

- **`jest.config.js`**: Jest configuration with React Testing Library setup
- **`src/setupTests.ts`**: Global test setup with mocks and utilities
- **`tsconfig.json`**: TypeScript configuration with Jest types
- **`src/test-utils/testData.ts`**: Mock data and test utilities

## Test Structure

```
src/
├── components/
│   ├── shared/
│   │   ├── Header.test.tsx     # Component unit tests
│   │   └── Footer.test.tsx
│   ├── StudentDashboard.test.tsx
│   └── TeacherDashboard.test.tsx
├── contexts/
│   └── UserContext.test.tsx    # Context tests
├── utils/
│   └── formatters.test.ts      # Utility function tests
└── __tests__/
    └── integration/            # Integration tests
        └── auth-flow.test.tsx
```

## Writing Your First Test

### Component Test Example
```typescript
// src/components/shared/MyComponent.test.tsx
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('handles user interactions', async () => {
    const user = userEvent.setup();
    render(<MyComponent />);

    await user.click(screen.getByRole('button'));
    expect(screen.getByText('Clicked!')).toBeInTheDocument();
  });
});
```

### API Integration Test Example
```typescript
describe('Dashboard Data Loading', () => {
  it('fetches and displays dashboard data', async () => {
    // Mock API response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        active_classes_count: 4,
        completed_tasks_count: 23
      })
    });

    render(<StudentDashboard />);

    await waitFor(() => {
      expect(screen.getByText('4')).toBeInTheDocument();
    });
  });
});
```

## Test Categories

### 🧩 Unit Tests
- Individual component testing
- Utility function testing
- Custom hook testing
- **Goal**: 70%+ code coverage

### 🔗 Integration Tests
- Component interaction testing
- Context provider testing
- API integration testing
- **Location**: `src/__tests__/integration/`

### 🌐 End-to-End Tests (Future)
- Complete user workflow testing
- Cross-browser compatibility
- **Tools**: Playwright or Cypress

## Common Test Patterns

### Testing User Authentication
```typescript
const renderWithAuth = (component: React.ReactElement, user?: User) => {
  return render(
    <BrowserRouter>
      <UserProvider>
        {component}
      </UserProvider>
    </BrowserRouter>
  );
};
```

### Testing API Calls
```typescript
beforeEach(() => {
  (global.fetch as jest.Mock).mockClear();
});

it('calls correct API endpoint', async () => {
  render(<MyComponent />);

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8000/api/some-endpoint'
    );
  });
});
```

### Testing Error States
```typescript
it('shows error message on API failure', async () => {
  (global.fetch as jest.Mock).mockRejectedValueOnce(
    new Error('API Error')
  );

  render(<MyComponent />);

  await waitFor(() => {
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });
});
```

## Mock Data

### Test Users
```typescript
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
  },
  manager: {
    id: 3,
    username: 'manager',
    full_name: 'Bob Manager',
    role: 'manager'
  }
};
```

### API Responses
```typescript
export const mockApiResponses = {
  dashboard: {
    active_classes_count: 4,
    completed_tasks_count: 23,
    average_grade: 87,
    current_streak: 5
  },
  classes: [
    { id: 1, name: 'Chemistry 101', teacher_name: 'Dr. Smith' }
  ]
};
```

## Debugging Tests

### Common Issues & Solutions

1. **Async Test Timeouts**
   ```typescript
   // Use waitFor for async operations
   await waitFor(() => {
     expect(screen.getByText('Loaded')).toBeInTheDocument();
   }, { timeout: 3000 });
   ```

2. **Mock Setup Issues**
   ```typescript
   // Reset mocks between tests
   beforeEach(() => {
     jest.clearAllMocks();
     (global.fetch as jest.Mock).mockClear();
   });
   ```

3. **Component Context Issues**
   ```typescript
   // Wrap components with required providers
   render(
     <BrowserRouter>
       <UserProvider>
         <MyComponent />
       </UserProvider>
     </BrowserRouter>
   );
   ```

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Test Frontend
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd frontend/app && npm ci
      - run: cd frontend/app && npm run test:ci
```

## Performance Goals

- **Test Execution**: < 5 minutes for full suite
- **Code Coverage**: > 70% across all metrics
- **CI Build Time**: < 10 minutes
- **Flaky Tests**: < 1% failure rate

## Next Steps

1. **Run existing tests**: `.\scripts\test-runner.bat`
2. **Add new component tests**: Follow the examples above
3. **Set up integration tests**: Test complete user workflows
4. **Configure E2E testing**: Add Playwright for full browser testing
5. **Monitor coverage**: Ensure coverage goals are met

## Resources

- 📖 **Detailed Guide**: `docs/automated-ui-testing-setup.md`
- 🧪 **React Testing Library**: https://testing-library.com/docs/react-testing-library/intro/
- 🎯 **Jest Documentation**: https://jestjs.io/docs/getting-started
- 🎭 **Playwright** (E2E): https://playwright.dev/

---

Happy Testing! 🚀
