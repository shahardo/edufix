import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import LoadingSpinner from './shared/LoadingSpinner';
import ErrorMessage from './shared/ErrorMessage';
import Header from './shared/Header';
import Footer from './shared/Footer';
import type { User } from '../types/api';

// API function to fetch management data
const fetchManagementData = async (endpoint: string) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`http://localhost:8000/api/management/${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}`);
  }

  return response.json();
};

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on component mount
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Fetch all management data
  const { data: overview, isLoading: overviewLoading, error: overviewError } = useQuery({
    queryKey: ['management-overview'],
    queryFn: () => fetchManagementData('overview'),
  });

  const { data: teachers, isLoading: teachersLoading, error: teachersError } = useQuery({
    queryKey: ['management-teachers'],
    queryFn: () => fetchManagementData('teachers'),
  });

  const { data: students, isLoading: studentsLoading, error: studentsError } = useQuery({
    queryKey: ['management-students'],
    queryFn: () => fetchManagementData('students'),
  });

  const { data: classes, isLoading: classesLoading, error: classesError } = useQuery({
    queryKey: ['management-classes'],
    queryFn: () => fetchManagementData('classes'),
  });

  const { data: lessons, isLoading: lessonsLoading, error: lessonsError } = useQuery({
    queryKey: ['management-lessons'],
    queryFn: () => fetchManagementData('lessons'),
  });

  // Helper function to get initials from name
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  // Loading state
  if (overviewLoading || teachersLoading || studentsLoading || classesLoading || lessonsLoading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading management dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (overviewError || teachersError || studentsError || classesError || lessonsError) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <i className="fas fa-exclamation-triangle text-4xl"></i>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600">Unable to load management data. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header title="Management Dashboard" user={user} showUserMenu={true} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Platform Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Teachers</p>
                <p className="text-3xl font-bold text-blue-600">{overview?.total_teachers || 0}</p>
                <p className="text-xs text-gray-500">Active educators</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <i className="fas fa-chalkboard-teacher text-blue-600 text-2xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-3xl font-bold text-green-600">{overview?.total_students || 0}</p>
                <p className="text-xs text-gray-500">Enrolled learners</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <i className="fas fa-users text-green-600 text-2xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Classes</p>
                <p className="text-3xl font-bold text-purple-600">{overview?.total_classes || 0}</p>
                <p className="text-xs text-gray-500">Active classrooms</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <i className="fas fa-school text-purple-600 text-2xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Lessons</p>
                <p className="text-3xl font-bold text-orange-600">{overview?.total_lessons || 0}</p>
                <p className="text-xs text-gray-500">Learning materials</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <i className="fas fa-book text-orange-600 text-2xl"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Teachers Overview */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Teachers Overview</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-600">Sort by:</label>
                  <select className="px-3 py-1 border border-gray-300 rounded-md text-sm">
                    <option>Name</option>
                    <option>Classes</option>
                    <option>Students</option>
                    <option>Join Date</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Classes</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {teachers && teachers.length > 0 ? teachers.slice(0, 10).map((teacher: any, index: number) => {
                  const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 'bg-yellow-500', 'bg-indigo-500'];
                  const colorClass = colors[index % colors.length];

                  return (
                    <tr key={teacher.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`flex-shrink-0 h-10 w-10 rounded-full ${colorClass} flex items-center justify-center`}>
                            <span className="text-white font-medium">{getInitials(teacher.full_name)}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{teacher.full_name}</div>
                            <div className="text-sm text-gray-500">{teacher.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{teacher.class_count}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{teacher.student_count}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(teacher.created_at)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">View Classes</button>
                        <button className="text-green-600 hover:text-green-900">Contact</button>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No teachers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Students and Classes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Students Overview */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Students Overview</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm">
                  <i className="fas fa-plus mr-2"></i>Add Student
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {students && students.length > 0 ? students.slice(0, 5).map((student: any, index: number) => {
                  const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 'bg-yellow-500'];
                  const colorClass = colors[index % colors.length];
                  const masteryColor = student.mastery_score >= 80 ? 'text-green-600' :
                                     student.mastery_score >= 60 ? 'text-blue-600' :
                                     student.mastery_score >= 40 ? 'text-yellow-600' : 'text-red-600';
                  const bgColor = student.mastery_score >= 80 ? 'bg-gray-50' :
                                student.mastery_score >= 60 ? 'bg-gray-50' :
                                student.mastery_score >= 40 ? 'bg-yellow-50 border border-yellow-200' : 'bg-red-50 border border-red-200';

                  return (
                    <div key={student.id} className={`flex items-center justify-between p-3 rounded-lg ${bgColor}`}>
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full ${colorClass} flex items-center justify-center mr-3`}>
                          <span className="text-white font-medium text-sm">{getInitials(student.full_name)}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{student.full_name}</p>
                          <p className="text-sm text-gray-600">
                            {student.class_name ? `${student.class_name} • ${student.teacher_name || 'No teacher'}` : 'No class assigned'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${masteryColor}`}>{student.mastery_score}% mastery</p>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="text-center text-gray-500 py-8">
                    No students found
                  </div>
                )}
              </div>

              <div className="mt-4">
                <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                  View All Students ({overview?.total_students || 0})
                </button>
              </div>
            </div>
          </div>

          {/* Classes Overview */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Classes Overview</h3>
                <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm">
                  <i className="fas fa-plus mr-2"></i>Add Class
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {classes && classes.length > 0 ? classes.slice(0, 5).map((classItem: any, index: number) => {
                  const icons = ['fas fa-flask', 'fas fa-atom', 'fas fa-dna', 'fas fa-calculator', 'fas fa-microscope'];
                  const icon = icons[index % icons.length];
                  const colors = ['bg-blue-100 text-blue-600', 'bg-green-100 text-green-600', 'bg-purple-100 text-purple-600', 'bg-red-100 text-red-600', 'bg-yellow-100 text-yellow-600'];
                  const colorClass = colors[index % colors.length];

                  // Simple logic to determine status based on creation date
                  const createdDate = new Date(classItem.created_at);
                  const daysSinceCreation = (new Date().getTime() - createdDate.getTime()) / (1000 * 3600 * 24);
                  const status = daysSinceCreation < 30 ? 'New' : 'Active';
                  const statusColor = status === 'New' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800';

                  return (
                    <div key={classItem.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-lg ${colorClass} flex items-center justify-center mr-3`}>
                          <i className={icon}></i>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{classItem.name}</p>
                          <p className="text-sm text-gray-600">{classItem.teacher_name} • {classItem.student_count} students</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs ${statusColor}`}>{status}</span>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="text-center text-gray-500 py-8">
                    No classes found
                  </div>
                )}
              </div>

              <div className="mt-4">
                <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                  View All Classes ({overview?.total_classes || 0})
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Lessons Overview */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Lessons Overview</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-600">Subject:</label>
                  <select className="px-3 py-1 border border-gray-300 rounded-md text-sm">
                    <option>All Subjects</option>
                    <option>Chemistry</option>
                    <option>Physics</option>
                    <option>Biology</option>
                  </select>
                </div>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm">
                  <i className="fas fa-plus mr-2"></i>Add Lesson
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lesson</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hierarchy</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Questions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {lessons && lessons.length > 0 ? lessons.slice(0, 10).map((lesson: any) => (
                  <tr key={lesson.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{lesson.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lesson.class_name} → {lesson.course_name} → {lesson.unit_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lesson.teacher_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lesson.question_count}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(lesson.created_at)}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No lessons found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{Math.min(10, lessons?.length || 0)}</span> of <span className="font-medium">{overview?.total_lessons || 0}</span> lessons
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">Previous</button>
                <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm">1</button>
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">2</button>
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">3</button>
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">Next</button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer user={user} />
    </div>
  );
};

export default ManagerDashboard;
