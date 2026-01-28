@echo off
REM EduFix Automated UI Testing Runner
REM This script runs automated tests for the React frontend

echo 🚀 EduFix Automated UI Testing Runner
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: Run this script from the frontend/app directory
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
)

echo ✅ Dependencies ready
echo.

REM Run tests based on arguments
if "%1"=="watch" (
    echo 👀 Running tests in watch mode...
    call npm run test:watch
) else if "%1"=="coverage" (
    echo 📊 Running tests with coverage...
    call npm run test:coverage
) else if "%1"=="ci" (
    echo 🔄 Running tests for CI...
    call npm run test:ci
) else (
    echo 🧪 Running all tests...
    call npm test
)

if errorlevel 1 (
    echo ❌ Tests failed!
    echo.
    echo 💡 Common solutions:
    echo   - Check if backend is running on port 8000
    echo   - Ensure all dependencies are installed
    echo   - Check for TypeScript compilation errors
    echo   - Review test failure messages above
    echo.
    pause
    exit /b 1
) else (
    echo ✅ All tests passed!
    echo.
    echo 📊 Test Commands Summary:
    echo   .\scripts\test-runner.bat        # Run all tests
    echo   .\scripts\test-runner.bat watch  # Run in watch mode
    echo   .\scripts\test-runner.bat coverage # Run with coverage
    echo   .\scripts\test-runner.bat ci     # Run for CI/CD
    echo.
    echo 📖 See docs\automated-ui-testing-setup.md for detailed documentation
    echo.
)

pause
