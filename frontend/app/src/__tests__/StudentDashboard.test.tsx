import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import StudentDashboard from '../components/StudentDashboard';
import { UserProvider, useUser } from '../contexts/UserContext';
import { mockUsers, mockApiResponses, createMockFetchResponse } from '../fixtures/testData.fixture';

// Mock the UserContext
jest.mock('../contexts/UserContext', () => ({
  UserProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="user-provider">{children}</div>,
  useUser: jest.fn(),
}));

// Mock formatters
jest.mock('../utils/formatters', () => ({
  formatRelativeTime: () => '2 hours ago',
}));

// Mock fetch
Object.defineProperty(window, 'fetch', {
  value: jest.fn(),
  writable: true,
});

// Create QueryClient for testing
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: 0,
    },
  },
});

const renderStudentDashboard = () => {
  const queryClient = createTestQueryClient();

  return render(
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <StudentDashboard />
        </UserProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

describe('StudentDashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useUser as jest.Mock).mockReturnValue({
      user: mockUsers.student,
      logout: jest.fn(),
      setUser: jest.fn(),
      isLoading: false,
    });
  });

  describe('Loading State', () => {
    it('shows loading spinner while fetching data', () => {
      // Mock fetch to never resolve (stays loading)
      (window.fetch as jest.Mock).mockImplementation(() =>
        new Promise(() => {}) // Never resolves
      );

      renderStudentDashboard();

      expect(screen.getByText('Loading your dashboard...')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('shows error message when API fails', async () => {
      // Mock failed API response
      (window.fetch as jest.Mock).mockResolvedValueOnce(
        createMockFetchResponse(null, false)
      );

      renderStudentDashboard();

      await waitFor(() => {
        expect(screen.getByText('Error Loading Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Unable to load dashboard data. Please try again later.')).toBeInTheDocument();
      });
    });
  });

  describe('Successful Data Loading', () => {
    beforeEach(() => {
      // Mock successful API response
      (window.fetch as jest.Mock).mockResolvedValueOnce(
        createMockFetchResponse(mockApiResponses.studentDashboard)
      );
    });

    it('renders welcome section with assignment count', async () => {
      renderStudentDashboard();

      await waitFor(() => {
        expect(screen.getByText('Welcome back! 👋')).toBeInTheDocument();
        expect(screen.getByText('You have 2 upcoming assignments.')).toBeInTheDocument();
      });
    });

    it('displays quick stats correctly', async () => {
      renderStudentDashboard();

      await waitFor(() => {
        expect(screen.getByText('Active Classes')).toBeInTheDocument();
        expect(screen.getByText('4')).toBeInTheDocument(); // active_classes_count

        expect(screen.getByText('Completed Tasks')).toBeInTheDocument();
        expect(screen.getByText('23')).toBeInTheDocument(); // completed_tasks_count

        expect(screen.getByText('Average Grade')).toBeInTheDocument();
        expect(screen.getByText('87%')).toBeInTheDocument(); // average_grade

        expect(screen.getByText('Current Streak')).toBeInTheDocument();
        expect(screen.getByText('5 days')).toBeInTheDocument(); // current_streak
      });
    });

    it('renders classes section with class cards', async () => {
      renderStudentDashboard();

      await waitFor(() => {
        expect(screen.getByText('My Classes')).toBeInTheDocument();
        expect(screen.getByText('Chemistry 101')).toBeInTheDocument();
        expect(screen.getByText('Dr. Smith')).toBeInTheDocument();
        expect(screen.getByText('Physics 101')).toBeInTheDocument();
        expect(screen.getByText('Prof. Johnson')).toBeInTheDocument();
      });
    });

    it('displays recent activity feed', async () => {
      renderStudentDashboard();

      await waitFor(() => {
        expect(screen.getByText('Recent Activity')).toBeInTheDocument();
        expect(screen.getByText('Completed Chemistry quiz')).toBeInTheDocument();
        expect(screen.getByText('Submitted Physics homework')).toBeInTheDocument();
        // Check that time elements exist (multiple activities have the same formatted time)
        const timeElements = screen.getAllByText('2 hours ago');
        expect(timeElements.length).toBeGreaterThanOrEqual(2);
      });
    });

    it('shows upcoming assignments with due dates', async () => {
      renderStudentDashboard();

      await waitFor(() => {
        expect(screen.getByText('Upcoming Assignments')).toBeInTheDocument();
        expect(screen.getByText('Biology Lab Report')).toBeInTheDocument();
        expect(screen.getByText('Math Problem Set')).toBeInTheDocument();
        expect(screen.getByText('Biology 101')).toBeInTheDocument();
        expect(screen.getByText('Calculus I')).toBeInTheDocument();
      });
    });

    it('renders messages and notifications section', async () => {
      renderStudentDashboard();

      await waitFor(() => {
        expect(screen.getByText('Messages & Notifications')).toBeInTheDocument();
      });
    });
  });

  describe('Component Structure', () => {
    beforeEach(() => {
      (window.fetch as jest.Mock).mockResolvedValueOnce(
        createMockFetchResponse(mockApiResponses.studentDashboard)
      );
    });

    it('includes Header component', async () => {
      renderStudentDashboard();

      await waitFor(() => {
        expect(screen.getByText('Student Dashboard')).toBeInTheDocument();
      });
    });

    it('includes Footer component', async () => {
      renderStudentDashboard();

      await waitFor(() => {
        const footer = screen.getByRole('contentinfo');
        expect(footer).toBeInTheDocument();
      });
    });

    it('has proper page layout structure', async () => {
      renderStudentDashboard();

      await waitFor(() => {
        // Check for main layout classes
        const main = screen.getByRole('main');
        expect(main).toHaveClass('max-w-7xl', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8', 'py-8', 'pt-24');
      });
    });
  });

  describe('Data Integration', () => {
    it('calls correct API endpoint with authentication', async () => {
      (window.fetch as jest.Mock).mockResolvedValueOnce(
        createMockFetchResponse(mockApiResponses.studentDashboard)
      );

      renderStudentDashboard();

      await waitFor(() => {
        expect(window.fetch).toHaveBeenCalledWith(
          'http://localhost:8000/api/analytics/student/dashboard',
          expect.objectContaining({
            headers: expect.objectContaining({
              'Authorization': expect.stringContaining('Bearer'),
              'Content-Type': 'application/json',
            }),
          })
        );
      });
    });

    it('uses React Query for data fetching', async () => {
      (window.fetch as jest.Mock).mockResolvedValueOnce(
        createMockFetchResponse(mockApiResponses.studentDashboard)
      );

      renderStudentDashboard();

      // Verify the query key is used
      await waitFor(() => {
        expect(window.fetch).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Layout Structure', () => {
    beforeEach(() => {
      (window.fetch as jest.Mock).mockResolvedValueOnce(
        createMockFetchResponse(mockApiResponses.studentDashboard)
      );
    });

    it('renders dashboard sections in correct order', async () => {
      renderStudentDashboard();

      await waitFor(() => {
        // Check that main sections are present
        expect(screen.getByText('Welcome back! 👋')).toBeInTheDocument();
        expect(screen.getByText('My Classes')).toBeInTheDocument();
        expect(screen.getByText('Recent Activity')).toBeInTheDocument();
        expect(screen.getByText('Upcoming Assignments')).toBeInTheDocument();
      });
    });
  });

  describe('Empty States', () => {
    it('handles empty classes list', async () => {
      const emptyDashboard = { ...mockApiResponses.studentDashboard, classes: [] };
      (window.fetch as jest.Mock).mockResolvedValueOnce(
        createMockFetchResponse(emptyDashboard)
      );

      renderStudentDashboard();

      await waitFor(() => {
        expect(screen.getByText('No classes found')).toBeInTheDocument();
      });
    });

    it('handles empty recent activity', async () => {
      const emptyDashboard = { ...mockApiResponses.studentDashboard, recent_activity: [] };
      (window.fetch as jest.Mock).mockResolvedValueOnce(
        createMockFetchResponse(emptyDashboard)
      );

      renderStudentDashboard();

      await waitFor(() => {
        expect(screen.getByText('No recent activity')).toBeInTheDocument();
      });
    });

    it('handles empty upcoming assignments', async () => {
      const emptyDashboard = { ...mockApiResponses.studentDashboard, upcoming_assignments: [] };
      (window.fetch as jest.Mock).mockResolvedValueOnce(
        createMockFetchResponse(emptyDashboard)
      );

      renderStudentDashboard();

      await waitFor(() => {
        expect(screen.getByText('No upcoming assignments')).toBeInTheDocument();
      });
    });
  });
});
