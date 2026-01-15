const Practice = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button className="mr-4 text-gray-400 hover:text-gray-600">
                <i className="fas fa-arrow-left text-xl"></i>
              </button>
              <h1 className="text-lg font-semibold text-gray-900">Stoichiometry Practice</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-3 py-1 text-sm bg-gray-100 rounded-md hover:bg-gray-200">
                <i className="fas fa-globe mr-1"></i>EN
              </button>
              <div className="text-sm text-gray-600">
                Q3/10
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Header */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Topic: Stoichiometry</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Medium</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Progress:</span>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                If 2 moles of O₂ react with 4 moles of C, how many moles of CO₂ are produced?
              </h2>

              <div className="bg-gray-50 rounded-lg p-4 mb-6 inline-block">
                <div className="text-xl font-mono text-gray-800">
                  C + O₂ → CO₂
                </div>
              </div>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <button className="answer-option p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left">
                <span className="text-lg">○ 2 moles</span>
              </button>
              <button className="answer-option p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left">
                <span className="text-lg">○ 3 moles</span>
              </button>
              <button className="answer-option p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left">
                <span className="text-lg">○ 4 moles</span>
              </button>
              <button className="answer-option p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left">
                <span className="text-lg">○ 1 mole</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Check Answer
              </button>
              <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                Need a Hint?
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button className="p-4 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors text-center">
                <i className="fas fa-forward text-orange-600 text-xl mb-2"></i>
                <div className="text-sm font-medium text-orange-900">Skip Question</div>
                <div className="text-xs text-orange-700">Move to next</div>
              </button>

              <button className="p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors text-center">
                <i className="fas fa-eye text-red-600 text-xl mb-2"></i>
                <div className="text-sm font-medium text-red-900">Show Solution</div>
                <div className="text-xs text-red-700">Complete answer</div>
              </button>

              <button className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-center">
                <i className="fas fa-book text-blue-600 text-xl mb-2"></i>
                <div className="text-sm font-medium text-blue-900">Review Topic</div>
                <div className="text-xs text-blue-700">Back to lesson</div>
              </button>
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
            <span className="text-xs mt-1">Lesson</span>
          </button>
          <button className="flex flex-col items-center text-blue-600">
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

export default Practice;
