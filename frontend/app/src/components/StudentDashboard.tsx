const StudentDashboard = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">EduFix</h1>
              <span className="ml-4 text-lg text-gray-700">Class: Chemistry</span>
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
        {/* Today's Lesson */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Lesson</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-blue-900">Chemistry: Stoichiometry</h3>
            <p className="text-blue-700 mt-1">Starts: 10:00 AM | Duration: 45 min</p>
            <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              <i className="fas fa-play mr-2"></i>Go to Lesson
            </button>
          </div>
        </div>

        {/* My Tasks */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">My Tasks</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex items-center">
                <input type="checkbox" className="mr-3 text-yellow-600" />
                <i className="fas fa-flask text-yellow-600 mr-3"></i>
                <span className="text-gray-900">Homework: Balancing Equations</span>
              </div>
              <span className="text-sm text-yellow-700">Due: Today</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex items-center">
                <input type="checkbox" className="mr-3 text-blue-600" />
                <i className="fas fa-atom text-blue-600 mr-3"></i>
                <span className="text-gray-900">Practice: Oxidation States</span>
              </div>
              <span className="text-sm text-blue-700">Due: Tomorrow</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center">
                <input type="checkbox" className="mr-3 text-green-600" />
                <i className="fas fa-project-diagram text-green-600 mr-3"></i>
                <span className="text-gray-900">Project: Periodic Table</span>
              </div>
              <span className="text-sm text-green-700">Due: Fri, Jan 17</span>
            </div>
          </div>
        </div>

        {/* My Progress */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">My Progress</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-900">Stoichiometry:</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
                <span className="text-sm font-medium text-green-600">80%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-900">Oxidation States:</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
                <span className="text-sm font-medium text-yellow-600">60%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-900">Bonding:</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
                <span className="text-sm font-medium text-green-600">100%</span>
              </div>
            </div>
            <div className="pt-2 border-t">
              <span className="text-lg font-medium text-orange-600">Current Streak: 12 days 🔥</span>
            </div>
          </div>
        </div>

        {/* My Achievements */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">My Achievements</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg">
              <div className="flex items-center">
                <span className="text-2xl mr-3">🎯</span>
                <div>
                  <div className="text-lg font-bold">Points: 1,240</div>
                  <div className="text-purple-100">Rank: 5th in class</div>
                </div>
              </div>
              <i className="fas fa-trophy text-3xl text-yellow-300"></i>
            </div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg">
              <div className="flex items-center">
                <span className="text-2xl mr-3">🏆</span>
                <div>
                  <div className="text-lg font-bold">Badges: "Problem Solver", "Consistent"</div>
                  <div className="text-green-100">📊 Last Activity: 2 hours ago</div>
                </div>
              </div>
              <i className="fas fa-medal text-3xl text-yellow-300"></i>
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
            <span className="text-xs mt-1">Dashboard</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default StudentDashboard;
