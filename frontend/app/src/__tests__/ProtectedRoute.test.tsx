import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProtectedRoute from '../components/shared/ProtectedRoute';
import { UserProvider, useUser } from '../contexts/UserContext';
import { mockUsers } from '../fixtures/testData.fixture';

// Mock the UserContext
jest.mock('../contexts/UserContext', () => ({
  UserProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="user-provider">{children}</div>,
  useUser: jest.fn(),
}));

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Navigate: ({ to }: { to: string }) => <div data-testid={`navigate-${to}`} />,
  useLocation: () => ({ pathname: '/test' }),
}));

const renderProtectedRoute = (props: { children: React.ReactNode; requiredRole?: 'student' | 'teacher' | 'manager' }) => {
  return render(
    <BrowserRouter>
      <UserProvider>
        <ProtectedRoute {...props} />
      </UserProvider>
    </BrowserRouter>
  );
};

describe('ProtectedRoute Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading State', () => {
    it('shows loading spinner when authentication is loading', () => {
      (useUser as jest.Mock).mockReturnValue({
        user: null,
        isLoading: true,
        logout: jest.fn(),
      });

      renderProtectedRoute({ children: <div>Protected Content</div> });

      expect(screen.getByText('Checking authentication...')).toBeInTheDocument();
    });
  });

  describe('Unauthenticated User', () => {
    it('redirects to login when user is not authenticated', () => {
      (useUser as jest.Mock).mockReturnValue({
        user: null,
        isLoading: false,
        logout: jest.fn(),
      });

      renderProtectedRoute({ children: <div>Protected Content</div> });

      expect(screen.getByTestId('navigate-/')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });
  });

  describe('Authenticated User - No Role Required', () => {
    it('renders children when user is authenticated and no role is required', () => {
      (useUser as jest.Mock).mockReturnValue({
        user: mockUsers.student,
        isLoading: false,
        logout: jest.fn(),
      });

      renderProtectedRoute({ children: <div>Protected Content</div> });

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
      expect(screen.queryByTestId(/navigate/)).not.toBeInTheDocument();
    });
  });

  describe('Role-Based Access Control - Student Routes', () => {
    it('allows student to access student routes', () => {
      (useUser as jest.Mock).mockReturnValue({
        user: mockUsers.student,
        isLoading: false,
        logout: jest.fn(),
      });

      renderProtectedRoute({
        children: <div>Student Content</div>,
        requiredRole: 'student'
      });

      expect(screen.getByText('Student Content')).toBeInTheDocument();
    });

    it('redirects teacher to their dashboard when accessing student routes', () => {
      (useUser as jest.Mock).mockReturnValue({
        user: mockUsers.teacher,
        isLoading: false,
        logout: jest.fn(),
      });

      renderProtectedRoute({
        children: <div>Student Content</div>,
        requiredRole: 'student'
      });

      expect(screen.getByTestId('navigate-/teacher')).toBeInTheDocument();
      expect(screen.queryByText('Student Content')).not.toBeInTheDocument();
    });

    it('redirects manager to their dashboard when accessing student routes', () => {
      (useUser as jest.Mock).mockReturnValue({
        user: mockUsers.manager,
        isLoading: false,
        logout: jest.fn(),
      });

      renderProtectedRoute({
        children: <div>Student Content</div>,
        requiredRole: 'student'
      });

      expect(screen.getByTestId('navigate-/manager')).toBeInTheDocument();
      expect(screen.queryByText('Student Content')).not.toBeInTheDocument();
    });
  });

  describe('Role-Based Access Control - Teacher Routes', () => {
    it('allows teacher to access teacher routes', () => {
      (useUser as jest.Mock).mockReturnValue({
        user: mockUsers.teacher,
        isLoading: false,
        logout: jest.fn(),
      });

      renderProtectedRoute({
        children: <div>Teacher Content</div>,
        requiredRole: 'teacher'
      });

      expect(screen.getByText('Teacher Content')).toBeInTheDocument();
    });

    it('redirects student to their dashboard when accessing teacher routes', () => {
      (useUser as jest.Mock).mockReturnValue({
        user: mockUsers.student,
        isLoading: false,
        logout: jest.fn(),
      });

      renderProtectedRoute({
        children: <div>Teacher Content</div>,
        requiredRole: 'teacher'
      });

      expect(screen.getByTestId('navigate-/student')).toBeInTheDocument();
      expect(screen.queryByText('Teacher Content')).not.toBeInTheDocument();
    });

    it('redirects manager to their dashboard when accessing teacher routes', () => {
      (useUser as jest.Mock).mockReturnValue({
        user: mockUsers.manager,
        isLoading: false,
        logout: jest.fn(),
      });

      renderProtectedRoute({
        children: <div>Teacher Content</div>,
        requiredRole: 'teacher'
      });

      expect(screen.getByTestId('navigate-/manager')).toBeInTheDocument();
      expect(screen.queryByText('Teacher Content')).not.toBeInTheDocument();
    });
  });

  describe('Role-Based Access Control - Manager Routes', () => {
    it('allows manager to access manager routes', () => {
      (useUser as jest.Mock).mockReturnValue({
        user: mockUsers.manager,
        isLoading: false,
        logout: jest.fn(),
      });

      renderProtectedRoute({
        children: <div>Manager Content</div>,
        requiredRole: 'manager'
      });

      expect(screen.getByText('Manager Content')).toBeInTheDocument();
    });

    it('redirects student to their dashboard when accessing manager routes', () => {
      (useUser as jest.Mock).mockReturnValue({
        user: mockUsers.student,
        isLoading: false,
        logout: jest.fn(),
      });

      renderProtectedRoute({
        children: <div>Manager Content</div>,
        requiredRole: 'manager'
      });

      expect(screen.getByTestId('navigate-/student')).toBeInTheDocument();
      expect(screen.queryByText('Manager Content')).not.toBeInTheDocument();
    });

    it('redirects teacher to their dashboard when accessing manager routes', () => {
      (useUser as jest.Mock).mockReturnValue({
        user: mockUsers.teacher,
        isLoading: false,
        logout: jest.fn(),
      });

      renderProtectedRoute({
        children: <div>Manager Content</div>,
        requiredRole: 'manager'
      });

      expect(screen.getByTestId('navigate-/teacher')).toBeInTheDocument();
      expect(screen.queryByText('Manager Content')).not.toBeInTheDocument();
    });
  });
});
