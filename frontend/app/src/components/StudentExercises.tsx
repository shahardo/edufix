import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from './shared/LoadingSpinner';
import ErrorMessage from './shared/ErrorMessage';
import Header from './shared/Header';
import Footer from './shared/Footer';
import { useUser } from '../contexts/UserContext';

/**
 * Fetches student's available exercises and practice sets
 */
const fetchStudentExercises = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:8000/api/analytics/student/exercises', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch student exercises');
  }

  return response.json();
};

/**
 * StudentExercises Component
 *
 * Displays a comprehensive library of exercises and practice sets for students,
 * allowing them to access adaptive practice sessions and track their progress.
 *
 * Features:
 * - Exercise library browser by topic and difficulty
 * - Practice session launcher with filtering options
 * - Progress tracking and performance history
 * - Adaptive difficulty recommendations
 * - Quick access to recent and recommended exercises
 * - Integration with existing practice system
 */
const StudentExercises = () => {
  const { user } = useUser();

  // Fetch student's exercises and practice data
  const { data: exercisesData, isLoading, error } = useQuery({
    queryKey: ['student-exercises'],
    queryFn: fetchStudentExercises,
  });

  // Loading state
  if (isLoading) {
    return <LoadingSpinner message="Loading your exercises..." className="min-h-screen" />;
  }

  // Error state
  if (error) {
    return (
      <ErrorMessage
        title="Error Loading Exercises"
        message="Unable to load your exercises. Please try again later."
        className="min-h-screen"
      />
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header title="My Exercises" user={user} showUserMenu={true} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Exercises</h1>
          <p className="text-gray-600">Practice and improve your skills with adaptive exercises</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-brain text-blue-600 text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Practice</h3>
            <p className="text-gray-600 mb-4">Start a 10-minute adaptive practice session</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Start Now
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-chart-line text-green-600 text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Weak Topics</h3>
            <p className="text-gray-600 mb-4">Focus on areas where you need improvement</p>
            <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
              Practice Weak Areas
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-trophy text-purple-600 text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Challenge Mode</h3>
            <p className="text-gray-600 mb-4">Test your skills with advanced problems</p>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
              Take Challenge
            </button>
          </div>
        </div>

        {/* Exercise Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Exercise Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Mathematics', icon: 'fas fa-calculator', color: 'blue', count: exercisesData?.math_exercises || 0 },
              { name: 'Science', icon: 'fas fa-flask', color: 'green', count: exercisesData?.science_exercises || 0 },
              { name: 'English', icon: 'fas fa-book', color: 'purple', count: exercisesData?.english_exercises || 0 },
              { name: 'History', icon: 'fas fa-landmark', color: 'orange', count: exercisesData?.history_exercises || 0 },
            ].map((category) => (
              <div key={category.name} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className={`w-12 h-12 bg-${category.color}-100 rounded-lg flex items-center justify-center mb-4`}>
                  <i className={`${category.icon} text-${category.color}-600 text-xl`}></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-gray-600 mb-4">{category.count} exercises available</p>
                <div className="flex space-x-2">
                  <button className={`bg-${category.color}-600 text-white px-3 py-1 rounded text-sm hover:bg-${category.color}-700 transition-colors`}>
                    Practice
                  </button>
                  <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200 transition-colors">
                    View All
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Practice Sessions */}
        {exercisesData?.recent_sessions && exercisesData.recent_sessions.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Practice Sessions</h2>
            <div className="space-y-4">
              {exercisesData.recent_sessions.map((session: any) => (
                <div key={session.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      session.score >= 80 ? 'bg-green-100 text-green-600' :
                      session.score >= 60 ? 'bg-yellow-100 text-yellow-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      <i className={`fas fa-${
                        session.score >= 80 ? 'trophy' :
                        session.score >= 60 ? 'star' :
                        'exclamation-triangle'
                      }`}></i>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{session.topic}</h3>
                      <p className="text-sm text-gray-600">
                        {session.questions_attempted} questions • {session.score}% accuracy • {session.duration}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      session.score >= 80 ? 'bg-green-100 text-green-800' :
                      session.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {session.score >= 80 ? 'Excellent' :
                       session.score >= 60 ? 'Good' : 'Needs Work'}
                    </span>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm">
                      Practice Again
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommended Exercises */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommended for You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {exercisesData?.recommended_exercises && exercisesData.recommended_exercises.length > 0 ? (
              exercisesData.recommended_exercises.map((exercise: any) => (
                <div key={exercise.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">{exercise.title}</h3>
                      <p className="text-sm text-gray-600">{exercise.topic}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      exercise.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                      exercise.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {exercise.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{exercise.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{exercise.estimated_time}</span>
                    <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors">
                      Start
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <i className="fas fa-lightbulb text-3xl text-gray-300 mb-3"></i>
                <p className="text-gray-600">No recommendations available yet. Complete some exercises to get personalized suggestions!</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer user={user} />
    </div>
  );
};

export default StudentExercises;
