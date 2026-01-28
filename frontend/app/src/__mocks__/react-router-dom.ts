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
