# Header and Footer Refactoring Plan

## Overview
Refactor page headers and footers into shared components for consistency across all pages, remove role selection at login (determine role from username), and add standard user menu with logout functionality.

## Current State Analysis

### Headers
All dashboard components (StudentDashboard, TeacherDashboard, ManagerDashboard) have similar header structures:
- EduFix logo and title
- Dashboard-specific subtitle
- Language selector (EN)
- User avatar/name display
- Logout functionality (only in ManagerDashboard)

### Footers
Only Login component has a footer with copyright info.

### Login
Currently requires manual role selection (Student/Teacher/Manager) before authentication.

### Backend
User roles are stored in the database and returned by the `/auth/users/me` endpoint.

## Implementation Plan

### Phase 1: Create Shared Components
- [x] **Create `Header.tsx`** in `frontend/app/src/components/shared/`:
  - Props: `title` (dashboard type), `user` (user object), `showUserMenu` (boolean)
  - Include EduFix logo, title, language selector, user menu dropdown
  - User menu with: Profile, Settings, Logout options
  - Responsive design for mobile/desktop

- [x] **Create `Footer.tsx`** in `frontend/app/src/components/shared/`:
  - Simple copyright footer component
  - Consistent styling across all pages

### Phase 2: Refactor Login Component
- [x] **Remove role selection UI** from Login.tsx
- [x] **Modify login flow**:
  - Authenticate with username/password only
  - Fetch user details from `/auth/users/me` after successful login
  - Redirect based on user.role from backend (student → /student, teacher → /teacher, manager → /manager)
  - Store user object in localStorage or React context

### Phase 3: Update Dashboard Components
- [x] **StudentDashboard.tsx**: Replace inline header with `<Header title="Student Dashboard" user={user} showUserMenu={true} />`
- [ ] **TeacherDashboard.tsx**: Replace inline header with `<Header title="Teacher Dashboard" user={user} showUserMenu={true} />`
- [ ] **ManagerDashboard.tsx**: Replace inline header with `<Header title="Management Dashboard" user={user} showUserMenu={true} />`
- [ ] **Add Footer** to all dashboard pages

### Phase 4: Update App Structure
- [ ] **App.tsx**: Add user context/state management to store authenticated user
- [ ] **Add logout functionality** that clears user state and redirects to login
- [ ] **Protected routes**: Ensure user role matches dashboard type

### Phase 5: Testing & Polish
- [ ] Test login flow with different user roles
- [ ] Verify header/footer consistency across all pages
- [ ] Test user menu logout functionality
- [ ] Mobile responsiveness verification
- [ ] Update any documentation

## Key Benefits
- **DRY Principle**: Single header/footer components used across all pages
- **Consistency**: Uniform navigation and branding experience
- **Maintainability**: Changes to header/footer affect all pages automatically
- **Better UX**: Role automatically determined from database, no manual selection
- **Security**: Proper role-based routing from backend data

## Technical Considerations
- Need to add user context/state management for authenticated user data
- Header component should handle user menu dropdown with logout
- Login component needs to fetch user details after authentication
- Consider adding loading states during user data fetching
- Maintain existing responsive design patterns

## Files to Modify
- `frontend/app/src/components/shared/Header.tsx` (new)
- `frontend/app/src/components/shared/Footer.tsx` (new)
- `frontend/app/src/components/Login.tsx`
- `frontend/app/src/components/StudentDashboard.tsx`
- `frontend/app/src/components/TeacherDashboard.tsx`
- `frontend/app/src/components/ManagerDashboard.tsx`
- `frontend/app/src/App.tsx`
- `frontend/app/src/types/api.ts` (add user types if needed)

## Acceptance Criteria
- [ ] Header and footer components created and working
- [ ] Login no longer requires role selection
- [ ] User role automatically determined from backend
- [ ] User menu with logout functionality implemented
- [ ] All dashboard pages use shared header/footer
- [ ] Responsive design maintained
- [ ] No breaking changes to existing functionality
