import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from 'chart.js';
import LoadingSpinner from './shared/LoadingSpinner';
import ErrorMessage from './shared/ErrorMessage';
import Header from './shared/Header';
import Footer from './shared/Footer';
import { useUser } from '../contexts/UserContext';
import { handleApiResponse } from '../utils/api';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

/**
 * Fetches detailed student analytics and performance data
 */
const fetchStudentAnalytics = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:8000/api/analytics/student/detailed', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return handleApiResponse(response, 'Failed to fetch student analytics');
};

/**
 * StudentAnalytics Component
 *
 * Displays comprehensive personal performance insights and progress visualization
 * for students, including mastery scores, progress trends, and personalized recommendations.
 *
 * Features:
 * - Mastery scores visualization with interactive charts
 * - Progress tracking over time with trend analysis
 * - Strengths and weaknesses analysis
 * - Achievement badges and gamification progress display
 * - Study streak calendar and activity insights
 * - Exportable progress reports and detailed metrics
 * - Personalized recommendations based on performance patterns
 */
const StudentAnalytics = () => {
  const { user } = useUser();

  // State for chart display modes
  const [masteryDisplayMode, setMasteryDisplayMode] = useState<'chart' | 'bars'>('chart');
  const [progressDisplayMode, setProgressDisplayMode] = useState<'chart' | 'table'>('chart');

  // Fetch detailed student analytics
  const { data: analyticsData, isLoading, error } = useQuery({
    queryKey: ['student-analytics'],
    queryFn: fetchStudentAnalytics,
  });

  // Loading state
  if (isLoading) {
    return <LoadingSpinner message="Loading your analytics..." className="min-h-screen" />;
  }

  // Error state
  if (error) {
    return (
      <ErrorMessage
        title="Error Loading Analytics"
        message="Unable to load your analytics. Please try again later."
        className="min-h-screen"
      />
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header title="My Analytics" user={user} showUserMenu={true} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Analytics</h1>
          <p className="text-gray-600">Track your progress and discover insights about your learning journey</p>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <i className="fas fa-chart-line text-blue-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overall Mastery</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData?.overall_mastery || 0}%</p>
                <p className="text-xs text-green-600">+{analyticsData?.mastery_improvement || 0}% this month</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <i className="fas fa-fire text-green-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Current Streak</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData?.current_streak || 0} days</p>
                <p className="text-xs text-gray-600">Best: {analyticsData?.best_streak || 0} days</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <i className="fas fa-brain text-purple-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Questions Answered</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData?.total_questions || 0}</p>
                <p className="text-xs text-gray-600">{analyticsData?.accuracy || 0}% accuracy</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <i className="fas fa-trophy text-yellow-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Achievements</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData?.achievements_count || 0}</p>
                <p className="text-xs text-gray-600">{analyticsData?.recent_badges || 0} this month</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Subject Mastery Distribution */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Subject Mastery Distribution</h2>

            {/* Tabs */}
            <div className="flex space-x-1 mb-4 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setMasteryDisplayMode('chart')}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                  masteryDisplayMode === 'chart'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <i className="fas fa-chart-pie mr-2"></i>
                Chart
              </button>
              <button
                onClick={() => setMasteryDisplayMode('bars')}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                  masteryDisplayMode === 'bars'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <i className="fas fa-chart-bar mr-2"></i>
                Bars
              </button>
            </div>

            {analyticsData?.subject_mastery && analyticsData.subject_mastery.length > 0 ? (
              <div className="h-80">
                {masteryDisplayMode === 'chart' ? (
                  <Pie
                    data={{
                      labels: analyticsData.subject_mastery.map((subject: any) => subject.name),
                      datasets: [{
                        data: analyticsData.subject_mastery.map((subject: any) => subject.score),
                        backgroundColor: analyticsData.subject_mastery.map((subject: any) => {
                          const subjectName = subject.name.toLowerCase();
                          // Specific colors for science subjects
                          if (subjectName.includes('biology') || subjectName.includes('bio')) return '#22C55E'; // green
                          if (subjectName.includes('chemistry') || subjectName.includes('chem')) return '#3B82F6'; // blue
                          if (subjectName.includes('physics') || subjectName.includes('physic')) return '#8B5CF6'; // purple
                          // Default color logic for other subjects
                          return subject.score >= 80 ? '#10B981' : // green
                                 subject.score >= 60 ? '#F59E0B' : // yellow
                                 '#EF4444'; // red
                        }),
                        borderColor: analyticsData.subject_mastery.map(() => '#FFFFFF'),
                        borderWidth: 2,
                      }],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom' as const,
                          labels: {
                            padding: 20,
                            usePointStyle: true,
                          },
                        },
                        tooltip: {
                          callbacks: {
                            label: (context: any) => `${context.label}: ${context.parsed}% mastery`,
                          },
                        },
                      },
                    }}
                  />
                ) : (
                  <div className="space-y-4 pt-4">
                    {analyticsData.subject_mastery.map((subject: any) => (
                      <div key={subject.name} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-gray-900">{subject.name}</span>
                          <span className="text-gray-600">{subject.score}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-6">
                          <div
                            className={`h-6 rounded-full transition-all duration-300 flex items-center justify-end pr-2 text-white text-xs font-medium ${
                              subject.score >= 80 ? 'bg-green-500' :
                              subject.score >= 60 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${subject.score}%` }}
                          >
                            {subject.score}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center">
                <p className="text-gray-600">No subject mastery data available yet.</p>
              </div>
            )}
          </div>

          {/* Progress Over Time */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Progress Over Time</h2>

            {/* Tabs */}
            <div className="flex space-x-1 mb-4 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setProgressDisplayMode('chart')}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                  progressDisplayMode === 'chart'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <i className="fas fa-chart-line mr-2"></i>
                Chart
              </button>
              <button
                onClick={() => setProgressDisplayMode('table')}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                  progressDisplayMode === 'table'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <i className="fas fa-table mr-2"></i>
                Table
              </button>
            </div>

            {analyticsData?.progress_timeline && analyticsData.progress_timeline.length > 0 ? (
              <div className="h-80">
                {progressDisplayMode === 'chart' ? (
                  <Line
                    data={{
                      labels: analyticsData.progress_timeline.slice(-14).map((day: any) =>
                        new Date(day.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })
                      ),
                      datasets: [{
                        label: 'Mastery Score',
                        data: analyticsData.progress_timeline.slice(-14).map((day: any) => day.score),
                        borderColor: '#3B82F6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#3B82F6',
                        pointBorderColor: '#FFFFFF',
                        pointBorderWidth: 2,
                        pointRadius: 5,
                        pointHoverRadius: 7,
                      }],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false,
                        },
                        tooltip: {
                          mode: 'index' as const,
                          intersect: false,
                          callbacks: {
                            label: (context: any) => `Mastery: ${context.parsed.y}%`,
                          },
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          max: 100,
                          ticks: {
                            callback: (value: any) => `${value}%`,
                          },
                          grid: {
                            color: 'rgba(0, 0, 0, 0.1)',
                          },
                        },
                        x: {
                          grid: {
                            display: false,
                          },
                        },
                      },
                      interaction: {
                        mode: 'nearest' as const,
                        axis: 'x' as const,
                        intersect: false,
                      },
                    }}
                  />
                ) : (
                  <div className="overflow-y-auto h-full">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left font-medium text-gray-700">Date</th>
                          <th className="px-4 py-2 text-left font-medium text-gray-700">Mastery Score</th>
                          <th className="px-4 py-2 text-left font-medium text-gray-700">Change</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analyticsData.progress_timeline.slice(-14).map((day: any, index: number) => {
                          const prevDay = analyticsData.progress_timeline.slice(-15)[index];
                          const change = prevDay ? day.score - prevDay.score : 0;
                          return (
                            <tr key={day.date} className="border-t border-gray-200">
                              <td className="px-4 py-2 text-gray-900">
                                {new Date(day.date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </td>
                              <td className="px-4 py-2 text-gray-900">{day.score}%</td>
                              <td className={`px-4 py-2 ${change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                                {change > 0 ? '+' : ''}{change}%
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center">
                <p className="text-gray-600">No progress data available yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Subject Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Detailed Subject Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analyticsData?.subject_mastery && analyticsData.subject_mastery.length > 0 ? (
              analyticsData.subject_mastery.map((subject: any) => (
                <div key={subject.name} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{subject.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      subject.score >= 80 ? 'bg-green-100 text-green-800' :
                      subject.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {subject.score >= 80 ? 'Excellent' :
                       subject.score >= 60 ? 'Good' : 'Needs Work'}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Mastery Score</span>
                      <span className="font-medium">{subject.score}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          subject.score >= 80 ? 'bg-green-500' :
                          subject.score >= 60 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${subject.score}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-600">No subject data available yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Strengths and Weaknesses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Strengths */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Strengths</h2>
            <div className="space-y-3">
              {analyticsData?.strengths && analyticsData.strengths.length > 0 ? (
                analyticsData.strengths.map((strength: any, index: number) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <i className="fas fa-check text-green-600 text-sm"></i>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{strength.topic}</p>
                      <p className="text-sm text-gray-600">{strength.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">Keep practicing to discover your strengths!</p>
              )}
            </div>
          </div>

          {/* Areas for Improvement */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Areas for Improvement</h2>
            <div className="space-y-3">
              {analyticsData?.weaknesses && analyticsData.weaknesses.length > 0 ? (
                analyticsData.weaknesses.map((weakness: any, index: number) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <i className="fas fa-arrow-up text-orange-600 text-sm"></i>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{weakness.topic}</p>
                      <p className="text-sm text-gray-600">{weakness.description}</p>
                    </div>
                    <button className="bg-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-orange-700 transition-colors">
                      Practice
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">Great job! No major areas for improvement identified.</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {analyticsData?.recent_achievements && analyticsData.recent_achievements.length > 0 ? (
              analyticsData.recent_achievements.map((achievement: any) => (
                <div key={achievement.id} className="text-center p-4 border border-gray-200 rounded-lg">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <i className={`fas ${achievement.icon} text-yellow-600 text-2xl`}></i>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{achievement.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                  <p className="text-xs text-gray-500">Earned {achievement.date}</p>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <i className="fas fa-trophy text-4xl text-gray-300 mb-3"></i>
                <p className="text-gray-600">No achievements yet. Keep learning to unlock badges!</p>
              </div>
            )}
          </div>
        </div>

        {/* Study Activity Calendar */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Study Activity</h2>
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {analyticsData?.activity_calendar && analyticsData.activity_calendar.length > 0 ? (
              analyticsData.activity_calendar.map((day: any, index: number) => (
                <div
                  key={index}
                  className={`aspect-square rounded flex items-center justify-center text-xs font-medium ${
                    day.active ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-400'
                  }`}
                  title={day.date}
                >
                  {day.day}
                </div>
              ))
            ) : (
              Array.from({ length: 35 }, (_, i) => (
                <div key={i} className="aspect-square rounded bg-gray-100"></div>
              ))
            )}
          </div>
          <div className="flex items-center justify-center mt-4 space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-100 rounded mr-2"></div>
              <span>No activity</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
              <span>Active day</span>
            </div>
          </div>
        </div>
      </main>

      <Footer user={user} />
    </div>
  );
};

export default StudentAnalytics;
