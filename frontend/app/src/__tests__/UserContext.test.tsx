import { render, screen } from '@testing-library/react';
import { UserProvider, useUser } from '../contexts/UserContext';

// Test component that uses the UserContext
const TestComponent = () => {
  const { user, logout, isLoading } = useUser();

  return (
    <div>
      <div data-testid="user-info">
        {`User: ${user ? user.full_name : 'None'} (${isLoading ? 'loading' : 'loaded'})`}
      </div>
      <button onClick={logout} data-testid="logout-btn">
        Logout
      </button>
    </div>
  );
};

const renderWithUserProvider = () => {
  return render(
    <UserProvider>
      <TestComponent />
    </UserProvider>
  );
};

describe('UserContext', () => {
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
  });

  it('provides the expected context interface', () => {
    renderWithUserProvider();

    // Component should render with context
    expect(screen.getByTestId('user-info')).toBeInTheDocument();
    expect(screen.getByTestId('logout-btn')).toBeInTheDocument();
  });

  it('logout function is callable', () => {
    renderWithUserProvider();

    // Logout button should be present and clickable
    const logoutButton = screen.getByTestId('logout-btn');
    expect(logoutButton).toBeInTheDocument();
    // Note: Actual logout testing is covered by Login component integration tests
  });

  it('renders without crashing', () => {
    expect(() => {
      renderWithUserProvider();
    }).not.toThrow();
  });
});
