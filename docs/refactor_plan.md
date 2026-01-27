# Dashboard Refactoring Plan: Static to Dynamic Data

## Overview
Modify StudentDashboard and TeacherDashboard components to fetch real data from the database instead of displaying static hardcoded content, following the pattern established in ManagerDashboard.tsx.

## Current State Analysis
- **StudentDashboard.tsx**: Displays hardcoded metrics (4 classes, 23 completed tasks, 87% grade, etc.)
- **TeacherDashboard.tsx**: Displays hardcoded metrics (26 students, 92% completion, 3 at-risk students, etc.)
- **ManagerDashboard.tsx**: ✅ Already implemented with React Query and API integration

## Available Backend APIs

### For Teachers
- `/api/analytics/dashboard` - Dashboard metrics (total students, active today, average mastery, etc.)
- `/api/analytics/students/{student_id}/insights` - Individual student performance data
- `/api/analytics/classes/{class_id}/progress` - Class progress overview
- `/api/analytics/interventions` - Intervention management

### For Students
- `/api/practice/mastery` - Mastery scores across topics
- `/api/practice/gamification` - Points, badges, streak data
- `/api/content/courses` - Available courses for student's class
- `/api/content/lessons` - Available lessons for courses

## Missing Backend APIs
- [x] **Student Dashboard API** - `/api/analytics/student/dashboard`
  - Classes enrolled in
  - Recent activity (completed assignments, practice sessions)
  - Upcoming assignments
  - Overall progress metrics

- [x] **Teacher Class Details API** - `/api/analytics/teacher/classes/{class_id}/details`
  - Student list with performance data
  - At-risk students identification
  - Topic mastery distribution

## Implementation Plan

### Phase 1: Backend API Development
- [x] Add student dashboard endpoint in `analytics.py`
- [x] Add teacher class details endpoint in `analytics.py`
- [ ] Test new endpoints with existing demo data

### Phase 2: StudentDashboard Refactoring
- [x] Import React Query hooks (`useQuery`)
- [x] Replace hardcoded "Active Classes" metric with API data
- [x] Replace hardcoded "Completed Tasks" metric with recent activity data
- [x] Replace hardcoded "Average Grade" with mastery score calculations
- [x] Replace hardcoded "Current Streak" with gamification data
- [x] Fetch and display real class list from courses API
- [x] Implement recent activity feed with real data
- [x] Add upcoming assignments section with dynamic data
- [x] Add loading states and error handling (following ManagerDashboard pattern)

### Phase 3: TeacherDashboard Refactoring
- [x] Import React Query hooks (`useQuery`)
- [x] Replace hardcoded metrics with `/api/analytics/dashboard` data
- [x] Implement class selector functionality with real class data
- [x] Fetch student list and performance data dynamically
- [x] Replace hardcoded student table with API-driven data
- [x] Implement "At-Risk Students" identification with real criteria
- [x] Add topic struggling analysis with real mastery data
- [x] Add loading states and error handling

### Phase 4: Code Quality & Refactoring
- [x] Extract common loading/error state components
- [x] Create shared utility functions for data formatting
- [x] Implement consistent date formatting helpers
- [x] Add proper TypeScript interfaces for API responses
- [x] Ensure consistent error handling patterns across dashboards

### Phase 5: Testing & Polish
- [x] Test all dashboard interactions with real data
- [x] Verify data accuracy against database values
- [x] Test loading states and error scenarios
- [x] Performance testing with larger datasets
- [x] Update component documentation and comments
- [x] Code review and final cleanup

## Key Benefits
- **Real-time Data**: Dashboards reflect actual student/teacher data
- **Consistency**: All dashboards follow ManagerDashboard patterns
- **Maintainability**: Centralized data fetching logic
- **Scalability**: Easy to extend with new dashboard features

## Technical Notes
- Use React Query for data fetching and caching
- Follow existing error handling patterns from ManagerDashboard
- Maintain responsive design and existing UI/UX
- Ensure backward compatibility with existing auth system
- Consider performance implications for larger datasets
