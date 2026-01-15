const StudentDashboard = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">EduFix</h1>
              <span className="ml-4 text-lg text-gray-700">Student Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-3 py-1 text-sm bg-gray-100 rounded-md hover:bg-gray-200">
                <i className="fas fa-globe mr-1"></i>EN
              </button>
              <div className="flex items-center space-x-2">
                <i className="fas fa-user-circle text-2xl text-gray-400"></i>
                <span className="text-sm text-gray-700">Sarah Chen</span>
                <i className="fas fa-chevron-down text-gray-400 ml-1"></i>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white mb-8">
          <h1 className="text-2xl font-bold mb-2">Welcome back, Sarah! 👋</h1>
          <p className="text-blue-100">You have 3 upcoming assignments and 2 new messages.</p>
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
                <p className="text-2xl font-bold text-gray-900">4</p>
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
                <p className="text-2xl font-bold text-gray-900">23</p>
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
                <p className="text-2xl font-bold text-gray-900">87%</p>
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
                <p className="text-2xl font-bold text-gray-900">12 days</p>
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
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <i className="fas fa-flask text-blue-600"></i>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Chemistry 10B</h3>
                  <p className="text-sm text-gray-600">Mr. Smith</p>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <div>Next: Stoichiometry Quiz</div>
                <div className="mt-1">Grade: 85%</div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <i className="fas fa-leaf text-green-600"></i>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Biology 10C</h3>
                  <p className="text-sm text-gray-600">Ms. Johnson</p>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <div>Next: Cell Structure Lab</div>
                <div className="mt-1">Grade: 92%</div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <i className="fas fa-calculator text-purple-600"></i>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Physics 10A</h3>
                  <p className="text-sm text-gray-600">Dr. Brown</p>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <div>Next: Forces & Motion</div>
                <div className="mt-1">Grade: 78%</div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                  <i className="fas fa-globe text-red-600"></i>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Geography 10D</h3>
                  <p className="text-sm text-gray-600">Mrs. Davis</p>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <div>Next: Climate Systems</div>
                <div className="mt-1">Grade: 94%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity & Upcoming */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-check text-green-600 text-sm"></i>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">Completed Chemistry homework</p>
                  <p className="text-xs text-gray-600">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-brain text-blue-600 text-sm"></i>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">Practiced stoichiometry problems</p>
                  <p className="text-xs text-gray-600">1 day ago</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-trophy text-purple-600 text-sm"></i>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">Earned "Chemistry Master" badge</p>
                  <p className="text-xs text-gray-600">3 days ago</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-star text-yellow-600 text-sm"></i>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">Scored 95% on Biology quiz</p>
                  <p className="text-xs text-gray-600">5 days ago</p>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Assignments */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Assignments</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <i className="fas fa-exclamation-triangle text-red-600 mr-3"></i>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Chemistry Lab Report</p>
                    <p className="text-xs text-gray-600">Chemistry 10B</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-red-600">Due Today</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center">
                  <i className="fas fa-flask text-yellow-600 mr-3"></i>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Physics Problem Set</p>
                    <p className="text-xs text-gray-600">Physics 10A</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-yellow-600">Due Tomorrow</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center">
                  <i className="fas fa-book text-blue-600 mr-3"></i>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Biology Reading</p>
                    <p className="text-xs text-gray-600">Biology 10C</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-blue-600">Due Friday</span>
              </div>
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

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around items-center">
          <button className="flex flex-col items-center text-blue-600">
            <i className="fas fa-home text-xl"></i>
            <span className="text-xs mt-1">Home</span>
          </button>
          <button className="flex flex-col items-center text-gray-400 hover:text-blue-600">
            <i className="fas fa-book text-xl"></i>
            <span className="text-xs mt-1">Lessons</span>
          </button>
          <button className="flex flex-col items-center text-gray-400 hover:text-blue-600">
            <i className="fas fa-brain text-xl"></i>
            <span className="text-xs mt-1">Practice</span>
          </button>
          <button className="flex flex-col items-center text-gray-400 hover:text-blue-600">
            <i className="fas fa-chart-bar text-xl"></i>
            <span className="text-xs mt-1">Analytics</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default StudentDashboard;
