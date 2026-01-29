import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Login from '../components/Login';
import { UserProvider, useUser } from '../contexts/UserContext';
import { mockUsers, createMockFetchResponse } from '../fixtures/testData.fixture';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock fetch
Object.defineProperty(window, 'fetch', {
  value: jest.fn(),
  writable: true,
});

// Mock the UserContext
jest.mock('../contexts/UserContext', () => ({
  UserProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="user-provider">{children}</div>,
  useUser: jest.fn(),
}));

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const renderLogin = () => {
  return render(
    <BrowserRouter>
      <UserProvider>
        <Login />
      </UserProvider>
    </BrowserRouter>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Set up default mock for useUser
    (useUser as jest.Mock).mockReturnValue({
      user: null,
      setUser: jest.fn(),
      logout: jest.fn(),
      isLoading: false,
    });
  });

  describe('UI Rendering', () => {
    it('renders EduFix logo and welcome message', () => {
      renderLogin();
      expect(screen.getByText('Welcome to EduFix')).toBeInTheDocument();
      expect(screen.getByText('Adaptive learning platform for the classroom')).toBeInTheDocument();
    });

    it('renders login form with all required fields', () => {
      renderLogin();
      expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByLabelText('Remember me')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('renders demo credentials section', () => {
      renderLogin();
      expect(screen.getByText('Demo Credentials:')).toBeInTheDocument();
      expect(screen.getByText('Manager:')).toBeInTheDocument();
      expect(screen.getByText('manager / pass123')).toBeInTheDocument();
      expect(screen.getByText('Teacher:')).toBeInTheDocument();
      expect(screen.getByText('teacher1 / pass123')).toBeInTheDocument();
      expect(screen.getByText('Student:')).toBeInTheDocument();
      expect(screen.getByText('student1 / pass123')).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('renders form fields correctly', () => {
      renderLogin();

      expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });
  });

  describe('Authentication Flow - Student Login', () => {
    it('successfully logs in student and redirects to student dashboard', async () => {
      const user = userEvent.setup();
      const mockSetUser = jest.fn();

      // Mock successful API responses
      (window.fetch as jest.Mock)
        .mockResolvedValueOnce(createMockFetchResponse({ access_token: 'mock-token' }))
        .mockResolvedValueOnce(createMockFetchResponse(mockUsers.student));

      // Mock setUser
      (useUser as jest.Mock).mockReturnValue({
        user: null,
        setUser: mockSetUser,
        logout: jest.fn(),
        isLoading: false,
      });

      renderLogin();

      // Fill form
      const usernameInput = screen.getByLabelText(/username/i);
      const passwordInput = screen.getByLabelText(/password/i);
      await user.type(usernameInput, 'student1');
      await user.type(passwordInput, 'pass123');

      // Submit form
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(submitButton);

      // Verify API calls
      await waitFor(() => {
        expect(window.fetch).toHaveBeenCalledWith('http://localhost:8000/auth/token', expect.any(Object));
        expect(window.fetch).toHaveBeenCalledWith('http://localhost:8000/auth/users/me', expect.any(Object));
      });

      // Verify localStorage storage
      expect(window.localStorage.setItem).toHaveBeenCalledWith('token', 'mock-token');
      expect(window.localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockUsers.student));

      // Verify navigation and user context update
      expect(mockSetUser).toHaveBeenCalledWith(mockUsers.student);
      expect(mockNavigate).toHaveBeenCalledWith('/student');
    });
  });

  describe('Authentication Flow - Teacher Login', () => {
    it('successfully logs in teacher and redirects to teacher dashboard', async () => {
      const user = userEvent.setup();
      const mockSetUser = jest.fn();

      // Mock successful API responses
      (window.fetch as jest.Mock)
        .mockResolvedValueOnce(createMockFetchResponse({ access_token: 'mock-token' }))
        .mockResolvedValueOnce(createMockFetchResponse(mockUsers.teacher));

      // Mock setUser
      (useUser as jest.Mock).mockReturnValue({
        user: null,
        setUser: mockSetUser,
        logout: jest.fn(),
        isLoading: false,
      });

      renderLogin();

      // Fill form
      const usernameInput = screen.getByLabelText(/username/i);
      const passwordInput = screen.getByLabelText(/password/i);
      await user.type(usernameInput, 'teacher1');
      await user.type(passwordInput, 'pass123');

      // Submit form
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(submitButton);

      // Verify navigation to teacher dashboard
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/teacher');
      });
    });
  });

  describe('Authentication Flow - Manager Login', () => {
    it('successfully logs in manager and redirects to manager dashboard', async () => {
      const user = userEvent.setup();
      const mockSetUser = jest.fn();

      // Mock successful API responses
      (window.fetch as jest.Mock)
        .mockResolvedValueOnce(createMockFetchResponse({ access_token: 'mock-token' }))
        .mockResolvedValueOnce(createMockFetchResponse(mockUsers.manager));

      // Mock setUser
      (useUser as jest.Mock).mockReturnValue({
        user: null,
        setUser: mockSetUser,
        logout: jest.fn(),
        isLoading: false,
      });

      renderLogin();

      // Fill form
      const usernameInput = screen.getByLabelText(/username/i);
      const passwordInput = screen.getByLabelText(/password/i);
      await user.type(usernameInput, 'manager');
      await user.type(passwordInput, 'pass123');

      // Submit form
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(submitButton);

      // Verify navigation to manager dashboard
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/manager');
      });
    });
  });

  describe('Error Handling', () => {
    it('shows error message for invalid credentials', async () => {
      const user = userEvent.setup();

      // Mock failed authentication
      (window.fetch as jest.Mock).mockResolvedValueOnce(
        createMockFetchResponse({ detail: 'Invalid credentials' }, false)
      );

      renderLogin();

      // Fill form with invalid credentials
      const usernameInput = screen.getByLabelText(/username/i);
      const passwordInput = screen.getByLabelText(/password/i);
      await user.type(usernameInput, 'invalid');
      await user.type(passwordInput, 'wrongpass');

      // Submit form
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(submitButton);

      // Verify error message
      await waitFor(() => {
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
      });
    });

    it('shows network error message', async () => {
      const user = userEvent.setup();

      // Mock network error
      (window.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      renderLogin();

      // Fill form
      const usernameInput = screen.getByLabelText(/username/i);
      const passwordInput = screen.getByLabelText(/password/i);
      await user.type(usernameInput, 'student1');
      await user.type(passwordInput, 'pass123');

      // Submit form
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(submitButton);

      // Verify error message
      await waitFor(() => {
        expect(screen.getByText('Network error. Please try again later.')).toBeInTheDocument();
      });
    });

    it('shows error for invalid user role', async () => {
      const user = userEvent.setup();

      // Mock user with invalid role
      const invalidUser = { ...mockUsers.student, role: 'invalid' as any };
      (window.fetch as jest.Mock)
        .mockResolvedValueOnce(createMockFetchResponse({ access_token: 'mock-token' }))
        .mockResolvedValueOnce(createMockFetchResponse(invalidUser));

      renderLogin();

      // Fill form
      const usernameInput = screen.getByLabelText(/username/i);
      const passwordInput = screen.getByLabelText(/password/i);
      await user.type(usernameInput, 'student1');
      await user.type(passwordInput, 'pass123');

      // Submit form
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(submitButton);

      // Verify error message
      await waitFor(() => {
        expect(screen.getByText('Invalid user role. Please contact administrator.')).toBeInTheDocument();
      });
    });
  });

  describe('Loading States', () => {
    it('shows loading state during submission', async () => {
      const user = userEvent.setup();

      // Mock slow API response
      (window.fetch as jest.Mock)
        .mockImplementationOnce(() => new Promise(resolve =>
          setTimeout(() => resolve(createMockFetchResponse({ access_token: 'mock-token' })), 100)
        ));

      renderLogin();

      // Fill form
      const usernameInput = screen.getByLabelText(/username/i);
      const passwordInput = screen.getByLabelText(/password/i);
      await user.type(usernameInput, 'student1');
      await user.type(passwordInput, 'pass123');

      // Submit form
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(submitButton);

      // Verify loading state
      expect(screen.getByText('Signing in...')).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });
  });
});
