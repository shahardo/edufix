# Cline Development Rules for EduFix

This document outlines the development guidelines and best practices that Cline should follow when working on the EduFix project.

## Environment Setup

### Virtual Environments
- **Backend**: Always activate the virtual environment located in `backend/venv/` before running Python commands, tests, or development servers
- **Frontend**: Always activate the virtual environment located in `frontend/venv/` (if applicable) before running Node.js commands, build processes, or development servers
- **Installation**: When installing dependencies, use the appropriate virtual environment and ensure all packages are installed within the correct environment scope

## Testing Requirements

### Test Coverage
- **New Features**: Every new feature must include comprehensive unit tests and integration tests
- **Bug Fixes**: Any bug fix must include a test case that reproduces the bug and verifies the fix
- **Test Structure**: Follow the existing test patterns in `backend/tests/` and `frontend/tests/` (if applicable)
- **Test Execution**: Run all tests before committing changes to ensure no regressions

### Testing Commands
```bash
# Backend tests
cd backend && venv\Scripts\activate && python -m pytest tests/ -v

# Frontend tests (if applicable)
cd frontend && npm test
```

## Documentation Updates

### README Updates
- **New Features**: Update `README.md` with documentation for any new features, including:
  - Feature description
  - Usage instructions
  - API endpoints (if applicable)
  - Configuration requirements
- **Breaking Changes**: Clearly document any breaking changes in the changelog
- **Screenshots/Demos**: Include screenshots or demo instructions for UI features

### API Documentation
- **Endpoint Documentation**: Update `docs/devplan.md` or create dedicated API documentation for new backend endpoints
- **Request/Response Examples**: Provide clear examples of API requests and responses
- **Error Codes**: Document error responses and status codes

## Code Quality Standards

### Code Clarity and Conciseness
- **Readability**: Write self-documenting code with clear variable names and logical structure
- **DRY Principle**: Avoid code duplication; refactor common patterns into reusable functions/classes
- **Comments**: Add comments only where necessary to explain complex business logic, not obvious operations
- **Function Length**: Keep functions focused and reasonably sized; break down complex functions into smaller, testable units

### Minimal Changes
- **Surgical Edits**: Only modify code that directly relates to the task at hand
- **Preserve Existing Logic**: Do not change working code unless it's directly affected by the current task
- **Backward Compatibility**: Maintain backward compatibility unless explicitly required to break it
- **Configuration Preservation**: Keep existing configurations, dependencies, and project structure intact

## Development Workflow

### Before Implementation
1. **Understand Requirements**: Fully analyze the task requirements and existing codebase
2. **Plan Changes**: Create a clear plan of what needs to be modified, added, or removed
3. **Check Dependencies**: Identify any new dependencies or configuration changes needed

### During Implementation
1. **Incremental Changes**: Make small, testable changes rather than large monolithic updates
2. **Test Frequently**: Run tests after each significant change to catch issues early
3. **Follow Patterns**: Use existing code patterns, naming conventions, and architectural decisions

### After Implementation
1. **Comprehensive Testing**: Run all tests and verify functionality manually if needed
2. **Documentation Update**: Update all relevant documentation as specified above
3. **Code Review**: Ensure the code follows all quality standards before finalizing

## File Organization

### Backend Structure
- Keep router files in `backend/routers/`
- Place tests in `backend/tests/` with descriptive names
- Store configuration in appropriate config files
- Maintain clean separation between models, routers, and utilities

### Frontend Structure (if applicable)
- Organize components logically by feature
- Keep styles consistent with existing patterns
- Maintain proper asset organization

## Error Handling and Logging

### Backend Error Handling
- Implement proper error responses with meaningful messages
- Use appropriate HTTP status codes
- Log errors for debugging while keeping sensitive information secure

### Validation
- Validate all user inputs on both frontend and backend
- Provide clear error messages for validation failures
- Handle edge cases gracefully

## Performance Considerations

### Backend Optimization
- Write efficient database queries
- Implement appropriate indexing for new database operations
- Consider caching strategies for frequently accessed data
- Avoid N+1 query problems

### Frontend Optimization (if applicable)
- Optimize bundle sizes and loading times
- Implement lazy loading where appropriate
- Minimize unnecessary re-renders

## Security Best Practices

### Authentication & Authorization
- Always verify user permissions before allowing access to protected resources
- Implement proper token validation and refresh mechanisms
- Sanitize all user inputs to prevent injection attacks

### Data Protection
- Never log sensitive information like passwords or tokens
- Implement proper data validation and sanitization
- Follow OWASP guidelines for web application security

## Commit Guidelines

### Commit Messages
- Write clear, descriptive commit messages
- Reference issue numbers when applicable
- Group related changes logically

### Commit Frequency
- Commit frequently for completed, working features
- Avoid committing broken or untested code
- Use feature branches for larger changes

## Code Review Checklist

Before marking a task complete, ensure:
- [ ] All tests pass
- [ ] Code follows established patterns
- [ ] Documentation is updated
- [ ] No unnecessary changes were made
- [ ] Security best practices are followed
- [ ] Performance impact is considered
- [ ] Error handling is appropriate
