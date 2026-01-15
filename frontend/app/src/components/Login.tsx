import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

type LoginForm = {
  username: string;
  password: string;
  rememberMe: boolean;
};

type Role = 'student' | 'teacher';

const Login = () => {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setErrorMessage('');

    if (!selectedRole) {
      setErrorMessage('Please select whether you are a Student or Teacher.');
      return;
    }

    // Demo login logic - in production, this would call the API
    const validCredentials = {
      student: { username: 'student1', password: 'password' },
      teacher: { username: 'teacher1', password: 'password' }
    };

    if (data.username === validCredentials[selectedRole].username &&
        data.password === validCredentials[selectedRole].password) {

      // Successful login - redirect based on role
      if (selectedRole === 'student') {
        navigate('/student');
      } else {
        navigate('/teacher');
      }
    } else {
      setErrorMessage('Invalid credentials. Please try again.');
    }
  };

  const selectRole = (role: Role) => {
    setSelectedRole(role);
    setErrorMessage(''); // Clear any error when role is selected
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
          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">I am a:</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => selectRole('student')}
                className={`role-btn px-4 py-3 border-2 rounded-lg transition-colors ${
                  selectedRole === 'student'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                }`}
              >
                <i className="fas fa-user-graduate text-blue-600 mb-2 text-xl"></i>
                <div className="text-sm font-medium text-gray-900">Student</div>
              </button>
              <button
                type="button"
                onClick={() => selectRole('teacher')}
                className={`role-btn px-4 py-3 border-2 rounded-lg transition-colors ${
                  selectedRole === 'teacher'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                }`}
              >
                <i className="fas fa-chalkboard-teacher text-green-600 mb-2 text-xl"></i>
                <div className="text-sm font-medium text-gray-900">Teacher</div>
              </button>
            </div>
          </div>

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
              <div><strong>Student:</strong> student1 / password</div>
              <div><strong>Teacher:</strong> teacher1 / password</div>
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
