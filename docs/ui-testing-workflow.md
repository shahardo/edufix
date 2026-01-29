# EduFix UI Testing Workflow Guide

## Overview
This guide provides comprehensive testing procedures for EduFix UI workflows, covering authentication, navigation, and user interactions across different roles.

## Prerequisites
- Frontend running on: `http://localhost:5173`
- Backend running on: `http://0.0.0.0:8000`
- Demo credentials available in Login component

## Testing Environments

### Development Testing
- **Frontend**: `http://localhost:5173`
- **Backend**: `http://0.0.0.0:8000`
- **Browser**: Chrome/Firefox latest versions
- **Network**: Fast 3G or faster for realistic testing

### Demo Credentials
```
Manager: manager / pass123
Teacher: teacher1 / pass123
Student: student1 / pass123
```

## 1. Authentication Flow Testing

### Test Case 1.1: Student Login Flow
**Objective**: Verify student authentication and redirection

**Steps**:
1. Navigate to `http://localhost:5173`
2. Enter credentials: `student1` / `pass123`
3. Click "Sign in"
4. **Expected**: Redirect to `/student` dashboard
5. **Verify**: URL changes to `/student`
6. **Verify**: Header shows "Student Dashboard"
7. **Verify**: Footer shows student navigation (Home, Lessons, Exercises, Analytics)

### Test Case 1.2: Teacher Login Flow
**Objective**: Verify teacher authentication and redirection

**Steps**:
1. Navigate to `http://localhost:5173`
2. Enter credentials: `teacher1` / `pass123`
3. Click "Sign in"
4. **Expected**: Redirect to `/teacher` dashboard
5. **Verify**: URL changes to `/teacher`
6. **Verify**: Header shows "Teacher Dashboard"
7. **Verify**: Footer shows teacher navigation (Home, Lessons, Practice, Dashboard)

### Test Case 1.3: Manager Login Flow
**Objective**: Verify manager authentication and redirection

**Steps**:
1. Navigate to `http://localhost:5173`
2. Enter credentials: `manager` / `pass123`
3. Click "Sign in"
4. **Expected**: Redirect to `/manager` dashboard
5. **Verify**: URL changes to `/manager`
6. **Verify**: Header shows "Management Dashboard"
7. **Verify**: Footer shows manager navigation (Home, Teachers, Classes, Manage)

### Test Case 1.4: Invalid Login Handling
**Objective**: Verify error handling for invalid credentials

**Steps**:
1. Navigate to `http://localhost:5173`
2. Enter invalid credentials: `invalid` / `wrongpass`
3. Click "Sign in"
4. **Expected**: Error message appears
5. **Verify**: No redirection occurs
6. **Verify**: Error message is user-friendly

## 2. Navigation Testing

### Test Case 2.1: Header Navigation
**Objective**: Verify header functionality across all dashboards

**Steps**:
1. Login as any user role
2. **Verify**: Header is fixed at top (doesn't scroll)
3. **Verify**: EduFix logo is visible and clickable
4. **Verify**: Dashboard title matches user role
5. **Verify**: Language selector (EN) is present
6. **Verify**: User menu shows full name and dropdown on click
7. **Test**: User menu dropdown (Profile, Settings, Logout options)

### Test Case 2.2: Footer Navigation - Mobile
**Objective**: Verify mobile footer navigation

**Prerequisites**: Browser width < 1024px (mobile/tablet view)

**Steps**:
1. Login as student
2. **Verify**: Footer navigation is fixed at bottom
3. **Verify**: 4 navigation buttons visible (Home, Lessons, Exercises, Analytics)
4. **Test**: Each button highlights when active
5. **Test**: Clicking buttons updates active state
6. Repeat for teacher and manager roles with appropriate navigation items

### Test Case 2.3: Footer Navigation - Desktop
**Objective**: Verify desktop footer navigation

**Prerequisites**: Browser width ≥ 1024px (desktop view)

**Steps**:
1. Login as student
2. **Verify**: Footer is fixed at bottom
3. **Verify**: Copyright text on left
4. **Verify**: Navigation links on right (Home, Lessons, Exercises, Analytics)
5. **Test**: Links highlight on hover
6. **Test**: Active page link is visually distinguished
7. Repeat for teacher and manager roles

### Test Case 2.4: Protected Route Testing
**Objective**: Verify role-based access control

**Steps**:
1. Login as student
2. Manually navigate to `/teacher` in browser
3. **Expected**: Automatic redirect to `/student`
4. Login as teacher, try accessing `/manager`
5. **Expected**: Automatic redirect to `/teacher`
6. Login as manager, try accessing `/student`
7. **Expected**: Automatic redirect to `/manager`

## 3. Dashboard-Specific Testing

### Test Case 3.1: Student Dashboard
**Objective**: Verify student dashboard functionality

**Steps**:
1. Login as student (`student1` / `pass123`)
2. **Verify**: Welcome section with assignment count
3. **Verify**: Quick stats (Active Classes, Completed Tasks, Average Grade, Current Streak)
4. **Verify**: My Classes section with course cards
5. **Verify**: Recent Activity feed
6. **Verify**: Upcoming Assignments section
7. **Verify**: Messages & Notifications section
8. **Test**: Footer navigation between sections
9. **Test**: Responsive design on different screen sizes

### Test Case 3.2: Teacher Dashboard
**Objective**: Verify teacher dashboard functionality

**Steps**:
1. Login as teacher (`teacher1` / `pass123`)
2. **Verify**: Class selector dropdown
3. **Verify**: At-a-glance metrics (Homework Completion, Class Mastery, Total Students, Active Today)
4. **Verify**: Top Struggling Topics section
5. **Verify**: Class Mastery Distribution chart placeholder
6. **Verify**: Student Performance table
7. **Test**: Class selection changes displayed data
8. **Test**: Student table sorting and filtering
9. **Verify**: Responsive design

### Test Case 3.3: Manager Dashboard
**Objective**: Verify manager dashboard functionality

**Steps**:
1. Login as manager (`manager` / `pass123`)
2. **Verify**: Platform overview metrics (Total Teachers, Students, Classes, Lessons)
3. **Verify**: Teachers Overview table
4. **Verify**: Students Overview section
5. **Verify**: Classes Overview section
6. **Verify**: Lessons Overview table
7. **Test**: Table sorting and pagination
8. **Test**: Add buttons functionality (placeholders)
9. **Verify**: Responsive design

## 4. Logout Testing

### Test Case 4.1: Logout Functionality
**Objective**: Verify logout clears session and redirects

**Steps**:
1. Login as any user
2. Click user menu in header
3. Click "Logout"
4. **Expected**: Redirect to login page (`/`)
5. **Verify**: Cannot access protected routes without re-authentication
6. **Verify**: localStorage is cleared of tokens

### Test Case 4.2: Session Persistence
**Objective**: Verify login persistence across browser sessions

**Steps**:
1. Login as any user
2. Close browser tab
3. Reopen application URL
4. **Expected**: Automatic login (no need to re-enter credentials)
5. **Verify**: User context is restored from localStorage

## 5. Responsive Design Testing

### Test Case 5.1: Mobile Responsiveness
**Objective**: Verify mobile layout and functionality

**Prerequisites**: Browser dev tools mobile view or actual mobile device

**Steps**:
1. Test all dashboards on mobile screen sizes (< 768px)
2. **Verify**: Header adapts appropriately
3. **Verify**: Footer shows mobile navigation
4. **Verify**: Content is readable and touch-friendly
5. **Verify**: Tables become horizontally scrollable
6. **Test**: Touch interactions work properly

### Test Case 5.2: Tablet Responsiveness
**Objective**: Verify tablet layout

**Prerequisites**: Browser width 768px - 1023px

**Steps**:
1. Test all dashboards on tablet screen sizes
2. **Verify**: Desktop footer navigation appears
3. **Verify**: Mobile navigation is hidden
4. **Verify**: Content layout adapts appropriately
5. **Test**: Touch and mouse interactions

### Test Case 5.3: Desktop Responsiveness
**Objective**: Verify desktop layout

**Prerequisites**: Browser width ≥ 1024px

**Steps**:
1. Test all dashboards on desktop screen sizes
2. **Verify**: Full desktop footer navigation
3. **Verify**: All content properly laid out
4. **Verify**: Hover states work on navigation links
5. **Test**: Keyboard navigation

## 6. Error Handling Testing

### Test Case 6.1: Network Error Handling
**Objective**: Verify graceful handling of network issues

**Steps**:
1. Login as any user
2. Use browser dev tools to simulate offline
3. Navigate between sections
4. **Expected**: Appropriate error messages or offline indicators
5. Restore connection
6. **Verify**: Application recovers gracefully

### Test Case 6.2: API Error Handling
**Objective**: Verify API failure handling

**Steps**:
1. Temporarily stop backend server
2. Login attempt
3. **Expected**: Clear error message about connection issues
4. Restart backend, retry login
5. **Verify**: Successful login after backend recovery

## 7. Performance Testing

### Test Case 7.1: Initial Load Performance
**Objective**: Verify application loads quickly

**Steps**:
1. Clear browser cache
2. Navigate to application URL
3. **Measure**: Time to first meaningful paint
4. **Verify**: Loading spinner appears during data fetching
5. **Verify**: No console errors

### Test Case 7.2: Navigation Performance
**Objective**: Verify smooth navigation between sections

**Steps**:
1. Login and navigate through all sections
2. **Verify**: No significant delays
3. **Verify**: Loading states for async operations
4. **Test**: Back/forward browser navigation

## 8. Accessibility Testing

### Test Case 8.1: Keyboard Navigation
**Objective**: Verify keyboard accessibility

**Steps**:
1. Use Tab key to navigate through all interactive elements
2. **Verify**: Logical tab order
3. **Verify**: Focus indicators are visible
4. **Test**: Enter/Space to activate buttons
5. **Test**: Escape to close dropdowns

### Test Case 8.2: Screen Reader Compatibility
**Objective**: Verify screen reader support

**Steps**:
1. Enable browser screen reader
2. Navigate through application
3. **Verify**: Meaningful alt text and labels
4. **Verify**: ARIA attributes where needed
5. **Test**: Form error announcements

## 9. Cross-Browser Testing

### Test Case 9.1: Browser Compatibility
**Objective**: Verify functionality across browsers

**Supported Browsers**:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Steps**:
1. Test complete workflow on each supported browser
2. **Verify**: Consistent appearance and functionality
3. **Verify**: No browser-specific errors

## 10. Automated Testing Setup

### Unit Tests
```bash
# Run React component tests
cd frontend/app
npm test

# Run with coverage
npm test -- --coverage
```

### Integration Tests
```bash
# Run backend API tests
cd backend
python -m pytest tests/ -v

# Run with coverage
python -m pytest tests/ --cov=app --cov-report=html
```

### End-to-End Tests (Future)
```bash
# Setup for E2E testing with Playwright/Cypress
npm run test:e2e
```

## Success Criteria

### Functional Testing
- [x] All login flows work for all user roles
- [x] Navigation works correctly across all components
- [x] Protected routes enforce proper access control
- [x] Logout functionality works correctly

### User Experience Testing
- [x] Responsive design works on all screen sizes
- [x] Loading states provide good user feedback
- [x] Error messages are clear and actionable
- [ ] Performance is acceptable (< 2s load times)

### Quality Assurance
- [ ] No console errors during normal usage
- [ ] Accessibility standards met (WCAG 2.1 AA)
- [ ] Cross-browser compatibility verified
- [x] Automated test coverage > 80%

## Common Issues & Troubleshooting

### Issue: Authentication not working
**Symptoms**: Login fails or redirects incorrectly
**Solutions**:
1. Check backend server is running on port 8000
2. Verify demo credentials are correct
3. Check browser console for network errors
4. Clear localStorage and retry

### Issue: Navigation not working
**Symptoms**: Footer links don't navigate
**Solutions**:
1. Check if routes are properly configured in App.tsx
2. Verify ProtectedRoute wrapper is correct
3. Check browser console for routing errors

### Issue: Components not rendering
**Symptoms**: Blank screens or missing content
**Solutions**:
1. Check React developer tools for component errors
2. Verify API endpoints are responding
3. Check network tab for failed requests
4. Verify environment variables are set

### Issue: Styling issues
**Symptoms**: Layout problems or missing styles
**Solutions**:
1. Check Tailwind CSS is properly configured
2. Verify responsive breakpoints are working
3. Check for CSS conflicts or overrides

This comprehensive testing workflow ensures the EduFix UI provides a robust, accessible, and user-friendly experience across all supported scenarios and devices.
