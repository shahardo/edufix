import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { UserProvider } from './contexts/UserContext';
import ProtectedRoute from './components/shared/ProtectedRoute';
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import StudentLessons from './components/StudentLessons';
import StudentExercises from './components/StudentExercises';
import StudentAnalytics from './components/StudentAnalytics';
import TeacherDashboard from './components/TeacherDashboard';
import ManagerDashboard from './components/ManagerDashboard';
import ContentManagement from './components/ContentManagement';
import Practice from './components/Practice';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route
                path="/student"
                element={
                  <ProtectedRoute requiredRole="student">
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/lessons"
                element={
                  <ProtectedRoute requiredRole="student">
                    <StudentLessons />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/exercises"
                element={
                  <ProtectedRoute requiredRole="student">
                    <StudentExercises />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/analytics"
                element={
                  <ProtectedRoute requiredRole="student">
                    <StudentAnalytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teacher"
                element={
                  <ProtectedRoute requiredRole="teacher">
                    <TeacherDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manager"
                element={
                  <ProtectedRoute requiredRole="manager">
                    <ManagerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/content" element={<ContentManagement />} />
              <Route path="/practice" element={<Practice />} />
            </Routes>
          </div>
        </Router>
      </UserProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
