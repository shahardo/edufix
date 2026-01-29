import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Footer from '../components/shared/Footer';
import { UserProvider, useUser } from '../contexts/UserContext';
import { mockUsers } from '../fixtures/testData.fixture';

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
  Link: ({ children, to, ...props }: any) => React.createElement('a', { href: to, ...props }, children),
}));

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    pathname: '/student',
  },
  writable: true,
});

const renderFooter = (user: any = null) => {
  return render(
    <BrowserRouter>
      <UserProvider>
        <Footer user={user} />
      </UserProvider>
    </BrowserRouter>
  );
};

describe('Footer Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useUser as jest.Mock).mockReturnValue({
      user: null,
      logout: jest.fn(),
      setUser: jest.fn(),
      isLoading: false,
    });
  });

  it('renders copyright text', () => {
    renderFooter();
    expect(screen.getByText(/© 2026 EduFix/)).toBeInTheDocument();
  });

  it('renders navigation for student role', () => {
    renderFooter(mockUsers.student);

    // Check that navigation elements are present (both mobile and desktop versions)
    const homeElements = screen.getAllByText('Home');
    const lessonsElements = screen.getAllByText('Lessons');
    const exercisesElements = screen.getAllByText('Exercises');
    const analyticsElements = screen.getAllByText('Analytics');

    expect(homeElements.length).toBeGreaterThan(0);
    expect(lessonsElements.length).toBeGreaterThan(0);
    expect(exercisesElements.length).toBeGreaterThan(0);
    expect(analyticsElements.length).toBeGreaterThan(0);
  });

  it('renders navigation for teacher role', () => {
    renderFooter(mockUsers.teacher);

    const homeElements = screen.getAllByText('Home');
    const lessonsElements = screen.getAllByText('Lessons');
    const practiceElements = screen.getAllByText('Practice');
    const dashboardElements = screen.getAllByText('Dashboard');

    expect(homeElements.length).toBeGreaterThan(0);
    expect(lessonsElements.length).toBeGreaterThan(0);
    expect(practiceElements.length).toBeGreaterThan(0);
    expect(dashboardElements.length).toBeGreaterThan(0);
  });

  it('renders navigation for manager role', () => {
    renderFooter(mockUsers.manager);

    const homeElements = screen.getAllByText('Home');
    const teachersElements = screen.getAllByText('Teachers');
    const classesElements = screen.getAllByText('Classes');
    const manageElements = screen.getAllByText('Manage');

    expect(homeElements.length).toBeGreaterThan(0);
    expect(teachersElements.length).toBeGreaterThan(0);
    expect(classesElements.length).toBeGreaterThan(0);
    expect(manageElements.length).toBeGreaterThan(0);
  });

  it('has fixed positioning at bottom', () => {
    renderFooter();

    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass('fixed');
    expect(footer).toHaveClass('bottom-0');
  });

  it('has proper semantic HTML', () => {
    renderFooter();
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });

  it('navigation buttons are present', () => {
    renderFooter(mockUsers.student);

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});
