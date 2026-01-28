# EduFix Automated UI Testing Runner (PowerShell)
# This script runs automated tests for the React frontend

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("watch", "coverage", "ci")]
    [string]$Mode
)

Write-Host "🚀 EduFix Automated UI Testing Runner (PowerShell)" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (!(Test-Path "package.json")) {
    Write-Host "❌ Error: Run this script from the frontend/app directory" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if node_modules exists
if (!(Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

Write-Host "✅ Dependencies ready" -ForegroundColor Green
Write-Host ""

# Run tests based on mode
switch ($Mode) {
    "watch" {
        Write-Host "👀 Running tests in watch mode..." -ForegroundColor Blue
        npm run test:watch
    }
    "coverage" {
        Write-Host "📊 Running tests with coverage..." -ForegroundColor Magenta
        npm run test:coverage
    }
    "ci" {
        Write-Host "🔄 Running tests for CI..." -ForegroundColor DarkYellow
        npm run test:ci
    }
    default {
        Write-Host "🧪 Running all tests..." -ForegroundColor Green
        npm test
    }
}

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ All tests passed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📊 Test Commands Summary:" -ForegroundColor Cyan
    Write-Host "  .\scripts\test-runner.ps1        # Run all tests" -ForegroundColor White
    Write-Host "  .\scripts\test-runner.ps1 -Mode watch  # Run in watch mode" -ForegroundColor White
    Write-Host "  .\scripts\test-runner.ps1 -Mode coverage # Run with coverage" -ForegroundColor White
    Write-Host "  .\scripts\test-runner.ps1 -Mode ci # Run for CI/CD" -ForegroundColor White
    Write-Host ""
    Write-Host "📖 See docs\automated-ui-testing-setup.md for detailed documentation" -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Tests failed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Common solutions:" -ForegroundColor Yellow
    Write-Host "  - Check if backend is running on port 8000" -ForegroundColor White
    Write-Host "  - Ensure all dependencies are installed" -ForegroundColor White
    Write-Host "  - Check for TypeScript compilation errors" -ForegroundColor White
    Write-Host "  - Review test failure messages above" -ForegroundColor White
    Write-Host ""
}

Read-Host "Press Enter to exit"
