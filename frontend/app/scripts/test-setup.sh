#!/bin/bash

# Automated UI Testing Setup Script for EduFix
# This script sets up and runs automated tests for the React frontend

echo "🚀 Setting up automated UI testing for EduFix..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this script from the frontend/app directory"
    exit 1
fi

echo "📦 Installing testing dependencies..."

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

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create Jest configuration
cat > jest.config.js << 'EOF'
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
EOF

echo "⚙️  Jest configuration created"

# Create setupTests.ts if it doesn't exist
if [ ! -f "src/setupTests.ts" ]; then
    cat > src/setupTests.ts << 'EOF'
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
EOF
    echo "🔧 Test setup file created"
fi

# Update tsconfig.json to include Jest types
if ! grep -q "@types/jest" tsconfig.json; then
    # Use sed to add Jest types to the types array
    sed -i 's/"types": \["vite\/client"\]/"types": ["vite\/client", "@types\/jest"]/' tsconfig.json
    echo "📝 TypeScript configuration updated"
fi

echo "🎯 Running initial test suite..."

# Run tests
npm test -- --passWithNoTests

if [ $? -eq 0 ]; then
    echo "✅ Test setup completed successfully!"
    echo ""
    echo "📊 Available test commands:"
    echo "  npm test              # Run all tests"
    echo "  npm run test:watch    # Run tests in watch mode"
    echo "  npm run test:coverage # Run tests with coverage report"
    echo ""
    echo "📁 Test files should be placed in:"
    echo "  src/**/*.test.tsx     # Component tests"
    echo "  src/**/*.spec.tsx     # Integration tests"
    echo "  src/**/__tests__/**   # Alternative directory structure"
    echo ""
    echo "📖 See docs/automated-ui-testing-setup.md for detailed usage"
else
    echo "❌ Test setup failed. Check the error messages above."
    exit 1
fi
