const ManagerDashboard = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">EduFix</h1>
              <span className="ml-4 text-lg text-gray-700">Management Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-3 py-1 text-sm bg-gray-100 rounded-md hover:bg-gray-200">
                <i className="fas fa-globe mr-1"></i>EN
              </button>
              <div className="flex items-center space-x-2">
                <i className="fas fa-user-shield text-2xl text-purple-400"></i>
                <span className="text-sm text-gray-700">Manager</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Platform Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Teachers</p>
                <p className="text-3xl font-bold text-blue-600">12</p>
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
                <p className="text-3xl font-bold text-green-600">248</p>
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
                <p className="text-3xl font-bold text-purple-600">18</p>
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
                <p className="text-3xl font-bold text-orange-600">156</p>
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
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                          <span className="text-white font-medium">JS</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">John Smith</div>
                        <div className="text-sm text-gray-500">john.smith@school.edu</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">3</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">42</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Jan 2024</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">View Classes</button>
                    <button className="text-green-600 hover:text-green-900">Contact</button>
                  </td>
                </tr>

                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
                          <span className="text-white font-medium">MJ</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">Maria Johnson</div>
                        <div className="text-sm text-gray-500">maria.johnson@school.edu</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">28</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Mar 2024</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">View Classes</button>
                    <button className="text-green-600 hover:text-green-900">Contact</button>
                  </td>
                </tr>

                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center">
                          <span className="text-white font-medium">RB</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">Robert Brown</div>
                        <div className="text-sm text-gray-500">robert.brown@school.edu</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">4</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">56</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Sep 2023</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">View Classes</button>
                    <button className="text-green-600 hover:text-green-900">Contact</button>
                  </td>
                </tr>
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
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                      <span className="text-white font-medium text-sm">AC</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Alice Chen</p>
                      <p className="text-sm text-gray-600">Chemistry 10B • Ms. Smith</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">95% mastery</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center mr-3">
                      <span className="text-white font-medium text-sm">BR</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Bob Rodriguez</p>
                      <p className="text-sm text-gray-600">Physics 10A • Mr. Johnson</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-blue-600">78% mastery</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center mr-3">
                      <span className="text-white font-medium text-sm">SC</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Sarah Chen</p>
                      <p className="text-sm text-red-600">Biology 10C • Ms. Davis</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-red-600">50% mastery</p>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                  View All Students (248)
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
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                      <i className="fas fa-flask text-blue-600"></i>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Chemistry 10B</p>
                      <p className="text-sm text-gray-600">John Smith • 26 students</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mr-3">
                      <i className="fas fa-atom text-green-600"></i>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Physics 10A</p>
                      <p className="text-sm text-gray-600">Maria Johnson • 24 students</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mr-3">
                      <i className="fas fa-dna text-purple-600"></i>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Biology 10C</p>
                      <p className="text-sm text-gray-600">Robert Brown • 22 students</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">New</span>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                  View All Classes (18)
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
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">Redox Reactions</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Chemistry 10B → Electrochemistry → Unit 3
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">John Smith</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">15</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2 weeks ago</td>
                </tr>

                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">Newton's Laws</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Physics 10A → Mechanics → Unit 1
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Maria Johnson</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">12</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1 week ago</td>
                </tr>

                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">Cell Structure</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Biology 10C → Cells → Unit 2
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Robert Brown</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">18</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">3 days ago</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">3</span> of <span className="font-medium">156</span> lessons
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
            <i className="fas fa-users text-xl"></i>
            <span className="text-xs mt-1">Teachers</span>
          </button>
          <button className="flex flex-col items-center text-gray-400 hover:text-blue-600">
            <i className="fas fa-school text-xl"></i>
            <span className="text-xs mt-1">Classes</span>
          </button>
          <button className="flex flex-col items-center text-purple-600">
            <i className="fas fa-cog text-xl"></i>
            <span className="text-xs mt-1">Manage</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default ManagerDashboard;
