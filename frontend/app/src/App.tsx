import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider, QueryCache } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { UserProvider } from './contexts/UserContext';
import ProtectedRoute from './components/shared/ProtectedRoute';
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import StudentLessons from './components/StudentLessons';
import StudentExercises from './components/StudentExercises';
import StudentCourseView from './components/StudentCourseView';
import StudentLessonViewer from './components/StudentLessonViewer';
import StudentAnalytics from './components/StudentAnalytics';
import TeacherDashboard from './components/TeacherDashboard';
import ManagerDashboard from './components/ManagerDashboard';
import ContentManagement from './components/ContentManagement';
import Practice from './components/Practice';
import './App.css';

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: any) => {
      if (error?.message === 'UNAUTHORIZED' || error?.status === 401) {
        // Save the current user's email to verify identity on re-login
        const userStr = localStorage.getItem('user');
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            if (user.email) {
              localStorage.setItem('session_expired_user', user.email);
            }
          } catch (e) {
            // Ignore parsing errors
          }
        }
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        const currentPath = window.location.pathname + window.location.search;
        window.location.href = `/?returnUrl=${encodeURIComponent(currentPath)}`;
      }
    },
  }),
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        if (error?.message === 'UNAUTHORIZED' || error?.status === 401) return false;
        return failureCount < 1;
      },
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
                path="/student/courses/:courseId"
                element={
                  <ProtectedRoute requiredRole="student">
                    <StudentCourseView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/lessons/:lessonId"
                element={
                  <ProtectedRoute requiredRole="student">
                    <StudentLessonViewer />
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
