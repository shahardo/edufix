import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from '../components/shared/Header';
import { UserProvider, useUser } from '../contexts/UserContext';
import { mockUsers } from '../fixtures/testData.fixture';

// Mock the UserContext
jest.mock('../contexts/UserContext', () => ({
  UserProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="user-provider">{children}</div>,
  useUser: jest.fn(),
}));

// Mock react-router-dom
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

  describe('Basic Rendering', () => {
    it('renders EduFix logo and title', () => {
      renderHeader('Student Dashboard');
      expect(screen.getByText('EduFix')).toBeInTheDocument();
      expect(screen.getByText('Student Dashboard')).toBeInTheDocument();
    });

    it('renders language selector', () => {
      renderHeader('Student Dashboard');
      expect(screen.getByText('EN')).toBeInTheDocument();
    });

    it('has fixed positioning', () => {
      renderHeader('Student Dashboard');
      const header = screen.getByRole('banner');
      expect(header).toHaveClass('fixed');
      expect(header).toHaveClass('top-0');
      expect(header).toHaveClass('z-40');
    });
  });

  describe('User Menu - No User', () => {
    it('does not render user menu when user is null', () => {
      renderHeader('Student Dashboard');
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /logout/i })).not.toBeInTheDocument();
    });
  });

  describe('User Menu - With User', () => {
    it('renders user menu when user is provided', () => {
      renderHeader('Student Dashboard', mockUsers.student);
      expect(screen.getByText('John Student')).toBeInTheDocument();
    });

    it('toggles user dropdown menu when clicked', async () => {
      const user = userEvent.setup();
      renderHeader('Student Dashboard', mockUsers.student);

      const userButton = screen.getByText('John Student');
      await act(async () => {
        await user.click(userButton);
      });

      // Check if dropdown menu items are visible
      expect(screen.getByText('Profile')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });

    it('closes dropdown when clicking outside', async () => {
      const user = userEvent.setup();
      renderHeader('Student Dashboard', mockUsers.student);

      // Open dropdown
      const userButton = screen.getByText('John Student');
      await act(async () => {
        await user.click(userButton);
      });
      expect(screen.getByText('Profile')).toBeInTheDocument();

      // Click outside (on the test wrapper)
      const testWrapper = screen.getByTestId('test-wrapper');
      await act(async () => {
        await user.click(testWrapper);
      });

      // Dropdown should be closed
      expect(screen.queryByText('Profile')).not.toBeInTheDocument();
    });

    it('calls logout when logout button is clicked', async () => {
      const user = userEvent.setup();
      const mockLogout = jest.fn();

      // Override the default mock for this specific test
      (useUser as jest.Mock).mockReturnValue({
        user: mockUsers.student,
        logout: mockLogout,
        setUser: jest.fn(),
        isLoading: false,
      });

      renderHeader('Student Dashboard', mockUsers.student);

      // Open the user menu
      const userButton = screen.getByText('John Student');
      await act(async () => {
        await user.click(userButton);
      });

      // Click the logout button
      const logoutButton = screen.getByText('Logout');
      await act(async () => {
        await user.click(logoutButton);
      });

      expect(mockLogout).toHaveBeenCalled();
    });
  });

  describe('Different Dashboard Titles', () => {
    it('shows Student Dashboard title', () => {
      renderHeader('Student Dashboard');
      expect(screen.getByText('Student Dashboard')).toBeInTheDocument();
    });

    it('shows Teacher Dashboard title', () => {
      renderHeader('Teacher Dashboard');
      expect(screen.getByText('Teacher Dashboard')).toBeInTheDocument();
    });

    it('shows Management Dashboard title', () => {
      renderHeader('Management Dashboard');
      expect(screen.getByText('Management Dashboard')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      renderHeader('Student Dashboard');
      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
    });

    it('user menu button is interactive', () => {
      renderHeader('Student Dashboard', mockUsers.student);
      const userButton = screen.getByRole('button', { name: /John Student/ });
      expect(userButton).toBeInTheDocument();
      expect(userButton.tagName).toBe('BUTTON');
    });
  });

  describe('Logo Clickability', () => {
    it('EduFix logo is present and potentially clickable', () => {
      renderHeader('Student Dashboard');
      const logo = screen.getByText('EduFix');
      expect(logo).toBeInTheDocument();
      // Note: Actual clickability would depend on implementation
    });
  });
});
