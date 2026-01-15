const TeacherDashboard = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">EduFix</h1>
              <span className="ml-4 text-lg text-gray-700">Teacher Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-3 py-1 text-sm bg-gray-100 rounded-md hover:bg-gray-200">
                <i className="fas fa-globe mr-1"></i>EN
              </button>
              <div className="flex items-center space-x-2">
                <i className="fas fa-user-circle text-2xl text-gray-400"></i>
                <span className="text-sm text-gray-700">Mr. Smith</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Class Selector and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-4">
              <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Chemistry 10B (26 students)</option>
                <option>Physics 10A (24 students)</option>
                <option>Biology 10C (22 students)</option>
              </select>
              <span className="text-sm text-gray-600">Updated 5 min ago</span>
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                <i className="fas fa-plus mr-2"></i>Create Assignment
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                <i className="fas fa-download mr-2"></i>Export Report
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                <i className="fas fa-filter mr-2"></i>Filters ▼
              </button>
            </div>
          </div>
        </div>

        {/* At-a-Glance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Homework Completion</p>
                <p className="text-3xl font-bold text-green-600">92%</p>
                <p className="text-xs text-gray-500">24/26 students</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <i className="fas fa-check-circle text-green-600 text-2xl"></i>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium">+5%</span>
              <span className="text-gray-600 ml-2">from last week</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Class Mastery</p>
                <p className="text-3xl font-bold text-blue-600">65%</p>
                <p className="text-xs text-gray-500">Average score</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <i className="fas fa-chart-line text-blue-600 text-2xl"></i>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-blue-600 font-medium">+3%</span>
              <span className="text-gray-600 ml-2">from last week</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">At-Risk Students</p>
                <p className="text-3xl font-bold text-red-600">3</p>
                <p className="text-xs text-gray-500">Need attention</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <i className="fas fa-exclamation-triangle text-red-600 text-2xl"></i>
              </div>
            </div>
            <div className="mt-4">
              <button className="text-sm text-red-600 hover:text-red-800 font-medium">
                View details →
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Today</p>
                <p className="text-3xl font-bold text-purple-600">23</p>
                <p className="text-xs text-gray-500">Students online</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <i className="fas fa-users text-purple-600 text-2xl"></i>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-purple-600 font-medium">89%</span>
              <span className="text-gray-600 ml-2">attendance rate</span>
            </div>
          </div>
        </div>

        {/* Top Struggling Topics and Mastery Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Struggling Topics */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-medium text-gray-900">Top Struggling Topics</h3>
              <p className="text-sm text-gray-600 mt-1">Topics where students need the most help</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                    <div>
                      <p className="font-medium text-gray-900">Redox Reactions</p>
                      <p className="text-sm text-gray-600">8 students struggling (31%)</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-red-600">52%</p>
                    <p className="text-xs text-gray-500">avg mastery</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
                    <div>
                      <p className="font-medium text-gray-900">Limiting Reactants</p>
                      <p className="text-sm text-gray-600">6 students struggling (23%)</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-orange-600">58%</p>
                    <p className="text-xs text-gray-500">avg mastery</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                    <div>
                      <p className="font-medium text-gray-900">Oxidation States</p>
                      <p className="text-sm text-gray-600">5 students struggling (19%)</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-yellow-600">61%</p>
                    <p className="text-xs text-gray-500">avg mastery</p>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Create Remediation Plan
                </button>
              </div>
            </div>
          </div>

          {/* Class Mastery Distribution */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-medium text-gray-900">Class Mastery Distribution</h3>
              <p className="text-sm text-gray-600 mt-1">How students are performing across all topics</p>
            </div>
            <div className="p-6">
              <div className="relative h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <i className="fas fa-chart-pie text-4xl text-gray-400 mb-2"></i>
                  <p className="text-gray-500">Chart placeholder</p>
                  <p className="text-sm text-gray-400">Chart.js integration needed</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span>Expert (80%+): 8 students</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span>Proficient: 12 students</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  <span>Developing: 7 students</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span>Beginning: 2 students</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Student List and Actions */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Student Performance</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-600">Sort by:</label>
                  <select className="px-3 py-1 border border-gray-300 rounded-md text-sm">
                    <option>Name</option>
                    <option>Mastery</option>
                    <option>Recent Activity</option>
                    <option>Homework Status</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-600">Filter:</label>
                  <select className="px-3 py-1 border border-gray-300 rounded-md text-sm">
                    <option>All Students</option>
                    <option>At Risk</option>
                    <option>High Performers</option>
                    <option>Missing Work</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mastery</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Homework</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                          <span className="text-white font-medium">AC</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">Alice Chen</div>
                        <div className="text-sm text-gray-500">alice@example.com</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2 mr-3 max-w-24">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">95%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      ✓ Active
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="text-green-600">✓ Done</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">View Profile</button>
                    <button className="text-green-600 hover:text-green-900">Send Message</button>
                  </td>
                </tr>

                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
                          <span className="text-white font-medium">BR</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">Bob Rodriguez</div>
                        <div className="text-sm text-gray-500">bob@example.com</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2 mr-3 max-w-24">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">78%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      ✓ Active
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="text-green-600">✓ Done</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">View Profile</button>
                    <button className="text-green-600 hover:text-green-900">Send Message</button>
                  </td>
                </tr>

                <tr className="hover:bg-gray-50 bg-red-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-red-500 flex items-center justify-center">
                          <span className="text-white font-medium">SC</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">Sarah Chen</div>
                        <div className="text-sm text-gray-500">sarah@example.com</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2 mr-3 max-w-24">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: '50%' }}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">50%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      ⚠ At Risk
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="text-red-600">⚠ Late</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">View Profile</button>
                    <button className="text-red-600 hover:text-red-900 mr-3">Create Practice</button>
                    <button className="text-green-600 hover:text-green-900">Send Message</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">3</span> of <span className="font-medium">26</span> students
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

      {/* Mobile Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around items-center">
          <button className="flex flex-col items-center text-gray-400 hover:text-blue-600">
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
          <button className="flex flex-col items-center text-blue-600">
            <i className="fas fa-chart-bar text-xl"></i>
            <span className="text-xs mt-1">Dashboard</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default TeacherDashboard;
