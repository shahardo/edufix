import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import type { User } from '../types/api';

type LoginForm = {
  username: string;
  password: string;
  rememberMe: boolean;
};

const Login = () => {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setErrorMessage('');

    try {
      // Call the backend authentication API
      const response = await fetch('http://localhost:8000/auth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: data.username,
          password: data.password,
        }),
      });

      if (response.ok) {
        const tokenData = await response.json();
        const token = tokenData.access_token;

        // Store the token in localStorage
        localStorage.setItem('token', token);

        // Fetch user details to determine role
        const userResponse = await fetch('http://localhost:8000/auth/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (userResponse.ok) {
          const user: User = await userResponse.json();

          // Store user data in localStorage
          localStorage.setItem('user', JSON.stringify(user));

          // Successful login - redirect based on role from backend
          if (user.role === 'student') {
            navigate('/student');
          } else if (user.role === 'teacher') {
            navigate('/teacher');
          } else if (user.role === 'manager') {
            navigate('/manager');
          } else {
            setErrorMessage('Invalid user role. Please contact administrator.');
          }
        } else {
          setErrorMessage('Failed to fetch user details. Please try again.');
        }
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.detail || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Network error. Please try again later.');
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center">
            <i className="fas fa-graduation-cap text-2xl text-white"></i>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Welcome to EduFix</h2>
          <p className="mt-2 text-sm text-gray-600">
            Adaptive learning platform for the classroom
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
          {/* Login Fields */}
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-user text-gray-400"></i>
                </div>
                <input
                  id="username"
                  type="text"
                  required
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your username"
                  {...register('username', { required: 'Username is required' })}
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-lock text-gray-400"></i>
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your password"
                  {...register('password', { required: 'Password is required' })}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  {...register('rememberMe')}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <i className="fas fa-sign-in-alt text-blue-500 group-hover:text-blue-400"></i>
                </span>
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          {/* Error Message */}
          {errorMessage && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <i className="fas fa-exclamation-circle text-red-400"></i>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{errorMessage}</p>
                </div>
              </div>
            </div>
          )}

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Demo Credentials:</h4>
            <div className="text-xs text-gray-600 space-y-1">
              <div><strong>Manager:</strong> manager / pass123</div>
              <div><strong>Teacher:</strong> teacher1 / pass123</div>
              <div><strong>Student:</strong> student1 / pass123</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600">
          <p>&copy; 2026 EduFix. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
