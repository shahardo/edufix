import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from './shared/LoadingSpinner';
import ErrorMessage from './shared/ErrorMessage';
import Header from './shared/Header';
import Footer from './shared/Footer';
import { useUser } from '../contexts/UserContext';

/**
 * Fetches student's enrolled courses and lessons
 */
const fetchStudentCourses = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:8000/api/analytics/student/courses', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch student courses');
  }

  return response.json();
};

/**
 * StudentLessons Component
 *
 * Displays a comprehensive view of courses and lessons for students,
 * allowing them to browse, access, and track progress through their curriculum.
 *
 * Features:
 * - Course grid with progress indicators
 * - Lesson listing with completion status
 * - Direct access to lesson content and Q&A
 * - Progress tracking and navigation
 * - Responsive design with mobile optimization
 */
const StudentLessons = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  // Fetch student's courses and lessons
  const { data: coursesData, isLoading, error } = useQuery({
    queryKey: ['student-courses'],
    queryFn: fetchStudentCourses,
  });

  // Loading state
  if (isLoading) {
    return <LoadingSpinner message="Loading your courses..." className="min-h-screen" />;
  }

  // Error state
  if (error) {
    return (
      <ErrorMessage
        title="Error Loading Courses"
        message="Unable to load your courses. Please try again later."
        className="min-h-screen"
      />
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header title="My Lessons" user={user} showUserMenu={true} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Lessons</h1>
          <p className="text-gray-600">Browse your courses and continue learning</p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {coursesData?.courses && coursesData.courses.length > 0 ? (
            coursesData.courses.map((course: any) => {
              const progressPercentage = course.total_lessons > 0
                ? Math.round((course.completed_lessons / course.total_lessons) * 100)
                : 0;

              return (
                <div 
                  key={course.id} 
                  onClick={() => navigate(`/student/courses/${course.id}`)}
                  className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="p-6">
                    {/* Course Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{course.name}</h3>
                        <p className="text-sm text-gray-600">{course.subject}</p>
                        <p className="text-sm text-gray-500">{course.teacher_name}</p>
                      </div>
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        course.subject.toLowerCase().includes('math') ? 'bg-blue-100 text-blue-600' :
                        course.subject.toLowerCase().includes('science') ? 'bg-green-100 text-green-600' :
                        course.subject.toLowerCase().includes('english') ? 'bg-purple-100 text-purple-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        <i className={`fas fa-${
                          course.subject.toLowerCase().includes('math') ? 'calculator' :
                          course.subject.toLowerCase().includes('science') ? 'flask' :
                          course.subject.toLowerCase().includes('english') ? 'book' :
                          'graduation-cap'
                        } text-xl`}></i>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Progress</span>
                        <span>{course.completed_lessons}/{course.total_lessons} lessons</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{progressPercentage}% complete</p>
                    </div>

                    {/* Action Button */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/student/courses/${course.id}`);
                      }}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Continue Learning
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <i className="fas fa-book-open text-4xl text-gray-300 mb-4"></i>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
              <p className="text-gray-600">You haven't been enrolled in any courses yet.</p>
            </div>
          )}
        </div>

        {/* Recent Lessons */}
        {coursesData?.recent_lessons && coursesData.recent_lessons.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Continue Where You Left Off</h2>
            <div className="space-y-4">
              {coursesData.recent_lessons.map((lesson: any) => (
                <div key={lesson.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <i className="fas fa-play text-blue-600"></i>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{lesson.title}</h3>
                      <p className="text-sm text-gray-600">{lesson.course_name} • {lesson.duration}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate(`/student/lessons/${lesson.id}`)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Resume
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer user={user} />
    </div>
  );
};

export default StudentLessons;
