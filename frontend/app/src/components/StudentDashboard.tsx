import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from './shared/LoadingSpinner';
import ErrorMessage from './shared/ErrorMessage';
import Header from './shared/Header';
import Footer from './shared/Footer';
import { getInitials, formatRelativeTime } from '../utils/formatters';
import type { StudentDashboardData, User } from '../types/api';

/**
 * Fetches student dashboard data from the API
 *
 * @returns Promise<StudentDashboardData> - Dashboard metrics and activity data
 * @throws Error when API request fails
 */
const fetchStudentDashboard = async (): Promise<StudentDashboardData> => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:8000/api/analytics/student/dashboard', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch student dashboard data');
  }

  return response.json();
};

/**
 * StudentDashboard Component
 *
 * Displays a comprehensive dashboard for students showing their academic progress,
 * enrolled classes, recent activity, and upcoming assignments.
 *
 * Features:
 * - Real-time metrics from database (classes, grades, streaks)
 * - Dynamic class list with progress indicators
 * - Recent activity feed with timestamps
 * - Upcoming assignments with due dates
 * - Responsive design with loading/error states
 *
 * @returns JSX.Element
 */
const StudentDashboard = () => {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on component mount
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Fetch student dashboard data
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['student-dashboard'],
    queryFn: fetchStudentDashboard,
  });

  // Loading state
  if (isLoading) {
    return <LoadingSpinner message="Loading your dashboard..." className="min-h-screen" />;
  }

  // Error state
  if (error) {
    return (
      <ErrorMessage
        title="Error Loading Dashboard"
        message="Unable to load dashboard data. Please try again later."
        className="min-h-screen"
      />
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header title="Student Dashboard" user={user} showUserMenu={true} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white mb-8">
          <h1 className="text-2xl font-bold mb-2">Welcome back! 👋</h1>
          <p className="text-blue-100">
            You have {dashboardData?.upcoming_assignments?.length || 0} upcoming assignments.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <i className="fas fa-book text-blue-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Classes</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData?.active_classes_count || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <i className="fas fa-tasks text-green-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData?.completed_tasks_count || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <i className="fas fa-star text-yellow-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Grade</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData?.average_grade || 0}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <i className="fas fa-fire text-purple-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Current Streak</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData?.current_streak || 0} days</p>
              </div>
            </div>
          </div>
        </div>

        {/* My Classes */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">My Classes</h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {dashboardData?.classes && dashboardData.classes.length > 0 ? dashboardData.classes.slice(0, 4).map((classItem: any, index: number) => {
              const icons = ['fas fa-flask', 'fas fa-leaf', 'fas fa-calculator', 'fas fa-globe', 'fas fa-atom', 'fas fa-dna'];
              const colors = ['bg-blue-100 text-blue-600', 'bg-green-100 text-green-600', 'bg-purple-100 text-purple-600', 'bg-red-100 text-red-600', 'bg-yellow-100 text-yellow-600', 'bg-indigo-100 text-indigo-600'];
              const icon = icons[index % icons.length];
              const colorClass = colors[index % colors.length];

              return (
                <div key={classItem.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${colorClass}`}>
                      <i className={icon}></i>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{classItem.name}</h3>
                      <p className="text-sm text-gray-600">{classItem.teacher_name}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div>Next: {classItem.next_lesson || 'No upcoming lessons'}</div>
                    <div className="mt-1">Grade: {classItem.grade}%</div>
                  </div>
                </div>
              );
            }) : (
              <div className="col-span-full text-center text-gray-500 py-8">
                No classes found
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity & Upcoming */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {dashboardData?.recent_activity && dashboardData.recent_activity.length > 0 ? dashboardData.recent_activity.map((activity: any, index: number) => {
                const icons = ['fas fa-check', 'fas fa-brain', 'fas fa-trophy', 'fas fa-star', 'fas fa-book'];
                const colors = ['bg-green-100 text-green-600', 'bg-blue-100 text-blue-600', 'bg-purple-100 text-purple-600', 'bg-yellow-100 text-yellow-600', 'bg-indigo-100 text-indigo-600'];
                const icon = icons[index % icons.length];
                const colorClass = colors[index % colors.length];

                return (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                      <i className={`${icon} text-sm`}></i>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-600">{formatRelativeTime(activity.timestamp)}</p>
                      {activity.details && (
                        <p className="text-xs text-gray-500 mt-1">{activity.details}</p>
                      )}
                    </div>
                  </div>
                );
              }) : (
                <div className="text-center text-gray-500 py-4">
                  No recent activity
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Assignments */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Assignments</h2>
            <div className="space-y-4">
              {dashboardData?.upcoming_assignments && dashboardData.upcoming_assignments.length > 0 ? dashboardData.upcoming_assignments.map((assignment: any, index: number) => {
                const icons = ['fas fa-exclamation-triangle', 'fas fa-flask', 'fas fa-book', 'fas fa-calculator'];
                const colors = ['bg-red-50 border-red-200 text-red-600', 'bg-yellow-50 border-yellow-200 text-yellow-600', 'bg-blue-50 border-blue-200 text-blue-600', 'bg-green-50 border-green-200 text-green-600'];
                const icon = icons[index % icons.length];
                const colorClass = colors[index % colors.length];

                const dueDate = new Date(assignment.due_date);
                const now = new Date();
                const daysDiff = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

                let dueText = '';
                let dueColor = '';
                if (daysDiff < 0) {
                  dueText = 'Overdue';
                  dueColor = 'text-red-600';
                } else if (daysDiff === 0) {
                  dueText = 'Due Today';
                  dueColor = 'text-red-600';
                } else if (daysDiff === 1) {
                  dueText = 'Due Tomorrow';
                  dueColor = 'text-yellow-600';
                } else {
                  dueText = `Due in ${daysDiff} days`;
                  dueColor = 'text-blue-600';
                }

                return (
                  <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${colorClass.split(' ')[0]} border ${colorClass.split(' ')[1]}`}>
                    <div className="flex items-center">
                      <i className={`${icon} mr-3 ${colorClass.split(' ')[2]}`}></i>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{assignment.title}</p>
                        <p className="text-xs text-gray-600">{assignment.course_name}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-medium ${dueColor}`}>{dueText}</span>
                  </div>
                );
              }) : (
                <div className="text-center text-gray-500 py-4">
                  No upcoming assignments
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Messages & Notifications */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Messages & Notifications</h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All →
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center">
                <i className="fas fa-envelope text-blue-600 mr-3"></i>
                <div>
                  <p className="text-sm font-medium text-gray-900">New message from Mr. Smith</p>
                  <p className="text-xs text-gray-600">About your chemistry project</p>
                </div>
              </div>
              <span className="text-xs text-blue-600">2 min ago</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <i className="fas fa-bell text-green-600 mr-3"></i>
                <div>
                  <p className="text-sm font-medium text-gray-900">Assignment graded</p>
                  <p className="text-xs text-gray-600">Physics homework: 88%</p>
                </div>
              </div>
              <span className="text-xs text-green-600">1 hour ago</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center">
                <i className="fas fa-trophy text-purple-600 mr-3"></i>
                <div>
                  <p className="text-sm font-medium text-gray-900">Achievement unlocked!</p>
                  <p className="text-xs text-gray-600">"Consistent Learner" badge</p>
                </div>
              </div>
              <span className="text-xs text-purple-600">2 hours ago</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StudentDashboard;
