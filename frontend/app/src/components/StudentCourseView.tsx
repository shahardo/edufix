import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Header from './shared/Header';
import Footer from './shared/Footer';
import LoadingSpinner from './shared/LoadingSpinner';
import ErrorMessage from './shared/ErrorMessage';
import { useUser } from '../contexts/UserContext';

// Types
interface Lesson {
  id: number;
  title: string;
  description: string;
  order: number;
  unit_id: number;
  duration?: string;
  is_completed?: boolean;
}

interface Unit {
  id: number;
  title: string;
  description: string;
  order: number;
  course_id: number;
}

interface Course {
  id: number;
  name: string;
  title?: string;
  subject: string;
  description: string;
  teacher_name?: string;
}

// Fetchers
const fetchCourse = async (courseId: string) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`http://localhost:8000/api/courses/${courseId}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to fetch course');
  return response.json();
};

const fetchUnits = async (courseId: string) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`http://localhost:8000/api/units?course_id=${courseId}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to fetch units');
  return response.json();
};

const fetchLessons = async (unitId: number) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`http://localhost:8000/api/lessons?unit_id=${unitId}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to fetch lessons');
  return response.json();
};

// Sub-component for Unit to handle its own lessons fetching
const UnitSection = ({ unit, isExpanded, onToggle }: { unit: Unit, isExpanded: boolean, onToggle: () => void }) => {
  const navigate = useNavigate();
  const { data: lessons, isLoading } = useQuery({
    queryKey: ['lessons', unit.id],
    queryFn: () => fetchLessons(unit.id),
    enabled: isExpanded, // Only fetch when expanded
  });

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-4">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors text-left"
      >
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Unit {unit.order}: {unit.title}
          </h3>
          {unit.description && (
            <p className="text-sm text-gray-500 mt-1">{unit.description}</p>
          )}
        </div>
        <i className={`fas fa-chevron-down transform transition-transform ${isExpanded ? 'rotate-180' : ''} text-gray-400`}></i>
      </button>

      {isExpanded && (
        <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
          {isLoading ? (
            <div className="text-sm text-gray-500 py-2">Loading lessons...</div>
          ) : lessons && lessons.length > 0 ? (
            <div className="space-y-2">
              {lessons.sort((a: Lesson, b: Lesson) => a.order - b.order).map((lesson: Lesson) => (
                <div
                  key={lesson.id}
                  onClick={() => navigate(`/student/lessons/${lesson.id}`)}
                  className="flex items-center justify-between p-3 bg-white rounded border border-gray-200 hover:border-blue-300 hover:shadow-sm cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-medium">
                      {lesson.order}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{lesson.title}</h4>
                      <p className="text-xs text-gray-500 line-clamp-1">{lesson.description}</p>
                    </div>
                  </div>
                  <button className="text-xs font-medium text-blue-600 hover:text-blue-800 px-3 py-1 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors">
                    Start
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500 italic py-2">No lessons in this unit.</div>
          )}
        </div>
      )}
    </div>
  );
};

const StudentCourseView = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useUser();
  const navigate = useNavigate();
  const [expandedUnitId, setExpandedUnitId] = useState<number | null>(null);

  const { data: course, isLoading: courseLoading, error: courseError } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => fetchCourse(courseId!),
    enabled: !!courseId,
  });

  const { data: units, isLoading: unitsLoading } = useQuery({
    queryKey: ['units', courseId],
    queryFn: () => fetchUnits(courseId!),
    enabled: !!courseId,
  });

  if (courseLoading) return <LoadingSpinner message="Loading course details..." className="min-h-screen" />;
  if (courseError) return <ErrorMessage title="Error" message="Failed to load course." className="min-h-screen" />;

  const toggleUnit = (unitId: number) => {
    setExpandedUnitId(expandedUnitId === unitId ? null : unitId);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header title={course?.name || course?.title || "Course Details"} user={user} showUserMenu={true} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <button
          onClick={() => navigate('/student/lessons')}
          className="flex items-center text-gray-600 hover:text-blue-600 mb-6 transition-colors"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          Back to Courses
        </button>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {course?.subject}
            </span>
            <h1 className="text-3xl font-bold text-gray-900">{course?.name || course?.title}</h1>
          </div>
          <p className="text-gray-600 max-w-3xl">{course?.description}</p>
          {course?.teacher_name && (
            <p className="text-sm text-gray-500 mt-2">Instructor: {course.teacher_name}</p>
          )}
        </div>

        <div className="space-y-4">
          {unitsLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : units?.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-500">No content available for this course yet.</p>
            </div>
          ) : (
            units?.sort((a: Unit, b: Unit) => a.order - b.order).map((unit: Unit) => (
              <UnitSection
                key={unit.id}
                unit={unit}
                isExpanded={expandedUnitId === unit.id}
                onToggle={() => toggleUnit(unit.id)}
              />
            ))
          )}
        </div>
      </main>

      <Footer user={user} />
    </div>
  );
};

export default StudentCourseView;